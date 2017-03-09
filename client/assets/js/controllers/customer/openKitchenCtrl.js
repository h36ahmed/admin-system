var app = angular.module('lunchSociety');

var openKitchenCtrl = function($scope, $state, $location, $stateParams, uiGmapGoogleMapApi, modalService, mealOfferService, utilService, _) {

  $scope.map = {
    center: {
      latitude: 43.6532,
      longitude: -79.3832
    },
    zoom: 14
  };

  $scope.options = {
    styles: [{
      featureType: 'poi',
      stylers: [{
        visibility: 'off'
      }]
    }, {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{
        visibility: 'off'
      }]
    }]
  };

  $scope.offers = [];

  var promise = modalService.open(
    "status", {}
  );

  mealOfferService
    .getMealOffers({
      offer_date: utilService.formatDate(new Date())
    })
    .success(function(data, status, headers, config) {
      $scope.offers = data;
      console.log($scope.offers);
      modalService.resolve();
      promise.then(
        function handleResolve(response) {
          var count = 0;
          $scope.restaurants = _.map($scope.offers, function(offer) {
            count += 1;
            return {
              latitude: offer.meal.restaurant.latitude,
              longitude: offer.meal.restaurant.longitude,
              title: offer.meal.restaurant.name,
              id: count,
              options: {
                labelClass: 'mapLabel',
                title: offer.meal.restaurant.name
              }
            };
          });
        },
        function handleReject(error) {});
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
          promise.then(function handleResolve(response) {}, function handleReject(error) {});
        },
        function handleReject(error) {
          console.log('Why is it rejected?');
        }
      );
    });
};

openKitchenCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'uiGmapGoogleMapApi', 'modalService', 'mealOfferService', 'utilService'];

app.controller('openKitchenCtrl', openKitchenCtrl);
