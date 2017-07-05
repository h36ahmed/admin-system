var app = angular.module('lunchSociety');

var homeCtrl = function ($scope, $location, commonService, modalService, $window, utilService) {

    $window.sessionStorage.loginPage = true;
    $scope.userFormData = {};

    $scope.submitForm = function (isValid) {
        delete $window.sessionStorage.loginPage;
        // check to make sure the form is completely valid
        if (isValid) {
            var promise = modalService.open(
                "status", {}
            );
            commonService
                .loginUser($scope.userFormData)
                .success(function (data, status, headers, config) {
                    modalService.resolve();
                    promise.then(
                        function handleResolve(response) {
                            commonService.setAuthToken(data.token);
                            commonService.setUserID(data.user_id);
                            if (data.type == "customer") {
                                commonService.setCustomerID(data.customer_id);
                                if (data.needOrderFeedback) {
                                  commonService.setFeedbackID(data.needOrderFeedback)
                                  $location.path(`create-feedback/${data.needOrderFeedback}`)
                                } else if (data.hasOrder) {
                                  $location.path(`order/${data.hasOrder}`)
                                } else if (utilService.isKitchenOpen()) {
                                  $location.path('browse')
                                } else {
                                  $location.path('kitchen-closed')
                                }
                            }
                            if (data.type == "owner") {
                                if (data.status === 'active') {
                                  commonService.setOwnerID(data.owner_id);
                                  commonService.setRestaurantID(data.restaurant_id);
                                  $location.path('/restaurant/orders');
                                } else {
                                  promise = modalService.open(
                                    'alert', {
                                      message: 'Error: Invalid user or password'
                                    }
                                  )
                                  promise.then(function handleResolve(response){}, function handleReject(error){})
                                }
                            }
                            if (data.type == "admin") {
                                $location.path('/meal-offers');
                            }
                        },
                        function handleReject(error) {
                            console.log('Why is it rejected?');
                        }
                    );

                })
                .error(function (data, status, headers, config) {
                    modalService.resolve();
                    promise.then(
                        function handleResolve(response) {
                            commonService.deleteAuthToken();
                            promise = modalService.open(
                                "alert", {
                                    message: 'Error: Invalid user or password'
                                }
                            );
                            promise.then(function handleResolve(response) {
                                console.log("Alert resolved.");
                                $window.sessionStorage.loginPage = true;
                            }, function handleReject(error) {
                                console.warn("Alert rejected!");
                            });
                        },
                        function handleReject(error) {
                            console.log('Why is it rejected?');
                        }
                    );
                });
        }
    };

    // $scope.resetPassword = () => {
    //   let promise = modalService.open(
    //     'status', {}
    //   )
    //   modalService.resolve()
    //   promise.then(function handleResolve(response) {
    //     userService
    //       .editUser({ password: passwordService.generatePassword(), user_reset: true, id: user})
    //       .success((data, headers, status, config) => {
    //         promise = modalService.open(
    //           'alert', {
    //             message: 'Your password has been reset. You will receive an email shortly with the new password'
    //           }
    //         )
    //         promise.then(function handleResolve(response){}, function handleReject(error){})
    //       })
    //   }, function handleReject(error) {
    //     console.log('Why is it rejected?')
    //   })
    // }

    $scope.passwordChangeModal = () => {
      delete $window.sessionStorage.loginPage;

      let promise = modalService.open(
        'status', {}
      )

      modalService.resolve()
      promise.then(function handleResolve(response) {
        promise = modalService.open(
          "forgot-password", {
            message: 'Forgot password'
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
};

homeCtrl.inject = ['$scope', '$location', 'commonService', 'modalService', '$window', 'utilService'];

app.controller('homeCtrl', homeCtrl);
