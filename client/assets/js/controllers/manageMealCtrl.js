var app = angular.module('lunchSociety');

var manageMealCtrl = function($scope, mealService ) {

  $scope.meals = [];

  mealService
    .getMeals()
    .success(function(data, status, headers, config) {
      $scope.meals = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageMealCtrl.inject = ['$scope', 'mealService'];

app.controller('manageMealCtrl', manageMealCtrl);
