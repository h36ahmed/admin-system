var app = angular.module('lunchSociety');

var resOrdersCtrl = function ($scope,commonService, mealService, modalService) {

    var restaurant = commonService.getRestaurantID();

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

resOrdersCtrl.inject = ['$scope','commonService', 'mealService', 'modalService'];

app.controller('resOrdersCtrl', resOrdersCtrl);
