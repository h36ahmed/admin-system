var app = angular.module('lunchSociety');

var sideBarCtrl = function($scope, $location, commonService, modalService) {

  $scope.logout = function() {
    var promise = modalService.open(
      "status", {}
    );
    commonService
      .logoutUser()
      .success(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            commonService.deleteAuthToken();
            $location.path('/');
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
                message: 'Error: Something Wrong!'
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
  };
};

sideBarCtrl.inject = ['$scope', '$location', 'commonService', 'modalService'];

app.controller('sideBarCtrl', sideBarCtrl);
