var app = angular.module('lunchSociety');

var createOwnerCtrl = function($scope, $location, userService, ownerService, modalService) {

  $scope.createOwnerFormData = {};

  $scope.owners = [];
  userService
    .getUsers({
      type: "owner"
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      $scope.createOwnerFormData.user = $scope.owners[0];
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      modalService.openModal('ls-status-modal');
      $scope.createOwnerFormData.user_id = $scope.createOwnerFormData.user.id;

      ownerService
        .createOwner($scope.createOwnerFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          $location.path('create-restaurant').search({
            id: data.id
          });
        })
        .error(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Error: Something Went Wrong');
        });
    }
  };

};

createOwnerCtrl.inject = ['$scope', '$location', 'userService', 'ownerService', 'modalService'];

app.controller('createOwnerCtrl', createOwnerCtrl);