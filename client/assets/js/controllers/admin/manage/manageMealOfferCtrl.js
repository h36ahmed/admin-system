var app = angular.module('lunchSociety');

var manageMealOfferCtrl = function($scope, mealOfferService ) {

  $scope.offers = [];
  $scope.today_date = new Date();

  mealOfferService
    .getMealOffers()
    .success(function(data, status, headers, config) {
      $scope.offers = data;
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageMealOfferCtrl.inject = ['$scope', 'mealOfferService'];

app.controller('manageMealOfferCtrl', manageMealOfferCtrl);
