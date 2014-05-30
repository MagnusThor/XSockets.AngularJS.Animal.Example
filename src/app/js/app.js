var animalApp = angular.module('animalApp', ['xsockets.angular']);

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

    }
]);

//hey, we can configure the  provider this way also..  

//animalApp.config(function (xsocketsProvider) {
//    xsocketsProvider.setUrl("ws://joinaspot.com:4509/Generic");
//});