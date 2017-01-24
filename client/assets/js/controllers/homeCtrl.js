var app = angular.module('lunchSociety');

var homeCtrl = function($scope, commonService) {

  $scope.userFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      console.log(commonService.loginUser($scope.userFormData));
    }
  };

};

homeCtrl.inject = ['$scope', 'commonService'];

app.controller('homeCtrl', homeCtrl);
