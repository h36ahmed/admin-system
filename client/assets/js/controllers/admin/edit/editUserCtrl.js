var app = angular.module('lunchSociety');

var editUserCtrl = function($scope, $state, $location,
  $stateParams, userService, modalService, commonService, _) {

  $scope.user = {};
  $scope.editUserFormData = {};
  var userID = commonService.getUserID();
  var promise = modalService.open(
    "status", {}
  );
  userService
    .getUser({
      id: userID
    })
    .success(function(data, status, headers, config) {
      modalService.resolve();
      promise.then(
        function handleResolve(response) {
          $scope.user = data;
          console.log($scope.user);
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
      $scope.editUserFormData.id = userID;
      var finalFormData = {};
      if ($scope.editUserFormData.password.length < 6 || $scope.editUserFormData.password == null) {
        finalFormData = _.omit($scope.editUserFormData, ['password']);
      } else {
        finalFormData = $scope.editUserFormData;
      }
      userService
        .editUser(finalFormData)
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

editUserCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'userService', 'modalService', 'commonService'];

app.controller('editUserCtrl', editUserCtrl);
