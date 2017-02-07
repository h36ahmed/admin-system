var app = angular.module('lunchSociety');

var confirmModalCtrl = function($scope, modalService) {

  var params = modalService.params();

  // Setup defaults using the modal params.
  $scope.message = (params.message || "Are you sure?");
  $scope.confirmButton = (params.confirmButton || "Yes!");
  $scope.denyButton = (params.denyButton || "Oh, hell no!");
  // ---
  // PUBLIC METHODS.
  // ---
  // Wire the modal buttons into modal resolution actions.
  $scope.confirm = modalService.resolve;
  $scope.deny = modalService.reject;

};

confirmModalCtrl.inject = ['$scope', 'modalService'];

app.controller('confirmModalCtrl', confirmModalCtrl);
