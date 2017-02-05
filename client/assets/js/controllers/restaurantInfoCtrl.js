var app = angular.module('lunchSociety');

var restaurantInfoCtrl = function($scope, $state, $location, $stateParams, restaurantService) {

  $scope.restaurant = {};
  if ($stateParams.id) {
    restaurantService
      .getRestaurant({
        id: $stateParams.id
      })
      .success(function(data, status, headers, config) {
        $scope.restaurant = data;
      })
      .error(function(data, status, headers, config) {
        // Handle login errors here
        $scope.message = 'Error: Something Went Wrong';
      });
  } else {
    $location.path('manage-restaurants');
  }

};

restaurantInfoCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'restaurantService'];

app.controller('restaurantInfoCtrl', restaurantInfoCtrl);
