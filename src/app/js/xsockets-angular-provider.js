angular.module('XSockets.angularJS', []).provider('$xsCommunication', function () {
    var self = this;
    this.$get = function ($q, $rootScope) {
        var isConnected, listeners = {}, socket, queued = [];
        var Listener = (function () {
            function listener(fn) {
                this._a = fn;
            }
            listener.prototype.delagate = function (fn) {
                this._a = fn;
                return this;
            };
            listener.prototype.invoke = function (a) {
                this._a(a);
                return this;
            };
            return listener;
        })();

        function bind(topic, fn, cb) {
            socket.subscribe(topic, function (a) {
                $rootScope.$apply(function () {
                    listeners[topic].invoke(a);
                }, cb);
            }, cb);
        }
        
        function bindOne(topic, fn, cb) {
            socket.one(topic, function (a) {
                $rootScope.$apply(function () {
                    listeners[topic].invoke(a);
                }, cb);
            }, cb);
        }
        
        function bindMany(topic, count, fn, cb) {
            socket.many(topic,count, function (a) {
                $rootScope.$apply(function () {
                    listeners[topic].invoke(a);
                }, cb);
            }, cb);
        }
        function unbind(topic, fn) {
            if (listeners.hasOwnProperty(topic)) {
                socket.unsubscribe(topic);
                delete listeners[topic];
                if (fn) fn(topic);
            } else {
                throw "Missing '" + topic + "'.unable to remove binding";
            }
        }

        function publish(topic, data, fn) {
            if (isConnected) {
                socket.publish(topic, data);
            } else {
                queued.push({
                    t: topic,
                    d: data || {}
                });
            }
            if (fn) fn(data, isConnected);
        }
        
        function one(topic, cb) {
            if (!listeners.hasOwnProperty(topic)) {
                listeners[topic] = new Listener();
                bindOne(topic, listeners[topic], cb);
                return listeners[topic];
            }
            return listeners[topic];
        }
        
        function many(topic,count, cb) {
            if (!listeners.hasOwnProperty(topic)) {
                listeners[topic] = new Listener();
                bindMany(topic,count, listeners[topic], cb);
                return listeners[topic];
            }
            return listeners[topic];
        }

        function subscribe(topic, cb) {
            if (!listeners.hasOwnProperty(topic)) {
                listeners[topic] = new Listener();
                bind(topic, listeners[topic], cb);
                return listeners[topic];
            }
            return listeners[topic];
        }
        var connect = function () {
            var deferred = $q.defer();
            socket = new XSockets.WebSocket(self.url);
            socket.on(XSockets.Events.open, function (conn) {
                $rootScope.$apply(function () {
                    deferred.resolve(conn);

                });
            });
            return deferred.promise;
        };

        var error = function () {
            var deferred = $q.defer();
          
            socket.on(XSockets.Events.onError, function (conn) {
                $rootScope.$apply(function () {
                    deferred.resolve(conn);

                });
            });
            return deferred.promise;
        };
        var clientType = function () {
            return socket.clientType();
        };


        var connection = connect().then(function () {
           
            isConnected = true;
            queued.forEach(function (msg) {
                publish(msg.t, msg.d);
            });
            queued = [];
        });
        return {
            clientType: clientType,
            one: one,
            many:many,
            subscribe: subscribe,
            unsubscribe: unbind,
            publish: publish,
            open: connection,
            error: error()
        };
    };
    this.url = 'ws://127.0.0.1:4502/Generic';
    this.setUrl = function (url) {
        this.url = url;
    };
});