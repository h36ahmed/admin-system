var app = angular.module('lunchSociety');

var createMealOfferCtrl = function($scope, $location, restaurantService, mealOfferService, modalService) {

  $scope.createOfferFormData = {};

  $scope.restaurants = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
       $scope.createOfferFormData.restaurant = $scope.restaurants[0];

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {

      //$scope.createOfferFormData.restaurant_id = $scope.createOfferFormData.restaurant.id;

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
