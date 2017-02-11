var app = angular.module('lunchSociety');

var homeCtrl = function($scope, $window, $location, commonService, modalService) {

  $scope.userFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var promise = modalService.open(
        "status", {}
      );
      console.log(promise);
      commonService
        .loginUser($scope.userFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              $window.sessionStorage.token = data.token;
              $location.path('admin-dashboard');
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
              delete $window.sessionStorage.token;
              promise = modalService.open(
                "alert", {
                  message: 'Error: Invalid user or password'
                }
              );
              promise.then(function handleResolve(response) {
                console.log("Alert resolved.");
              }, function handleReject(error) {
                console.warn("Alert rejected!");
              });
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        });
    }
  };

};

homeCtrl.inject = ['$scope', '$window', '$location', 'commonService', 'modalService'];

app.controller('homeCtrl', homeCtrl);
