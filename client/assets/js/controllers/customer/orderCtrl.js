var app = angular.module('lunchSociety');

var orderCtrl = function ($scope, $location, commonService, orderService, modalService, uiGmapGoogleMapApi) {

    var customerID = commonService.getCustomerID();

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
            const {
                latitude,
                longitude,
                name,
                address
            } = data.offer.meal.restaurant
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

  // status 503, does not work properly
  $scope.cancelOrder = () => {
    let promise = modalService.open(
      "status", {}
    );
    orderService
      .editOrder({
        id: 1
      })
      .success((data, status, headers, config) => {
        modalService.resolve();
        promise.then(
          function handleResolve(response){
              $scope.feedbackFormData = {};
              promise = modalService.open(
                "alert", {
                  message: 'Your order was cancelled. You will receive an email with the details soon.'
                }
              );
              promise.then(function handleResolve(response) {
                $location.path('browse')
              },
                function handleReject(error){});
          },
          function handleReject(error){
            console.log('Why is it rejected?');
          }
        );
      })
      .error((data, status, headers, config) => {
        modalService.resolve();
        promise.then(
          function handleResolve(response){
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Went Wrong'
              }
            );
            promise.then(function handleResolve(response){},
              function handleReject (error){});
          },
          function handleReject(error){
            console.log('Why is it rejected?');
          }
        );
      });
  }
};

createFeedbackCtrl.inject = ['$scope', '$location', 'commonService', 'orderService', 'modalService', 'uiGmapGoogleMapApi'];

app.controller('orderCtrl', orderCtrl);
