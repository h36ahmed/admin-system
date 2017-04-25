var app = angular.module('lunchSociety');

var browseCtrl = function ($scope, $state, $location, $stateParams, uiGmapGoogleMapApi, modalService, mealOfferService, utilService, orderService, pickUpService, _) {

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

    $scope.pickups = [];

    pickUpService
        .getPickUps()
        .success(function (data, status, headers, config) {
            $scope.pickups = data;
        })
        .error(function (data, status, headers, config) {
            $scope.message = 'Error: Something Went Wrong';
        });

    $scope.offers = [];

    var promise = modalService.open(
        "status", {}
    );

    mealOfferService
        .getMealOffers({
            offer_date: utilService.formatDate(new Date())
        })
        .success(function (data, status, headers, config) {
            $scope.offers = data;
            modalService.resolve();
            promise.then(
                function handleResolve(response) {
                    var count = 0;
                    $scope.restaurants = _.map($scope.offers, function (offer) {
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
        .error(function (data, status, headers, config) {
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

    $scope.getMealDetails = function (meal) {
        var promise = modalService.open(
            "meal-choice", {
                pickups: $scope.pickups,
                message: 'Click CONFIRM only after you have selected the correct week period that you have paid restaurants for.',
            }
        );
        promise.then(
            function handleResolve(response) {

            },
            function handleReject(error) {});
    };
};

browseCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'uiGmapGoogleMapApi', 'modalService', 'mealOfferService', 'utilService', 'orderService', 'pickUpService'];

app.controller('browseCtrl', browseCtrl);
