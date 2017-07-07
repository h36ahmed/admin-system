var app = angular.module('lunchSociety');

var createAccountModalCtrl = function($scope, modalService) {

  // Setup default values using modal params.
  $scope.message = (modalService.params().message || "Whoa!");

  // ---
  // PUBLIC METHODS.
  // ---

  // Wire the modal buttons into modal resolution actions.
  $scope.close = modalService.resolve;

  // I jump from the current alert-modal to the confirm-modal.
  $scope.jumpToConfirm = function() {
    // We could have used the .open() method to jump from one modal
    // to the next; however, that would have implicitly "rejected" the
    // current modal. By using .proceedTo(), we open the next window, but
    // defer the resolution of the current modal until the subsequent
    // modal is resolved or rejected.
    modalService.proceedTo(
        "confirm", {
          message: "I just came from Alert - doesn't that blow your mind?",
          confirmButton: "Eh, maybe a little",
          denyButton: "Oh please"
        }
      )
      .then(
        function handleResolve() {
          console.log("Piped confirm resolved.");
        },
        function handleReject() {
          console.warn("Piped confirm rejected.");
        }
      );
  };


};

createAccountModalCtrl.inject = ['$scope', 'modalService'];

app.controller('createAccountModalCtrl', createAccountModalCtrl);
