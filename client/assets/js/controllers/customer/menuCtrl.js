var app = angular.module('lunchSociety');

var menuCtrl = function ($scope, $location, $window, utilService, modalService, commonService, orderService) {

    // https://stackoverflow.com/questions/24940320/how-to-redirect-using-ng-click
    // this is where i got the function. not sure if this is the right way to do it
    if ($window.sessionStorage.feedbackID) {
      $location.path(`create-feedback/${$window.sessionStorage.feedbackID}`)
    }

    $scope.redirect = function(url, refresh) {
      if (refresh || $scope.$$phase) {
        utilService.isKitchenOpen() ? $window.location.href = url : $window.location.href = '/#!/kitchen-closed'
      } else {
        utilService.isKitchenOpen() ? $location.path(url) : $location.path('/#!/kitchen-closed')
        $scope.$apply();
      }
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
                $location.path('/browse')
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
