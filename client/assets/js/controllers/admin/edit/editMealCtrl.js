var app = angular.module('lunchSociety');

var editMealCtrl = function($scope, $state, $location,
  $stateParams, mealService,
  restaurantService, modalService,_) {

  $scope.meal = {};
  $scope.editMealFormData = {};
  $scope.restaurants = [];

  var promise = modalService.open(
    "status", {}
  );
  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
      console.log($scope.restaurants);
      if ($stateParams.id) {
        mealService
          .getMeal({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            modalService.resolve();

            promise.then(
              function handleResolve(response) {
                $scope.meal = data;
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
        $location.path('manage-meals');
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
            $location.path('manage-meals');
          }, function handleReject(error) {});
        },
        function handleReject(error) {
          console.log('Why is it rejected?');
        }
      );
    });

  function fillFormData() {
    $scope.editMealFormData.name = $scope.meal.name;
    $scope.editMealFormData.tagline = $scope.meal.tagline;
    $scope.editMealFormData.price = $scope.meal.price;
    $scope.editMealFormData.restaurant = _.findWhere($scope.restaurants, {id: $scope.meal.restaurant_id});
    $scope.editMealFormData.description = $scope.meal.description;
    $scope.editMealFormData.ingredients = $scope.meal.ingredients;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editMealFormData.restaurant_id = $scope.editMealFormData.restaurant.id;
      $scope.editMealFormData.id = $stateParams.id;
      mealService
        .editMeal($scope.editMealFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Meal Updated!'
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
        message: 'Do you want to delete this meal?',
        confirmButton: "Yes, Please Delete!",
        denyButton: "No, wait!"
      }
    );
    promise.then(
      function handleResolve(response) {
        mealService
          .deleteMeal({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Meal Deleted!'
              }
            );
            promise.then(function handleResolve(response) {
                $location.path('manage-meals');
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

editMealCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'mealService', 'restaurantService', 'modalService'];

app.controller('editMealCtrl', editMealCtrl);
