var app = angular.module('lunchSociety');

app.directive('lsProgressBar', progressBarDirective);

function progressBarDirective($rootScope) {

  return ({
    restrict: 'E',
    scope: {
      screens: '=',
      activeScreen: "=",
      barComplete: "="
    },
    controllerAs: 'progressBar',
    controller: progressBarCtrl
  });

  function progressBarCtrl($scope) {

  }

}
