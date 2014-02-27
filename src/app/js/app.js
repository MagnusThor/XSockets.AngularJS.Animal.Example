var animalApp = angular.module('animalApp', ['XSockets']).
  config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
      $routeProvider.
          when('/animals/', { templateUrl: 'app/partials/animals.html', controller: AnimalsController }).
          otherwise({ redirectTo: '/animals' });
  }]);
