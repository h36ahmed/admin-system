var app = angular.module('lunchSociety');

var createMealCtrl = function($scope, $location, restaurantService, mealService, modalService, _) {

  $scope.createMealFormData = {};

  $scope.restaurants = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
      if ($location.search().id) {
        // Have option been selected to the restaurant who just got added
        $scope.createMealFormData.restaurant = $scope.restaurants[0];
      } else {
        $scope.createMealFormData.restaurant = $scope.restaurants[0];
      }

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {

      $scope.createMealFormData.restaurant_id = $scope.createMealFormData.restaurant.id;

      var promise = modalService.open(
        "status", {}
      );

      mealService
        .createMeal($scope.createMealFormData)
        .success(function(data, status, headers, config) {
           modalService.resolve();
           promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Meal Created'
                }
              );
              promise.then(function handleResolve(response) {},
                function handleReject(error) {});
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

createMealCtrl.inject = ['$scope', '$location', 'restaurantService', 'mealService', 'modalService'];

app.controller('createMealCtrl', createMealCtrl);
