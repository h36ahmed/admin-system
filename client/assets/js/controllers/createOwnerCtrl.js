var app = angular.module('lunchSociety');

var createOwnerCtrl = function($scope, $location, userService, ownerService) {

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
      $scope.createOwnerFormData.user_id = $scope.createOwnerFormData.user.id;
       console.log($scope.createOwnerFormData);
      ownerService
        .createOwner($scope.createOwnerFormData)
        .success(function(data, status, headers, config) {
          $location.path('create-restaurant').search({
            id: data.id
          });
        })
        .error(function(data, status, headers, config) {
          // Handle login errors here
          $scope.message = 'Error: Something Went Wrong';
        });
    }
  };

};

createOwnerCtrl.inject = ['$scope', '$location', 'userService', 'ownerService'];

app.controller('createOwnerCtrl', createOwnerCtrl);
