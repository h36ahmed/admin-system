var app = angular.module('lunchSociety');

var passwordChangeModalCtrl = function ($scope, modalService, commonService, userService) {

    const userId = commonService.getUserID()

    $scope.passwordChangeFormData = {}

    $scope.message = modalService.params().message;

    $scope.submit = () => {
      console.log('$scope', $scope.passwordChangeFormData)
       if (!$scope.passwordChangeFormData.new_password ||
           !$scope.passwordChangeFormData.old_password ||
           !$scope.passwordChangeFormData.confirm_password) {

          return $scope.errorMessage = 'All fields are required!'
        } else if ($scope.passwordChangeFormData.new_password !== $scope.passwordChangeFormData.confirm_password) {
          return $scope.errorMessage = 'Passwords do not match!'
        } else {
            userService
                .authenticateUser({ id: userId, password: $scope.passwordChangeFormData })
                .success((data, headers, status, config) => {
                    modalService.resolve($scope.passwordChangeFormData)
                })
                .error((data, headers, status, config) => {
                    $scope.errorMessage = data.error
                })
        }
    }

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.errorMessage = null;

    // ---
    // PUBLIC METHODS.
    // ---

    $scope.cancel = modalService.reject;

};

passwordChangeModalCtrl.inject = ['$scope', 'modalService', 'commonService', 'userService'];

app.controller('passwordChangeModalCtrl', passwordChangeModalCtrl);
