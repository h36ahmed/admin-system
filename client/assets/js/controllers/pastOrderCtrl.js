var app = angular.module('lunchSociety');

var pastOrderCtrl = function($scope, orderService ) {

  $scope.orders = [];

  orderService
    .getOrders()
    .success(function(data, status, headers, config) {
      $scope.orders = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

pastOrderCtrl.inject = ['$scope', 'orderService'];

app.controller('pastOrderCtrl', pastOrderCtrl);
