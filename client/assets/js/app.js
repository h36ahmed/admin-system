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
      'uiGmapgoogle-maps'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider', 'uiGmapGoogleMapApiProvider'];

  function config($urlProvider, $locationProvider, $stateProvider, uiGmapGoogleMapApiProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });

    $locationProvider.hashPrefix('!');
  }

  function run($rootScope, $urlRouter, $window, $location) {
    FastClick.attach(document.body);
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
