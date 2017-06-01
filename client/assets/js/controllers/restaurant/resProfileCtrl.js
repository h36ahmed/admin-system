var app = angular.module('lunchSociety');

var resProfileCtrl = function ($scope, ownerService, commonService, mealService, modalService) {

    var restaurant = commonService.getRestaurantID();
    var owner = commonService.getOwnerID();

    $scope.customer = {}

    ownerService
      .getOwner({id: owner})
      .success((data, headers, status, config) => {
        $scope.customer = data
      })

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

resProfileCtrl.inject = ['$scope', 'ownerService', 'commonService', 'mealService', 'modalService'];

app.controller('resProfileCtrl', resProfileCtrl);
