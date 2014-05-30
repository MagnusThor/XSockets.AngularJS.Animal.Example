# XSockets.angularJS Provider

This repo gives you quick introduction how to use the XSockets.NET angularJS (beta) provider.  `['xsockets']`

The team is currently working on the next major release of XSockets.NET where we will include more streamlined,powerfull and streamlined API's.  Join our developer forum for the latest informaation at http://xsockets.net/developer-forum 

###Example usage

You will find the code in the src folder and try the very simple example at here http://magnusthor.github.io/XSockets.AngularJS.Animal.Example/src

### Reference the provider

Include the two following JavaScript files

      <script src="/yourscriptfolder/XSockets.latest.js"></script>
      <script src="/yourscriptfolder/xsockets/XSockets.angularJS.min.js"></script>


###Inject the provider 

    var myApp = angular.module('animalApp', ['xsockets.angular']);

####Configure the provider

By invoking the `.setUrl(ws)` method on the $xsocketsProvider for angular you define the endpoint (XSockets.Controller) to be used.

        // Configure the XSockets angularJS provider
        ..
        $xsocketsProvider.setUrl("ws://joinaspot.com:4509/Generic");
        ..

#####Example (Complete example using the `animalApp` as describe above)

    animalApp.config(['$locationProvider', '$routeProvider', 'xsocketsProvider',
    function ($locationProvider, $routeProvider, $xsocketsProvider) {
        // Configure the XSockets angularJS provider
        $xsocketsProvider.setUrl("ws://joinaspot.com:4509/Generic");

        $routeProvider.
        when('/animals/', {
            templateUrl: 'app/partials/animals.html',
            controller: 'AnimalsController'
        }).
        when('/dummy/', {
            templateUrl: 'app/partials/dummy.html',
            controller: 'DummyController'
        }).
        otherwise({
            redirectTo: '/animals'
        });
    }]);


####Using the provider in a angularController

When the provider is injected and constructed within a controller the provider established a connection to the provided url (.setUrl(ws) .  

Example controller

    animalApp.controller('DummyController', ['$scope', 'xsockets', function ($scope, xsockets) {

    $scope.say = "Connecting...";

    // i will only fire once
    xsockets.onopen.then(function () {
        $scope.say = "Connected";
    });
    }]);

###Publish & Subscribe

####.subscribe(topic,fn) : delegate(fn)
Establish a subscription to a topic by invoking `.subscribe(topic,fn).delegate(fn)`

      ...
       xsockets.subscribe("myToic", function () {
            console.log("Server confirms subscription!");
        }).delegate(function (data) {
            // attach the data to the $scope 
            $scope.myData = data;
        });
        ...
**fn* is an optional argument, if passed the fn will be invoked when the XSockets.Controller confirms that the subscription is established.

Publish data by invoking `.publish(topic,obj,fn)` fn is an optional argument. *fn* will be invoked after the data is sent to the XSockets.Controller

####.publish(topic,data,fn)

    xsockets.publish("myTopic",{say:'Ivory belongs to elephants...'}, function () {
        console.log("You just send some data to the contoller..");
    });
####.one(topic,fn): delegate(fn)

*When using one the API automatically unsubscribes to the topic after a messages arrives.*

    ...
    xsockets.one("myTopic").delegate(function(data) {
        // do op's with data
    });
    ...

####.many(topic,count,fn): delegate(fn)

*When using many the API automatically unsubscribes to the topic after a specific (count) number of messages arrives)*

    ..
    xsockets.many("myTopic",5).delegate(function(function(data) {
        // do op's with data
    });

####.unsubscribe(topic,fn)

To remove a subscription, invoke the .unsubscribe method.

    ..
    xsockets.unsubscribe("myTopic", function(){
        console.log("We are now not subscribing to myTopic");
    });

####Events (promises)

The open, close and error "events"  raised by the underlaying XSockets.JavaScript API (WebSocket) are wrapped in a promise/deferred.  Use the .then(success) method to catch the asynchronous callback. 

    // Open & Ready
    
    xsockets.onopen.then(function(){
        // We are now connected and/or ready
    });
    
      // Catch any errors/ exceptions thown
    
    xsockets.onerror.then(function(err){
        // An error occured
    });
    
    xsockets.onclose.then(function(reason){
        // The connection is closed....
    });
    
    
    
