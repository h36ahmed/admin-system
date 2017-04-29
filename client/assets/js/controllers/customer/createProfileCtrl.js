var app = angular.module('lunchSociety');

var createProfileCtrl = function ($scope, paymentPlanService, customerService) {

    $scope.screenview = "details";

    $scope.screens = [{
        name: "details",
        label: 'Personal Details',
        completed: false
      }, {
        name: "plans",
        label: 'Meal Plans',
        completed: false
      }, {
        name: "payment",
        label: 'Payment',
        completed: false
      }];

    $scope.prevScreen = null;
    $scope.nextScreen = $scope.screens[1].name;

    $scope.calcWidth = function (index) {
        var width = (index / ($scope.screens.length - 1)) * 100;
        return width.toString() + "%";
    }

    $scope.barComplete = {
        width: '0%'
    };


    $scope.changeScreenView = function (screenview) {
        $scope.screenview = screenview;
        $scope.activeScreen = screenview;
        var checkIndex = {
            name: screenview
        };
        var index = _.findIndex($scope.screens, checkIndex);
        $scope.barComplete.width = $scope.calcWidth(index);
        if (index == 0) {
            $scope.prevScreen = null;
            $scope.screens[index + 1].completed = false;
            $scope.nextScreen = $scope.screens[index + 1].name;
        } else if (index == ($scope.screens.length - 1)) {
            $scope.prevScreen = $scope.screens[index - 1].name;
            $scope.screens[index - 1].completed = true;
            $scope.nextScreen = null;
        } else {
            $scope.prevScreen = $scope.screens[index - 1].name;
            $scope.screens[index - 1].completed = true;
            $scope.screens[index + 1].completed = false;
            $scope.nextScreen = $scope.screens[index + 1].name;
        }
    }

    $scope.activeScreen = $scope.screens[0].name;

    console.log($scope.activeScreen);

    $scope.profileFormData = {

    };

    $scope.stripeCallback = function (code, result) {
    if (result.error) {
        window.alert('it failed! error: ' + result.error.message);
    } else {
        window.alert('success! token: ' + result.id);
    }
};


};

createProfileCtrl.inject = ['$scope', 'paymentPlanService', 'customerService'];

app.controller('createProfileCtrl', createProfileCtrl);
