var app = angular.module('lunchSociety');

var createAccountCtrl = function($scope, $window, $location, userService, modalService) {

  $scope.registerFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      modalService.openModal('ls-status-modal');
      userService
        .createUser($scope.registerFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          if (data.type == 'owner') {
            $location.path('create-owner').search({
              id: data.id
            });
          } else {
            modalService.openModal('ls-feedback-modal');
            $("#ls-feedback-message").html('Customer Added & Email Sent!');
          }
        })
        .error(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Error: Something Went Wrong');
        });
    }
  };

};

createAccountCtrl.inject = ['$scope', '$window', '$location', 'userService', 'modalService'];

app.controller('createAccountCtrl', createAccountCtrl);
