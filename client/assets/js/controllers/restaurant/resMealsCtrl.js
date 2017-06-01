var app = angular.module('lunchSociety');

var resMealsCtrl = function ($scope,commonService, mealService, modalService) {

  var restaurant = commonService.getRestaurantID();

  $scope.meals = [];

  mealService
    .getMeals({ restaurant_id: 1 })
    .success(function(data, status, headers, config) {
      $scope.meals = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

resMealsCtrl.inject = ['$scope','commonService', 'mealService', 'modalService'];

app.controller('resMealsCtrl', resMealsCtrl);
