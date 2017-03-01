var app = angular.module('lunchSociety');

var editRestaurantCtrl = function($scope, $state, $location,
  $stateParams, restaurantService,
  ownerService, modalService, _) {

  $scope.restaurant = {};
  $scope.editRestaurantFormData = {};

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
    $scope.editRestaurantFormData.name = $scope.restaurant.name;
    $scope.editRestaurantFormData.phone_number = parseInt($scope.restaurant.phone_number);
    $scope.editRestaurantFormData.postal_code = $scope.restaurant.postal_code;
    $scope.editRestaurantFormData.owner = _.findWhere($scope.owners, {
      id: $scope.restaurant.owner_id
    });
    $scope.editRestaurantFormData.street_address = $scope.restaurant.street_address;
    $scope.editRestaurantFormData.city = $scope.restaurant.city;
    $scope.editRestaurantFormData.country = $scope.restaurant.country;
    $scope.editRestaurantFormData.state = $scope.restaurant.state;
  }

  // SUBMIT EDIT FORM

  $scope.submitEditForm = function(isValid) {

    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editRestaurantFormData.owner_id = parseInt($scope.editRestaurantFormData.owner.id);
      $scope.editRestaurantFormData.phone_number = parseInt($scope.editRestaurantFormData.phone_number);
      $scope.editRestaurantFormData.id = $stateParams.id;
      restaurantService
        .editRestaurant($scope.editRestaurantFormData)
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
