var app = angular.module('lunchSociety');

var resProfileCtrl = function ($scope, commonService,mealService, modalService) {

    var restaurant = commonService.getRestaurantID();
    var owner = commonService.getOwnerID();

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

resProfileCtrl.inject = ['$scope','commonService', 'mealService', 'modalService'];

app.controller('resProfileCtrl', resProfileCtrl);
