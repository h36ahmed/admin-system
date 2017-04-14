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
            id: 1
        })
        .success(function (data, status, headers, config) {
            $scope.order = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });
};

createFeedbackCtrl.inject = ['$scope', 'orderService', 'uiGmapGoogleMapApi'];

app.controller('orderCtrl', orderCtrl);
