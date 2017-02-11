var app = angular.module('lunchSociety');

var editUserCtrl = function($scope, $state, $location,
  $stateParams, userService, modalService, _) {

  $scope.user = {};
  $scope.editUserFormData = {};

  userService
    .getUser({
      id: 1
    })
    .success(function(data, status, headers, config) {
      modalService.resolve();

      promise.then(
        function handleResolve(response) {
          $scope.user = data;
          $scope.editUserFormData.email = $scope.user.email;
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

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editUserFormData.id = 1;
      userService
        .editUser($scope.editUserFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'User Updated!'
                }
              );
              promise.then(function handleResolve(response) {},
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

editUserCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'userService', 'modalService'];

app.controller('editUserCtrl', editUserCtrl);
