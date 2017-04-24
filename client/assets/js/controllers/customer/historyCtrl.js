var app = angular.module('lunchSociety');

var historyCtrl = function ($scope, orderService, modalService) {

    $scope.orders = [];

    orderService
        .getOrders({
            customer_id: 1
        })
        .success(function (data, status, headers, config) {
            $scope.orders = data;
            console.log($scope.orders);
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });

    $scope.openFeedbackModal = function (feedback) {
        var promise = modalService.open(
            "feedback", {
                feedback: feedback
            }
        );
        promise.then(
            function handleResolve(response) {},
            function handleReject(error) {});
    }
};


historyCtrl.inject = ['$scope', 'orderService', 'modalService'];

app.controller('historyCtrl', historyCtrl);
