var app = angular.module('lunchSociety');

var resMealCtrl = function ($scope, $stateParams, $filter, commonService, mealService, modalService) {

    var restaurant = commonService.getRestaurantID();

    $scope.meal = {}

    $scope.editMealFormData = {}

    mealService
      .getMeal({id: $stateParams.id})
      .success((data, status, headers, config) => {
        const { name, price, meal_image, description, ingredients } = data

        $scope.editMealFormData.name = name
        $scope.editMealFormData.price = price
        $scope.editMealFormData.meal_file_image = meal_image
        $scope.editMealFormData.description = description
        $scope.editMealFormData.ingredients = ingredients
        $scope.editMealFormData.id = $stateParams.id
      })

    $scope.submitEditForm = (isValid) => {
      if (isValid) {
        mealService
          .editMeal($scope.editMealFormData)
          .success((data, headers, status, config) => {
            console.log(data)
          })
      }
    }

    function resolvePromise(promise, data, message, redirect) {
        modalService.resolve();
        promise.then(
            function handleResolve(response) {
                promise = modalService.open(
                    "alert", {
                        message: message
                    }
                );
                promise.then(function handleResolve(response) {
                    if (redirect) {
                        $location.path('/');
                    }
                }, function handleReject(error) {});
            },
            function handleReject(error) {
                console.log('Why is it rejected?');
            }
        );
    }
};

resMealCtrl.inject = ['$scope', '$stateParams', '$filter', 'commonService', 'mealService', 'modalService'];

app.controller('resMealCtrl', resMealCtrl);
