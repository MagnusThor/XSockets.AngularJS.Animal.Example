angular.module('XSockets.angularJS', []).provider('$xsCommunication', function () {
    var self = this;
    this.$get =
        ['$q','$rootScope',
        function ($q, $rootScope) {
            var isConnected, subscriptions = {}, socket, queued = [];
                var subscription = (function () {
                    function _subscription(fn) {
                        this._a = fn;
                    }
                    _subscription.prototype.delagate = function (fn) {
                        this._a = fn;
                        return this;
                    };
                    _subscription.prototype.invoke = function (a) {
                        this._a(a);
                        return this;
                    };
                    return _subscription;
                })();

                function bind(topic, fn, cb) {
                    socket.subscribe(topic, function (a) {
                        $rootScope.$apply(function () {
                            subscriptions[topic].invoke(a);
                        }, cb);
                    }, cb);
                }
                function bindOne(topic, fn, cb) {
                    socket.one(topic, function (a) {
                        $rootScope.$apply(function () {
                            subscriptions[topic].invoke(a);
                        }, cb);
                    }, cb);
                }
                function bindMany(topic, count, fn, cb) {
                    socket.many(topic,count, function (a) {
                        $rootScope.$apply(function () {
                            subscriptions[topic].invoke(a);
                        }, cb);
                    }, cb);
                }
                function unbind(topic, fn) {
                    if (subscriptions.hasOwnProperty(topic)) {
                        socket.unsubscribe(topic);
                        delete subscriptions[topic];
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
                    if (!subscriptions.hasOwnProperty(topic)) {
                        subscriptions[topic] = new subscription();
                        bindOne(topic, subscriptions[topic], cb);
                        return subscriptions[topic];
                    }
                    return subscriptions[topic];
                }
                function many(topic,count, cb) {
                    if (!subscriptions.hasOwnProperty(topic)) {
                        subscriptions[topic] = new subscription();
                        bindMany(topic,count, subscriptions[topic], cb);
                        return subscriptions[topic];
                    }
                    return subscriptions[topic];
                }
                function subscribe(topic, cb) {
                    if (!subscriptions.hasOwnProperty(topic)) {
                        subscriptions[topic] = new subscription();
                        bind(topic, subscriptions[topic], cb);
                        return subscriptions[topic];
                    }  
                    return subscriptions[topic];
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

                var close = function() {
                    var deferred = $q.defer();
                    socket.on(XSockets.Events.close, function(reason) {
                        $rootScope.$apply(function() {
                            deferred.resolve(reason);
                        });
                    });
                    return deferred.promise;
                };

                var error = function () {
                    var deferred = $q.defer();
                    socket.on(XSockets.Events.onError, function (err) {
                        $rootScope.$apply(function () {
                            deferred.resolve(err);
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
            error: error(),
            close: close()
        };
        }];
    this.url = 'ws://127.0.0.1:4502/Generic';
    this.setUrl = function (url) {
        this.url = url;
    };
});