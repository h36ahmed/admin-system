var app = angular.module('lunchSociety');

var historyCtrl = function ($scope, $location, orderService, modalService) {

    // custom function that sorts the order_date
    const sortByOrderDate = (a,b) => {
      if (a['order_date'] > b['order_date']) {
        return -1
      }
      if (a['order_date'] < b['order_date']) {
        return 1
      }
      return 0
    }

    $scope.orders = [];

    orderService
        .getOrders({
            customer_id: 1
        })
        .success(function (data, status, headers, config) {
            const sortedData = data.sort(sortByOrderDate)
            $scope.orders = sortedData;
        })
        .error(function (data, status, headers, config) {
          const sortedData =
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


historyCtrl.inject = ['$scope', '$location', 'orderService', 'modalService'];

app.controller('historyCtrl', historyCtrl);
