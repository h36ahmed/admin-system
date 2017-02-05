var app = angular.module('lunchSociety');

var homeCtrl = function($scope, $window, $location, commonService, modalService) {

  $scope.userFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
        modalService.openModal('ls-status-modal');
      commonService
        .loginUser($scope.userFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          $window.sessionStorage.token = data.token;
          $location.path('admin-dashboard');
        })
        .error(function(data, status, headers, config) {
          // Erase the token if the user fails to log in
          delete $window.sessionStorage.token;
          // Handle login errors here
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Error: Invalid user or password');
        });
    }
  };

};

homeCtrl.inject = ['$scope', '$window', '$location', 'commonService', 'modalService'];

app.controller('homeCtrl', homeCtrl);
