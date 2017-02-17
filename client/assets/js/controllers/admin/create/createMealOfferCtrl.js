var app = angular.module('lunchSociety');

var createMealOfferCtrl = function($scope, $location, restaurantService, mealOfferService, modalService) {

  $scope.createMealOfferFormData = {};

  $scope.restaurants = [];

  $scope.meals = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
      console.log($scope.restaurants);
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.displayMeals = function() {
    $scope.meals = $scope.createMealOfferFormData.restaurant.meals;
  };

  $scope.selectMeal = function(id) {
    $scope.createMealOfferFormData.meal_id = id;
  }

  $scope.unselectMeal = function() {
    $scope.createMealOfferFormData.meal_id = null;
  }

  $scope.allValuesPresent = function() {

      if ($scope.createMealOfferFormData.meal_id == null
          || $scope.createMealOfferFormData.plates_left == null
          || $scope.createMealOfferFormData.offer_date == null) {
          return false;
      }
      return true;
  }

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid && allValuesPresent() ) {

      $scope.createMealOfferFormData.plates_left = $scope.createMealOfferFormData.plates_assigned;
      var promise = modalService.open(
        "status", {}
      );

      mealOfferService
        .createMealOffer($scope.createOfferFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Offer Created'
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

createMealOfferCtrl.inject = ['$scope', '$location', 'restaurantService', 'mealOfferService', 'modalService'];

app.controller('createMealOfferCtrl', createMealOfferCtrl);
