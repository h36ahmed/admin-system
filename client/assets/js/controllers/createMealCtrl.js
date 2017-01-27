var app = angular.module('lunchSociety');

var createMealCtrl = function($scope, $location, restaurantService, mealService ) {

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
      mealService
        .createMeal($scope.createMealFormData)
        .success(function(data, status, headers, config) {
          alert('yes');
        })
        .error(function(data, status, headers, config) {
          // Handle login errors here
          $scope.message = 'Error: Something Went Wrong';
        });
    }
  };

};

createMealCtrl.inject = ['$scope', '$location', 'restaurantService', 'mealService'];

app.controller('createMealCtrl', createMealCtrl);
