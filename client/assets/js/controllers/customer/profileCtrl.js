var app = angular.module('lunchSociety');

var profileCtrl = function ($scope, orderService) {

    $scope.customer = {};

    customerService
        .getCustomer({
            id: 1
        })
        .success(function (data, status, headers, config) {
            $scope.customer = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });
};

profileCtrl.inject = ['$scope', 'orderService'];

app.controller('profileCtrl', profileCtrl);
