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
    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.bootstrap',
    'LocalStorageModule'
  ])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])
  .config(['$mdIconProvider', function ($mdIconProvider) {
    $mdIconProvider
    .iconSet('social', '../bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg', 24)
    .iconSet('action', '../bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', 24)
    .iconSet('alert', '../bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-alert.svg', 24)
    .iconSet('communication', '../bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg', 24)
    .iconSet('navigation', '../bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg', 24);
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
