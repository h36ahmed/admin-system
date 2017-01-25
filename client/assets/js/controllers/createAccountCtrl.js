var app = angular.module('lunchSociety');

var createAccountCtrl = function($scope, $window, $location, userService) {

  $scope.registerFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      userService
        .createUser($scope.registerFormData)
        .success(function(data, status, headers, config) {
          if( data.type == 'owner') {
              $location.path('create-owner').search({id: data.id});
          } else {
              // Show Modal saying customer Added
          }
        })
        .error(function(data, status, headers, config) {
          // Handle errors here
          console.log(data);
        });
    }
  };

};

createAccountCtrl.inject = ['$scope', '$window', '$location', 'userService'];

app.controller('createAccountCtrl', createAccountCtrl);
