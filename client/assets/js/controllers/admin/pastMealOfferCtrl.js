var app = angular.module('lunchSociety');

var manageMealOfferCtrl = function($scope, mealOfferService ) {

  $scope.mealOffers = [];

  mealOfferService
    .getMealOffers()
    .success(function(data, status, headers, config) {
      $scope.mealOffers = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageMealOfferCtrl.inject = ['$scope', 'mealOfferService'];

app.controller('manageMealOfferCtrl', manageMealOfferCtrl);
