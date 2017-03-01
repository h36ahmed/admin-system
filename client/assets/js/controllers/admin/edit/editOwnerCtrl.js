var app = angular.module('lunchSociety');

var editOwnerCtrl = function($scope, $state, $location,
  $stateParams, ownerService,
  userService, modalService, _) {

  $scope.owner = {};
  $scope.editOwnerFormData = {};
  $scope.owners = [];

  var promise = modalService.open(
    "status", {}
  );
  userService
    .getUsers({
      type: "owner"
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      console.log($scope.owners);
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
                console.log($scope.owner);
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
                    message: 'Error: Owner ID Does Not Exist'
                  }
                );
                promise.then(function handleResolve(response) {
                    $location.path('owners');
                },
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
    $scope.editOwnerFormData.phone_number = parseInt($scope.owner.phone_number);
    $scope.editOwnerFormData.owner = _.findWhere($scope.owners, {
      id: $scope.owner.user_id
    });
    $scope.editOwnerFormData.confirmed_email = $scope.editOwnerFormData.user.confirmed_email;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editOwnerFormData.user_id = parseInt($scope.editOwnerFormData.owner.id);
      $scope.editOwnerFormData.id = $stateParams.id;
      console.log('Before');
      console.log(JSON.stringify($scope.editOwnerFormData));
      ownerService
        .editOwner($scope.editOwnerFormData)
        .success(function(data, status, headers, config) {
          console.log('After');
          console.log(data);
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
                $location.path('owners');
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
