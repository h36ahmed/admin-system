var app = angular.module('lunchSociety');

var createFeedbackCtrl = function ($scope, orderService, feedbackService) {

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.order = {};

    $scope.feedbackFormData = {
        flavour: 0,
        portion: 0,
        overall: 0
    };

    orderService
        .getOrder({
            id: 1
        })
        .success(function (data, status, headers, config) {
            $scope.order = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });
};

createFeedbackCtrl.inject = ['$scope', 'orderService', 'feedbackService'];

app.controller('createFeedbackCtrl', createFeedbackCtrl);
