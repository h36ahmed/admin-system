var app = angular.module('lunchSociety');

var createAccountCtrl = function($scope, $window, $location, userService, modalService) {

  $scope.registerFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var promise = modalService.open(
        "status", {}
      );
      userService
        .createUser($scope.registerFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              if (data.type == 'owner') {
                $location.path('create-owner').search({
                  id: data.id
                });
              } else {
                promise = modalService.open(
                  "alert", {
                    message: 'Customer Added & Email Sent!'
                  }
                );
                promise.then(function handleResolve(response) {},
                  function handleReject(error) {});
              }
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

createAccountCtrl.inject = ['$scope', '$window', '$location', 'userService', 'modalService'];

app.controller('createAccountCtrl', createAccountCtrl);
