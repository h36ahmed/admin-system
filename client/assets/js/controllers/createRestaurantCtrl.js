var app = angular.module('lunchSociety');

var createRestaurantCtrl = function($scope, $location, ownerService, restaurantService, modalService) {

  $scope.createRestaurantFormData = {};

  $scope.owners = [];

  ownerService
    .getOwners()
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      if ($location.search().id) {
        // Have option been selected to the owner who just got added
        // Have the option display as $scope.owners[i].last_name + ' - ' + $scope.owners[i].email
        $scope.createRestaurantFormData.owner = $scope.owners[0];
      } else {
        $scope.createRestaurantFormData.owner = $scope.owners[0];
      }

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      modalService.openModal('ls-status-modal');
      $scope.createRestaurantFormData.owner_id = $scope.createRestaurantFormData.owner.id;
      $scope.createRestaurantFormData.phone_number = parseInt($scope.createRestaurantFormData.phone_number);
      restaurantService
        .createRestaurant($scope.createRestaurantFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          $location.path('create-meal').search({
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

createRestaurantCtrl.inject = ['$scope', '$location', 'ownerService', 'restaurantService', 'modalService'];

app.controller('createRestaurantCtrl', createRestaurantCtrl);
