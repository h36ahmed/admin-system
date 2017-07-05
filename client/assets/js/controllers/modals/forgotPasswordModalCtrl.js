var app = angular.module('lunchSociety');

var forgotPasswordModalCtrl = function ($scope, modalService, commonService, userService, passwordService) {

    const userId = commonService.getUserID()

    $scope.forgotPasswordFormData = {}

    $scope.message = modalService.params().message;

    $scope.submit = () => {
       if (!$scope.forgotPasswordFormData.email) {
          return $scope.errorMessage = 'All fields are required!'
        } else {
          let promise = modalService.open('status', {})
          userService
            .forgotPassword({ email: $scope.forgotPasswordFormData.email, password: passwordService.generatePassword()})
            .success((data, headers, status, config) => {
              modalService.resolve()
              promise = modalService.open(
                'alert', {
                  message: 'Your password has been reset and an email has been sent to you'
                }
              )
              promise.then(function handleResolve(response){}, function handleReject(error){})
            }, function handleReject(error){
              console.log('Why is it rejected?')
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

forgotPasswordModalCtrl.inject = ['$scope', 'modalService', 'commonService', 'userService', 'passwordService'];

app.controller('forgotPasswordModalCtrl', forgotPasswordModalCtrl);
