var app = angular.module('lunchSociety');

var manageOwnerCtrl = function($scope, userService ) {

  $scope.owners = [];

   userService
    .getUsers({
      type: "owner"
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageOwnerCtrl.inject = ['$scope', 'userService'];

app.controller('manageOwnerCtrl', manageOwnerCtrl);
