var app = angular.module('lunchSociety');

var createOwnerCtrl = function($scope, $location, userService, ownerService, modalService, _) {

  $scope.createOwnerFormData = {};

  $scope.owners = [];
  userService
    .getUsers({
      type: "owner",
      owner_list: true
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      $scope.createOwnerFormData.user = $scope.owners[0];
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var promise = modalService.open(
        "status", {}
      );
      $scope.createOwnerFormData.user_id = $scope.createOwnerFormData.user.id;

      ownerService
        .createOwner($scope.createOwnerFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              $location.path('create-restaurant').search({
                id: data.id
              });
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

createOwnerCtrl.inject = ['$scope', '$location', 'userService', 'ownerService', 'modalService'];

app.controller('createOwnerCtrl', createOwnerCtrl);
