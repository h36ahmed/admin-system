var app = angular.module('lunchSociety');

var homeCtrl = function($scope, $location, commonService, modalService, utilService, $window) {

  $window.sessionStorage.loginPage = true;
  $scope.userFormData = {};

  $scope.submitForm = function(isValid) {
    delete  $window.sessionStorage.loginPage;
    // check to make sure the form is completely valid
    if (isValid) {
      var promise = modalService.open(
        "status", {}
      );
      commonService
        .loginUser($scope.userFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              commonService.setAuthToken(data.token);
              commonService.setUserID(data.id);
              utilService.isKitchenOpen() ?
                $location.path('restaurant/meal-offers') :
                $location.path('kitchen-closed')
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
              commonService.deleteAuthToken();
              promise = modalService.open(
                "alert", {
                  message: 'Error: Invalid user or password'
                }
              );
              promise.then(function handleResolve(response) {
                console.log("Alert resolved.");
                $window.sessionStorage.loginPage = true;
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

homeCtrl.inject = ['$scope', '$location', 'commonService', 'modalService', 'utilService', '$window'];

app.controller('homeCtrl', homeCtrl);
