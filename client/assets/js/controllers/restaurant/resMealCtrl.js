var app = angular.module('lunchSociety');

var resMealCtrl = function ($scope, $stateParams, $filter, $location, commonService, mealService, modalService) {

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
      let promise = modalService.open(
        "status", {}
      );
      if (isValid) {
        mealService
          .editMeal($scope.editMealFormData)
          .success((data, headers, status, config) => {
            // console.log(data)
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                promise = modalService.open(
                  "alert", {
                    message: 'Your offer has been updated'
                  }
                );
                promise.then(function handleResolve(response) {
                    $scope.editMealFormData = {
                        meal_id: null,
                        plates_left: null,
                        plates_assigned: null,
                        offer_date: null
                    };
                    $location.path('restaurant/meals')
                },
                  function handleReject(error) {

                });
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error((data, headers, status, config) => {
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

resMealCtrl.inject = ['$scope', '$stateParams', '$filter', '$location', 'commonService', 'mealService', 'modalService'];

app.controller('resMealCtrl', resMealCtrl);
