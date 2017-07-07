var app = angular.module('lunchSociety');

var menuCtrl = function ($scope, $location, $window, utilService, modalService, commonService, orderService) {

    const customer = commonService.getCustomerID()
    if ($window.sessionStorage.feedbackID) {
      $location.path(`create-feedback/${$window.sessionStorage.feedbackID}`)
    }

    $scope.redirect = function(url, refresh) {
      utilService.checkCustomerOrdered({customer_id: customer, order_date: moment().format('YYYY-MM-DD'), status: 'active'})
        .then(data => {
          if (data.data.length > 0) {
            let promise = modalService.open(
              'status', {}
            )
            modalService.resolve()
            promise.then(
              function handleResolve(response) {
                promise = modalService.open(
                  'alert', {
                    message: 'You can only have 1 order. Please cancel your current order or wait until tomorrow to order another item'
                  }
                )
                promise.then(
                  function handleResolve(response) {
                    $location.path(`order/${data.data[0].id}`)
                  }, function handleReject(error) {
                    console.log('Why is it rejected?')
                  }
                )
              }, function handleReject(error){
                console.log('Why is it rejected?')
              }
            )

          // https://stackoverflow.com/questions/24940320/how-to-redirect-using-ng-click
          // this is where i got the function. not sure if this is the right way to do it
          } else if (refresh || $scope.$$phase) {
            utilService.isKitchenOpen() ? $window.location.href = url : $window.location.href = '/#!/kitchen-closed'
          } else {
            utilService.isKitchenOpen() ? $location.path(url) : $location.path('/#!/kitchen-closed')
            $scope.$apply();
          }
        })

    }

    $scope.logout = function() {
    var promise = modalService.open(
      "status", {}
    );
    commonService
      .logoutUser()
      .success(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            commonService.deleteAuthToken();
            $location.path('/');
          },
          function handleReject(error) {
            console.log('Why is it rejected?');
          }
        );
      })
      .error(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Wrong!'
              }
            );
            promise.then(function handleResolve(response) {
              console.log("Alert resolved.");
            }, function handleReject(error) {
              console.warn("Alert rejected!");
            });
          },
          function handleReject(error) {
            console.log('Why is it rejected?');
          }
        );
      });
  };

  $scope.checkIfAnyOrders = () => {
    let promise = modalService.open(
      "status", {}
    )
    orderService
      .getOrders({ order_date: moment().format('YYYY-MM-DD'), status: 'active' })
      .success((data, status, headers, config) => {
        if (data.length > 0) {
          modalService.resolve()
          promise.then(
            function handleResolve(response) {
              $location.path(`/order/${data[0].id}`)
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        } else {
          modalService.resolve()
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'You have no order yet!'
                }
              )
              promise.then(function handleResolve(response) {
                utilService.isKitchenOpen() ? $location.path('/browse') : $location.path('/kitchen-closed')
              }, function handleReject(error) {
                console.warn('Alert rejected!')
              })
            },
            function handleReject(error) {
              console.log('Why is it rejected?')
            }
          )
        }
      })
      .error((data, status, headers, config) => {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Wrong!'
              }
            );
            promise.then(function handleResolve(response) {
              console.log("Alert resolved.");
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

menuCtrl.inject = ['$scope', '$location', '$window', 'utilService', 'modalService', 'commonService', 'orderService'];

app.controller('menuCtrl', menuCtrl);
