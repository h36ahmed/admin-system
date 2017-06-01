var app = angular.module('lunchSociety');

var historyCtrl = function ($scope, $location,commonService, orderService, modalService, utilService) {

    $scope.orders = [];

    orderService
        .getOrders({
            customer_id: commonService.getCustomerID()
        })
        .success(function (data, status, headers, config) {
            console.log(data)
            const sortedData = data.sort(utilService.sortByDate)
            $scope.orders = sortedData;
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

    $scope.giveFeedback = (orderId) => {
      $location.path(`create-feedback/${orderId}`)
    }
};


historyCtrl.inject = ['$scope', '$location','commonService', 'orderService', 'modalService', 'utilService'];

app.controller('historyCtrl', historyCtrl);
