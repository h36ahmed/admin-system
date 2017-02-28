var app = angular.module('lunchSociety');

var createAccountCtrl = function($scope, $window, $location, userService, modalService, passwordService) {

  $scope.registerForm = {};

  $scope.generatePassword = function() {
    $scope.registerForm.password = passwordService.generatePassword();
  };

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var promise = modalService.open(
        "status", {}
      );
      userService
        .createUser($scope.registerForm)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
                $scope.registerForm = {};
                promise = modalService.open(
                  "alert", {
                    message: 'User Added & Email Sent!'
                  }
                );
                promise.then(function handleResolve(response) {
                  if (data.type == 'owner') {
                    $location.path('create-owner').search({
                      user_id: data.id
                    });
                  }
                },
                  function handleReject(error) {});

            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );

        })
        .error(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Error: Something Went Wrong'
                }
              );
              promise.then(function handleResolve(response) {},
                function handleReject(error) {});
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        });
    }
  };

};

createAccountCtrl.inject = ['$scope', '$window', '$location', 'userService', 'modalService', 'passwordService'];

app.controller('createAccountCtrl', createAccountCtrl);
