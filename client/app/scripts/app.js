'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'appServices'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninCtrl'
      })
      .when('/profile/:userID', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/artist/:artistID', {
        templateUrl: 'views/artistprofile.html',
        controller: 'ArtistprofileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
