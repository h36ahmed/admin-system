var app = angular.module('lunchSociety');

var manageInvoiceCtrl = function($scope, invoiceService ) {

  $scope.invoices = [];

  invoiceService
    .getInvoices()
    .success(function(data, status, headers, config) {
      $scope.orders = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageInvoiceCtrl.inject = ['$scope', 'invoiceService'];

app.controller('manageInvoiceCtrl', manageInvoiceCtrl);
