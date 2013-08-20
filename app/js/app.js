'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/course', {templateUrl: 'partials/course.html', controller: 'CourseContentCtrl'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/course'});
  }]);