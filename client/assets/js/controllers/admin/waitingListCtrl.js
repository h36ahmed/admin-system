var app = angular.module('lunchSociety');

var waitingListCtrl = function($scope, userService) {

  $scope.users = [];

  userService
    .getUsers({
      waiting_list:true
    })
    .success(function(data, status, headers, config) {
      $scope.users = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

waitingListCtrl.inject = ['$scope', 'userService'];

app.controller('waitingListCtrl', waitingListCtrl);
