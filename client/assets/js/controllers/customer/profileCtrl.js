var app = angular.module('lunchSociety');

var profileCtrl = function ($scope,commonService, customerService) {

    $scope.customer = {};

    customerService
        .getCustomer({
            id: commonService.getCustomerID()
        })
        .success(function (data, status, headers, config) {
            $scope.customer = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });

    $scope.submitEditForm = function (change) {
      customerService
        .editCustomer({
          id: commonService.getCustomerID(),
          reminder_emails: change,
        })
        .then(customer => {
          $scope.customer = customer.data
        })
        .error(e => {
          $scope.message = 'Error: Something Went Wrong'
        })
    }
};

profileCtrl.inject = ['$scope','commonService', 'customerService'];

app.controller('profileCtrl', profileCtrl);
