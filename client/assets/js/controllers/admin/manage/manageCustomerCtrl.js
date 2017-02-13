var app = angular.module('lunchSociety');

var manageCustomerCtrl = function($scope, customerService ) {

  $scope.customers = [];

  customerService
    .getCustomers()
    .success(function(data, status, headers, config) {
      $scope.customers = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageCustomerCtrl.inject = ['$scope', 'customerService'];

app.controller('manageCustomerCtrl', manageCustomerCtrl);
