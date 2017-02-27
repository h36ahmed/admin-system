var app = angular.module('lunchSociety');

app.factory('authInterceptor', function($rootScope, $q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Auth = $window.sessionStorage.token;
      }
      var foreignUrl = config.url.indexOf('amazonaws') > -1;
      if (foreignUrl) {
        config.headers['Authorization'] = undefined;
      }
      return config;
    },
    response: function(response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

app.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
