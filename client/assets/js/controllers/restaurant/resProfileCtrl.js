var app = angular.module('lunchSociety');

var resProfileCtrl = function ($scope, mealService, modalService) {



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

resProfileCtrl.inject = ['$scope', 'mealService', 'modalService'];

app.controller('resProfileCtrl', resProfileCtrl);
