angular.module('XSockets', []).factory("xsocket", function($q, $rootScope) {

    var isConnected, listeners = {}, socket, queued = [];
    
    var Listener = (function () {
        function Listener(fn) {
            this._a = fn;
        }
        Listener.prototype.process = function (fn) {
            this._a = fn;
            return this;
        };

        Listener.prototype.invoke = function (a) {
            this._a(a);
            return this;
        };
        return Listener;
    })();

    function bind(eventName) {
        socket.on(eventName, function (a) {
            $rootScope.$apply(function () {
                listeners[eventName].invoke(a);
            });
        });
    }
    function publish(topic, data) {
        if (isConnected || typeof (socket) === "undefined") {
            socket.trigger(topic, data);
        } else {
            queued.push({ t: topic, d: data || {} });
        }
    }
    function subscribe(topic) {
        if (!listeners.hasOwnProperty(topic)) {
            listeners[topic] = new Listener();
            bind(topic, listeners[topic]);
            return listeners[topic];
        }
        return listeners[topic];
    };
    
    var connect = function (url) {
        var deferred = $q.defer();
        socket =  new XSockets.WebSocket(url);
        socket.on(XSockets.Events.open, function(conn) {
            $rootScope.$apply(function () {
                deferred.resolve(conn);
            });
        });
        return deferred.promise;
    };
    
  
    connect("ws://joinaspot.com:4509/Generic").then(function (connection) {
        isConnected = true;
        queued.forEach(function (msg, i) {
            publish(msg.t, msg.d);
        });
        queued = [];
    });
    
    return {

        isConnected: isConnected,
        subscribe: subscribe,
        publish: publish
    };
});


