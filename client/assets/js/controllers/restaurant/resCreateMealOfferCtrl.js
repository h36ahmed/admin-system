var app = angular.module('lunchSociety');

var resCreateMealOfferCtrl = function ($scope, mealService, modalService, utilService, restaurantService, mealOfferService) {

  $scope.createMealOfferFormData = {
      meal_id: null,
      plates_left: null,
      plates_assigned: null,
      offer_date: utilService.formatLongDate(utilService.getNextDate())
  };

  $scope.meals = [];

  restaurantService
    .getRestaurant({id: 1})
    .success(function(data, status, headers, config) {
      $scope.meals = data.meals
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

  var allValuesPresent = function() {

      if ($scope.createMealOfferFormData.meal_id == null
          || $scope.createMealOfferFormData.plates_assigned == null
          || $scope.createMealOfferFormData.offer_date == null) {
          return false;
      }
      return true;
  }

  var checkDate = function(date) {
      var today = new Date();
      /*if (date < today) {
          return false;
      }*/
      return true;
  }

  var clearValues = function() {
      scope.createMealOfferFormData.plates_left
  }

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid

    var isDateValid = checkDate($scope.createMealOfferFormData.offer_date);
    var isComplete = allValuesPresent();

    if (isValid && isDateValid && isComplete) {

      $scope.createMealOfferFormData.plates_left = $scope.createMealOfferFormData.plates_assigned;
      var promise = modalService.open(
        "status", {}
      );

      mealOfferService
        .createMealOffer($scope.createMealOfferFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Offer Created'
                }
              );
              promise.then(function handleResolve(response) {
                  $scope.createMealOfferFormData = {
                      meal_id: null,
                      plates_left: null,
                      plates_assigned: null,
                      offer_date: null
                  };
              },
                function handleReject(error) {

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
    } else {
        console.log('Check Date & Values');
    }
  };
};

resCreateMealOfferCtrl.inject = ['$scope', 'mealService', 'modalService', 'utilService', 'restaurantService', 'mealOfferService'];

app.controller('resCreateMealOfferCtrl', resCreateMealOfferCtrl);
