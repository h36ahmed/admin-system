var app = angular.module('lunchSociety');

var mealOfferModalCtrl = function ($scope, modalService) {

    $scope.header = (modalService.params().header || "Confirmation");

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.message = (modalService.params().message || "Give me.");

    $scope.offer = (modalService.params().offer || {});

    $scope.errorMessage = null;

    // ---
    // PUBLIC METHODS.
    // ---

    $scope.cancel = modalService.reject;

    $scope.close = modalService.resolve;
};

mealOfferModalCtrl.inject = ['$scope', 'modalService'];

app.controller('mealOfferModalCtrl', mealOfferModalCtrl);
