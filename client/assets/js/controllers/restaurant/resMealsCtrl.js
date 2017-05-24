var app = angular.module('lunchSociety');

var resMealsCtrl = function ($scope, mealService, modalService) {

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

resMealsCtrl.inject = ['$scope', 'mealService', 'modalService'];

app.controller('resMealsCtrl', resMealsCtrl);
