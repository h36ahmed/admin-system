var app = angular.module('lunchSociety');

var editOwnerCtrl = function($scope, $state, $location,
  $stateParams, ownerService,
  userService, modalService,_) {

  $scope.owner = {};
  $scope.editOwnerFormData = {};
  $scope.users = [];

  var promise = modalService.open(
    "status", {}
  );
  userService
    .getUsers({
      type: "owners"
  })
    .success(function(data, status, headers, config) {
      $scope.users = data;
      if ($stateParams.id) {
        ownerService
          .getOwner({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            modalService.resolve();

            promise.then(
              function handleResolve(response) {
                $scope.owner = data;
                fillFormData();
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
      } else {
        $location.path('owners');
      }

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
          promise.then(function handleResolve(response) {
            $location.path('owners');
          }, function handleReject(error) {});
        },
        function handleReject(error) {
          console.log('Why is it rejected?');
        }
      );
    });

  function fillFormData() {
    $scope.editOwnerFormData.first_name = $scope.owner.first_name;
    $scope.editOwnerFormData.last_name = $scope.owner.last_name;
    $scope.editOwnerFormData.phone_number = $scope.owner.phone_number;
    $scope.editOwnerFormData.user = _.findWhere($scope.users, {id: $scope.owner.user_id});
    $scope.editOwnerFormData.confirmed_email = $scope.owner.user.confirmed_email;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editOwnerFormData.user_id = $scope.editOwnerFormData.user.id;
      $scope.editOwnerFormData.id = $stateParams.id;
      ownerService
        .editOwner($scope.editOwnerFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Owner Updated!'
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

  $scope.submitDeleteForm = function() {
    promise = modalService.open(
      "confirm", {
        message: 'Do you want to delete this owner?',
        confirmButton: "Yes, Please Delete!",
        denyButton: "No, wait!"
      }
    );
    promise.then(
      function handleResolve(response) {
        ownerService
          .deleteOwner({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Owner Deleted!'
              }
            );
            promise.then(function handleResolve(response) {
                $location.path('manage-owners');
              },
              function handleReject(error) {});

          })
          .error(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Went Wrong'
              }
            );
            promise.then(function handleResolve(response) {},
              function handleReject(error) {});
          });
      },
      function handleReject(error) {

      });
  }
};

editOwnerCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'ownerService', 'userService', 'modalService'];

app.controller('editOwnerCtrl', editOwnerCtrl);
