var app = angular.module('lunchSociety');

var customerInfoCtrl = function($scope, $state, $location, $stateParams, customerService) {

  $scope.customer = {};
  $scope.customer_id = $stateParams.id;
  if ($stateParams.id) {
    customerService
      .getCustomer({
        id: $scope.customer_id
      })
      .success(function(data, status, headers, config) {
        $scope.customer = data;
      })
      .error(function(data, status, headers, config) {
        // Handle login errors here
        $scope.message = 'Error: Something Went Wrong';
      });
  } else {
    $location.path('customers');
  }

};

customerInfoCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'customerService'];

app.controller('customerInfoCtrl', customerInfoCtrl);
