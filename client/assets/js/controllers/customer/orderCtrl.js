var app = angular.module('lunchSociety');

var orderCtrl = function ($scope, orderService, uiGmapGoogleMapApi) {
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
    }],
        disableDefaultUI: true,
        minZoom: 12
    };

    $scope.restaurants = [];

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.order = {};


    orderService
        .getOrder({
            id: 1,
        })
        .success(function (data, status, headers, config) {
          const { latitude, longitude, name, address } = data.offer.meal.restaurant
          const restaurantData = {
            latitude: latitude,
            longitude: longitude,
            title: name,
            id: data.id,
            options: {
              labelClass: 'mapLabel',
              title: name,
            }
          }

          $scope.restaurants.push(restaurantData)
          $scope.map = {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            zoom: 14
          }
          $scope.order = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });

  $scope.cancelOrder = () => {
    orderService
      .editOrder({
        id: 1
      })
      .then(data => {
        console.log('successfully cancelled')
        console.log('cancel order', data)
      })
  }
};

createFeedbackCtrl.inject = ['$scope', 'orderService', 'uiGmapGoogleMapApi'];

app.controller('orderCtrl', orderCtrl);
