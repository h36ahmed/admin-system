var app = angular.module('lunchSociety');

var manageFeedbackCtrl = function($scope, feedbackService ) {

  $scope.feedbacks = [];

  feedbackService
    .getFeedbacks()
    .success(function(data, status, headers, config) {
      $scope.feedbacks = data;

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

};

manageFeedbackCtrl.inject = ['$scope', 'feedbackService'];

app.controller('manageFeedbackCtrl', manageFeedbackCtrl);
