var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/scripts/app/templates/organiser.html'
        });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
          });
});