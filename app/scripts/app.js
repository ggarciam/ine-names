'use strict';

/**
 * @ngdoc overview
 * @name ineNamesApp
 * @description
 * # ineNamesApp
 *
 * Main module of the application.
 */
angular
  .module('ineNamesApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'LocalStorageModule'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'RestCtrl',
        controllerAs: 'rc'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
