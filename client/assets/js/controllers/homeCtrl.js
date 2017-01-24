var app = angular.module('lunchSociety');

var homeCtrl = function($scope, $window, $location, commonService) {

  $scope.userFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      commonService
        .loginUser($scope.userFormData)
        .success(function(data, status, headers, config) {
          $window.sessionStorage.token = data.token;
          $location.path('admin-dashboard');
          $scope.message = 'Welcome';
        })
        .error(function(data, status, headers, config) {
          // Erase the token if the user fails to log in
          delete $window.sessionStorage.token;
          // Handle login errors here
          $scope.message = 'Error: Invalid user or password';
        });
    }
  };

};

homeCtrl.inject = ['$scope', '$window', '$location', 'commonService'];

app.controller('homeCtrl', homeCtrl);
