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
      'jquery'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

  function config($urlProvider, $locationProvider, $stateProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run($rootScope, $urlRouter, $window, $location) {
    FastClick.attach(document.body);
    $rootScope.$on('$locationChangeSuccess', function(evt) {
      // Halt state change from even starting
      evt.preventDefault();
      // Perform custom logic

      if (!$window.sessionStorage.token && $window.sessionStorage.loginPage) {
        $location.path('/');
      } else {
        $urlRouter.sync();
      }
    });
  }

})();
