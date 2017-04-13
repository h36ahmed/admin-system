var app = angular.module('lunchSociety');

var mealChoiceModalCtrl = function ($scope, modalService) {

    $scope.header = (modalService.params().header || "Confirmation");

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.pickups = (modalService.params().pickups || []);

    $scope.message = (modalService.params().message || "Give me.");

    $scope.form = {
        pickup: ($scope.pickups[0] || "")
    };
    $scope.errorMessage = null;

    // ---
    // PUBLIC METHODS.
    // ---

    $scope.cancel = modalService.reject;

    $scope.submit = function () {

        if (!$scope.form.week) {
            return ($scope.errorMessage = "Please provide something!");
        }
        modalService.resolve($scope.form.week);
    };

};

mealChoiceModalCtrl.inject = ['$scope', 'modalService', 'pickUpService'];

app.controller('mealChoiceModalCtrl', mealChoiceModalCtrl);
