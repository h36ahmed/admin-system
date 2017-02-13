var app = angular.module('lunchSociety');

var manageOwnerCtrl = function($scope, ownerService) {

  $scope.owners = [];

  ownerService
    .getOwners()
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      console.log($scope.owners);
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageOwnerCtrl.inject = ['$scope', 'ownerService'];

app.controller('manageOwnerCtrl', manageOwnerCtrl);
