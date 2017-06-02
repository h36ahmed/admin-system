(function() {
  'use strict';

  angular
    .module('lunchSociety', [
      'ui.router',
      'ngAnimate',

      //foundation
      'foundation',
      'foundation.dynamicRouting',
      'foundation.dynamicRouting.animations',

      'underscore',
      'jquery',
      'ngFileUpload',
      'uiGmapgoogle-maps',
      '720kb.datepicker',
      'angular-svg-round-progressbar',
      'angularPayments',
      'angularLoad',
      'angularMoment'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider', 'uiGmapGoogleMapApiProvider'];

  function config($urlProvider, $locationProvider, $stateProvider, uiGmapGoogleMapApiProvider, $window) {
    $urlProvider.otherwise('/');


    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAcAZcWH9AoU5nsCHnHwFQPK4aBAoNHBSg',
        v: '3.20',
        libraries: 'weather,geometry,visualization'
    });

    $locationProvider.hashPrefix('!');
  }

  function run($rootScope, $urlRouter, $window, $location, angularLoad) {
    FastClick.attach(document.body);

    angularLoad.loadScript('https://js.stripe.com/v2/').then(function() {
         $window.Stripe.setPublishableKey('pk_test_UnmAg8y934vAlD1EXAMsYC3V');
    }).catch(function() {
        console.log("can't load");
    });

    $rootScope.$on('$stateChangeSuccess', function(evt) {
      // Halt state change from even starting
      evt.preventDefault();
      // Perform custom logic
      var restrictedPage = $.inArray($location.path(), ['/', '/register', '/kitchen-open']) === -1;
      if (!$window.sessionStorage.token && restrictedPage) {
        $location.path('/');
      } else {
        $urlRouter.sync();
      }
    });
  }

})();
