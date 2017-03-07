var app = angular.module('lunchSociety');

var manageFeedbackCtrl = function($scope, feedbackService, modalService) {

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

  $scope.openFeedbackModal = function(feedback) {
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

manageFeedbackCtrl.inject = ['$scope', 'feedbackService', 'modalService'];

app.controller('manageFeedbackCtrl', manageFeedbackCtrl);
