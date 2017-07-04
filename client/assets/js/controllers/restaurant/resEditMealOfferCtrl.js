var app = angular.module('lunchSociety');

var resEditMealOfferCtrl = function ($scope, $stateParams, $location, commonService, mealService, modalService, utilService, restaurantService, mealOfferService, moment) {

  const restaurant = commonService.getRestaurantID();

  $scope.editMealOfferFormData = {};

  $scope.meals = [];

  restaurantService
    .getRestaurant({ id: restaurant })
    .success((data, status, headers, config) => {
      $scope.meals = data.meals
    })
    .error((data, status, headers, config) => {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

  mealOfferService
    .getMealOffer({ id: $stateParams.id })
    .success((data, status, headers, config) => {
      $scope.editMealOfferFormData.meal_id = data.meal_id
      $scope.editMealOfferFormData.plates_left = data.plates_left
      $scope.editMealOfferFormData.plates_assigned = data.plates_assigned
      $scope.editMealOfferFormData.offer_date = moment.parseZone(data.offer_date).format('MMMM DD, YYYY')
    })
    .error((data, status, headers, config) => {
      $scope.message = 'Error: Something Went Wrong'
    })

  $scope.selectMeal = (id) => {
    $scope.editMealOfferFormData.meal_id = id;
  }

  $scope.unselectMeal = () => {
    $scope.editMealOfferFormData.meal_id = null;
  }

  var allValuesPresent = () => {

      if ($scope.editMealOfferFormData.meal_id == null
          || $scope.editMealOfferFormData.plates_assigned == null
          || $scope.editMealOfferFormData.offer_date == null) {
          return false;
      }
      return true;
  }

  $scope.submitForm = (isValid) => {

    const isComplete = allValuesPresent();

    if (isValid && isComplete) {

      $scope.editMealOfferFormData.plates_left = $scope.editMealOfferFormData.plates_assigned;
      $scope.editMealOfferFormData.id = $stateParams.id
      let promise = modalService.open(
        "status", {}
      );

      mealOfferService
        .editMealOffer($scope.editMealOfferFormData)
        .success((data, status, headers, config) => {
          modalService.resolve();
            promise.then(
              function handleResolve(response) {
                promise = modalService.open(
                  "alert", {
                    message: 'Your offer has been updated'
                  }
                );
                promise.then(function handleResolve(response) {
                    $scope.editMealOfferFormData = {
                        meal_id: null,
                        plates_left: null,
                        plates_assigned: null,
                        offer_date: null
                    };
                    $location.path('restaurant/meal-offers')
                },
                  function handleReject(error) {

                });
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
        })
        .error((data, status, headers, config) => {
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
        })
    } else {
        console.log('Check Date & Values');
    }
  };
};

resEditMealOfferCtrl.inject = ['$scope', '$stateParams', '$location', 'commonService', 'mealService', 'modalService', 'utilService', 'restaurantService', 'mealOfferService', 'moment'];

app.controller('resEditMealOfferCtrl', resEditMealOfferCtrl);
