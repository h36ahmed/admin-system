var app = angular.module('lunchSociety');

var editMealCtrl = function($scope, $state, $location,
  $stateParams, mealService,
  restaurantService, modalService) {

  $scope.meal = {};
  $scope.editMealFormData = {};
  $scope.restaurants = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;

      if ($stateParams.id) {
        mealService
          .getMeal({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            $scope.meal = data;
            fillFormData();
          })
          .error(function(data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
          });
      } else {
        $location.path('manage-meals');
      }

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

  function fillFormData() {
    $scope.editMealFormData.name = $scope.meal.name;
    $scope.editMealFormData.tagline = $scope.meal.tagline;
    $scope.editMealFormData.price = $scope.meal.price;
    $scope.editMealFormData.restaurant = $scope.restaurants[$scope.meal.restaurant_id - 1];
    $scope.editMealFormData.description = $scope.meal.description;
    $scope.editMealFormData.ingredients = $scope.meal.ingredients;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      $scope.editMealFormData.restaurant_id = $scope.editMealFormData.restaurant.id;
      $scope.editMealFormData.id = $stateParams.id;
      mealService
        .editMeal($scope.editMealFormData)
        .success(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Meal Updated!');
        })
        .error(function(data, status, headers, config) {
          modalService.closeModal('ls-status-modal');
          modalService.openModal('ls-feedback-modal');
          $("#ls-feedback-message").html('Error: Something Went Wrong');
        });
    }
  };
    $scope.submitDeleteForm = function() {
    mealService
      .deleteMeal({
        id: $stateParams.id
      })
      .success(function(data, status, headers, config) {
        modalService.closeModal('ls-status-modal');
        modalService.openModal('ls-feedback-modal');
        $("#ls-feedback-message").html('Meal Deleted!');
        $location.path('manage-meals');
      })
      .error(function(data, status, headers, config) {
        modalService.closeModal('ls-status-modal');
        modalService.openModal('ls-feedback-modal');
        $("#ls-feedback-message").html('Error: Something Went Wrong');
      });
  }
};

editMealCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'mealService', 'restaurantService', 'modalService'];

app.controller('editMealCtrl', editMealCtrl);
