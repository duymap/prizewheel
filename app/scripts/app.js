'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('prizewheel', ['ionic', 'ngCookies', 'prizewheel.controllers', 'prizewheel.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  
  .state('main', {
    cache: false,
    url: '/',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })
  
  .state('input', {
    url: '/input',
    templateUrl: 'templates/input.html',
    controller: 'InputCtrl'
  })

  .state('offer', {
    url: '/offer',
    templateUrl: 'templates/offer.html',
    controller: 'OfferCtrl'
  });

  $urlRouterProvider.otherwise('/');

});
