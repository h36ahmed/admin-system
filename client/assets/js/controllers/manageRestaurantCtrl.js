var app = angular.module('lunchSociety');

var manageRestaurantCtrl = function($scope, $state, restaurantService ) {

  $scope.restaurants = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageRestaurantCtrl.inject = ['$scope','$state', 'restaurantService'];

app.controller('manageRestaurantCtrl', manageRestaurantCtrl);
