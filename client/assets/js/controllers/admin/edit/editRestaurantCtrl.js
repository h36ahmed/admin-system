var app = angular.module('lunchSociety');

var editRestaurantCtrl = function($scope, $state, $location,
  $stateParams, restaurantService,
  ownerService, modalService, _) {

  $scope.restaurant = {};
  $scope.editResFormData = {};

  $scope.owners = [];

  var promise = modalService.open(
    "status", {}
  );

  ownerService
    .getOwners()
    .success(function(data, status, headers, config) {
      $scope.owners = data;

      if ($stateParams.id) {

        restaurantService
          .getRestaurant({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            $scope.restaurant = data;
            fillFormData();
            modalService.resolve();
            promise.then(
              function handleResolve(response) {

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
                    message: 'Error: Restaurant ID Does Not Exist'
                  }
                );
                promise.then(function handleResolve(response) {
                  $location.path('restaurants');
                }, function handleReject(error) {});
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );

          });

      } else {

        $location.path('manage-restaurants');

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
            $location.path('manage-restaurants');
          }, function handleReject(error) {});
        },
        function handleReject(error) {
          console.log('Why is it rejected?');
        }
      );
    });

  // FILL FORM DATA

  function fillFormData() {
    $scope.editResFormData.name = $scope.restaurant.name;
    $scope.editResFormData.phone_number = $scope.restaurant.phone_number;
    $scope.editResFormData.postal_code = $scope.restaurant.postal_code;
    $scope.editResFormData.owner = _.findWhere($scope.owners, {
      id: $scope.restaurant.owner_id
    });
    $scope.editResFormData.street_address = $scope.restaurant.street_address;
    $scope.editResFormData.city = $scope.restaurant.city;
    $scope.editResFormData.country = $scope.restaurant.country;
    $scope.editResFormData.state = $scope.restaurant.state;
  }

  // SUBMIT EDIT FORM

  $scope.submitEditForm = function(isValid) {

    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editResFormData.owner_id = parseInt($scope.editResFormData.owner.id);
      $scope.editResFormData.phone_number = parseInt($scope.editResFormData.phone_number);
      $scope.editResFormData.id = $stateParams.id;
      restaurantService
        .editRestaurant($scope.editResFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Restaurant Updated!'
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
        message: 'Do you want to delete this restaurant?',
        confirmButton: "Yes, Please Delete!",
        denyButton: "No, wait!"
      }
    );
    promise.then(
      function handleResolve(response) {
        restaurantService
          .deleteRestaurant({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Restaurant Deleted!'
              }
            );
            promise.then(function handleResolve(response) {
                $location.path('manage-restaurants');
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

editRestaurantCtrl.inject = ['$scope', '$state', ' $location', '$stateParams', 'restaurantService', 'ownerService', 'modalService'];

app.controller('editRestaurantCtrl', editRestaurantCtrl);
