var app = angular.module('lunchSociety');

var browseCtrl = function ($scope, $state, $location, $stateParams, uiGmapGoogleMapApi, modalService, mealOfferService, utilService, orderService, pickUpService, _) {


    // utilService.checkFeedbackProvided({user_id: 6, status: 'active'})
    //   .then(data => {
    //     console.log(data)
    //     data.length > 0 ? $location.path(`create-feedback/${data[0].order_id}`) : $location.path('browse')
    //   })

    $scope.customer_id = 1;
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
    $scope.restaurants = [];

    var promise = modalService.open(
        "status", {}
    );

    mealOfferService
        .getMealOffers({
            offer_date: utilService.formatDate(new Date(), 'browse')
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
                function handleReject(error) {
                });
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

    $scope.getMealDetails = function (offer) {
        var promise = modalService.open(
            "meal-choice", {
                pickups: $scope.pickups,
                message: 'Click CONFIRM only after you have selected the correct week period that you have paid restaurants for.',
                meal: offer.meal
            }
        );
        promise.then(
            function handleResolve(response) {
                var order = {
                    order_date: utilService.formatDate(new Date()),
                    offer_id: offer.id,
                    pickup_time_id: response.id,
                    customer_id: $scope.customer_id
                };
                promise = modalService.open(
                    "status", {}
                );
                orderService
                    .createOrder(order)
                    .success(function (data, status, headers, config) {
                        modalService.resolve();
                        promise.then(
                            function handleResolve(response) {
                                promise = modalService.open(
                                    "alert", {
                                        message: 'Order Successfully Placed!'
                                    }
                                );
                                promise.then(function handleResolve(response) {
                                    $location.path(`order/${data.id}`);
                                }, function handleReject(error) {});
                            },
                            function handleReject(error) {
                            });
                      // need to make the offer plates left - 1
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
            },
            function handleReject(error) {});
    };
};

browseCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'uiGmapGoogleMapApi', 'modalService', 'mealOfferService', 'utilService', 'orderService', 'pickUpService'];

app.controller('browseCtrl', browseCtrl);
