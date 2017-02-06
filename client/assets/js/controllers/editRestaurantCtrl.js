var app = angular.module('lunchSociety');

var editRestaurantCtrl = function($scope, $state, $location,
  $stateParams, restaurantService,
  ownerService, modalService) {

  $scope.restaurant = {};
  $scope.editResFormData = {};

  $scope.owners = [];

  ownerService
    .getOwners()
    .success(function(data, status, headers, config) {
      $scope.owners = data;

      if ($stateParams.id) {
        restaurantService
          .getRestaurant({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            $scope.restaurant = data;
            fillFormData();
          })
          .error(function(data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
          });
      } else {
        $location.path('manage-restaurants');
      }

    })
    .error(function(data, status, headers, config) {
      modalService.closeModal('status-modal');
      modalService.openModal('feedback-modal');
      $("#feedback-message").html('Error: Something Went Wrong');
    });



  function fillFormData() {
    $scope.editResFormData.name = $scope.restaurant.name;
    $scope.editResFormData.phone_number = $scope.restaurant.phone_number;
    $scope.editResFormData.postal_code = $scope.restaurant.postal_code;
    $scope.editResFormData.owner = $scope.owners[$scope.restaurant.owner_id - 1];
    $scope.editResFormData.street_address = $scope.restaurant.street_address;
    $scope.editResFormData.city = $scope.restaurant.city;
    $scope.editResFormData.country = $scope.restaurant.country;
    $scope.editResFormData.state = $scope.restaurant.state;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $scope.editResFormData.owner_id = $scope.editResFormData.owner.id;
      $scope.editResFormData.phone_number = parseInt($scope.editResFormData.phone_number);
      $scope.editResFormData.id = $stateParams.id;
      restaurantService
        .editRestaurant($scope.editResFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Restaurant Updated!');
        })
        .error(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Error: Something Went Wrong');
        });
    }
  };
  $scope.submitDeleteForm = function() {
    restaurantService
      .deleteRestaurant({
        id: $stateParams.id
      })
      .success(function(data, status, headers, config) {
        modalService.closeModal('ls-status-modal');
        modalService.openModal('ls-feedback-modal');
        $("#ls-feedback-message").html('Restaurant Deleted!');
        $location.path('manage-restaurants');
      })
      .error(function(data, status, headers, config) {
        modalService.closeModal('ls-status-modal');
        modalService.openModal('ls-feedback-modal');
        $("#ls-feedback-message").html('Error: Something Went Wrong');
      });
  }
};

editRestaurantCtrl.inject = ['$scope', '$state', ' $location', '$stateParams', 'restaurantService', 'ownerService', 'modalService'];

app.controller('editRestaurantCtrl', editRestaurantCtrl);
