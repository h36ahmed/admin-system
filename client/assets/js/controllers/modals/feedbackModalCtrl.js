var app = angular.module('lunchSociety');

var feedbackModalCtrl = function($scope, modalService) {

  $scope.feedback = modalService.params().feedback;

  $scope.close = modalService.resolve;

};

feedbackModalCtrl.inject = ['$scope', 'modalService'];

app.controller('feedbackModalCtrl', feedbackModalCtrl);
