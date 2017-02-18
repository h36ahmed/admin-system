var app = angular.module('lunchSociety');

var createRestaurantCtrl = function($scope, $location, ownerService, restaurantService, modalService, _) {

  $scope.createRestaurantFormData = {};

  $scope.owners = [];

  ownerService
    .getOwners({
     no_restaurant_list: true
    })
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
      var promise = modalService.open(
        "status", {}
      );
      $scope.createRestaurantFormData.owner_id = $scope.createRestaurantFormData.owner.id;
      $scope.createRestaurantFormData.phone_number = parseInt($scope.createRestaurantFormData.phone_number);
      restaurantService
        .createRestaurant($scope.createRestaurantFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              $location.path('create-meal').search({
                id: data.id
              });
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        })
        .error(function(data, status, headers, config) {
         modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Error: Something Went Wrong'
                }
              );
              promise.then(function handleResolve(response) {},
                           function handleReject(error) {});
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        });
    }
  };

};

createRestaurantCtrl.inject = ['$scope', '$location', 'ownerService', 'restaurantService', 'modalService'];

app.controller('createRestaurantCtrl', createRestaurantCtrl);
