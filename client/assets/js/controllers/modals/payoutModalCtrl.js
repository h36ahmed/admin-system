var app = angular.module('lunchSociety');

var payoutModalCtrl = function($scope, modalService) {

  $scope.header = (modalService.params().header || "Confirmation");

  $scope.weeks = (modalService.params().weeks || []);
  // Setup defaults using the modal params.
  $scope.message = (modalService.params().message || "Give me.");
  // Setup the form inputs (using modal params).
  $scope.form = {
    week: (modalService.params().placeholder || "")
  };
  $scope.errorMessage = null;
  // ---
  // PUBLIC METHODS.
  // ---
  // Wire the modal buttons into modal resolution actions.
  $scope.cancel = modalService.reject;
  // I process the form submission.
  $scope.submit = function() {
    // If no input was provided, show the user an error message.
    if (!$scope.form.week) {
      return ($scope.errorMessage = "Please provide something!");
    }
    modalService.resolve($scope.form.week);
  };

};

payoutModalCtrl.inject = ['$scope', 'modalService'];

app.controller('payoutModalCtrl', payoutModalCtrl);
