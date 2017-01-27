var app = angular.module('lunchSociety');

var manageOrderCtrl = function($scope, orderService ) {

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

manageOrderCtrl.inject = ['$scope', 'orderService'];

app.controller('manageOrderCtrl', manageOrderCtrl);
