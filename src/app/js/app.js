var animalApp = angular.module('animalApp', ['XSockets.angularJS']);

animalApp.config(['$locationProvider', '$routeProvider', '$xsCommunicationProvider',
    function ($locationProvider, $routeProvider, $xsCommunicationProvider) {

        // Configure the XSockets angularJS provider
        $xsCommunicationProvider.setUrl("ws://joinaspot.com:4509/Generic");
        

        $routeProvider.
            when('/animals/', { templateUrl: 'app/partials/animals.html', controller: 'AnimalsController' }).
            when('/dummy/',
                {
                    templateUrl: 'app/partials/dummy.html', controller: 'DummyController'
                }).
            otherwise({ redirectTo: '/animals' });

}]);

//hey, we can configure a provider this way!            
animalApp.config(function ($xsCommunicationProvider) {
    $xsCommunicationProvider.setUrl("ws://joinaspot.com:4509/Generic");
 
});















