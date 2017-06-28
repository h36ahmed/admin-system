var app = angular.module('lunchSociety');

var resProfileCtrl = function ($scope, ownerService, commonService, mealService, modalService, passwordService) {

    var restaurant = commonService.getRestaurantID();
    var owner = commonService.getOwnerID();

    $scope.customer = {}

    ownerService
      .getOwner({id: owner})
      .success((data, headers, status, config) => {
        $scope.customer = data
      })

    function resolvePromise(promise, data, message, redirect) {
        modalService.resolve();
        promise.then(
            function handleResolve(response) {
                promise = modalService.open(
                    "alert", {
                        message: message
                    }
                );
                promise.then(function handleResolve(response) {
                    if (redirect) {
                        $location.path('/');
                    }
                }, function handleReject(error) {});
            },
            function handleReject(error) {
                console.log('Why is it rejected?');
            }
        );
    }

    $scope.passwordChangeModal = () => {
      let promise = modalService.open(
        'status', {}
      )

      modalService.resolve()
      promise.then(function handleResolve(response) {
        promise = modalService.open(
          "password-change", {
            message: 'Change your password'
          }
        )
        promise.then(function handleResolve(response) {
          promise = modalService.open(
            'alert', {
              message: 'Your password has been updated!'
            }
          )
          promise.then(function handleResolve(response){}, function handleReject(error){})
        }, function handleReject(error){})
      }, function handleReject(error) {
        console.log('Why is it rejected?')
      })
    }

    $scope.resetPassword = () => {
      let promise = modalService.open(
        'status', {}
      )
      modalService.resolve()
      promise.then(function handleResolve(response) {
        userService
          .editUser({ password: passwordService.generatePassword(), user_reset: true})
        promise = modalService.open(
          'alert', {
            message: 'Your password has been reset. You will receive an email shortly with the new password'
          }
        )
        promise.then(function handleResolve(response){}, function handleReject(error){})
      }, function handleReject(error) {
        console.log('Why is it rejected?')
      })
      console.log('reset password')
      console.log('password service', passwordService.generatePassword())
    }
};

resProfileCtrl.inject = ['$scope', 'ownerService', 'commonService', 'mealService', 'modalService', 'passwordService'];

app.controller('resProfileCtrl', resProfileCtrl);
