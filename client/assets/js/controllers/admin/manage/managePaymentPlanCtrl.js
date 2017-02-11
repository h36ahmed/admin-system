var app = angular.module('lunchSociety');

var managePaymentPlanCtrl = function($scope, paymentPlanService) {

  $scope.paymentPlans = [];

  paymentPlanService
    .getPaymentPlans()
    .success(function(data, status, headers, config) {
      $scope.paymentPlans = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

managePaymentPlanCtrl.inject = ['$scope', 'paymentPlanService'];

app.controller('managePaymentPlanCtrl', managePaymentPlanCtrl);
