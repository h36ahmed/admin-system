var app = angular.module('lunchSociety');

var menuCtrl = function ($scope, $location, $window, utilService) {

    // https://stackoverflow.com/questions/24940320/how-to-redirect-using-ng-click
    // this is where i got the function. not sure if this is the right way to do it
    $scope.redirect = function(url, refresh) {
        if (refresh || $scope.$$phase) {
            utilService.isKitchenOpen() ? $window.location.href = url : $window.location.href = '/#!/kitchen-closed'
        } else {
            utilService.isKitchenOpen() ? $location.path(url) : $location.path('/#!/kitchen-closed')
            $scope.$apply();
        }

    }

};

menuCtrl.inject = ['$scope', '$location', '$window', 'utilService'];

app.controller('menuCtrl', menuCtrl);
