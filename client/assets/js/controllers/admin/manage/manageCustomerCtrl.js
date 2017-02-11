var app = angular.module('lunchSociety');

var manageCustomerCtrl = function($scope, userService ) {

  $scope.customers = [];

  userService
    .getUsers({
      type: "customer"
    })
    .success(function(data, status, headers, config) {
      $scope.customers = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageCustomerCtrl.inject = ['$scope', 'userService'];

app.controller('manageCustomerCtrl', manageCustomerCtrl);
