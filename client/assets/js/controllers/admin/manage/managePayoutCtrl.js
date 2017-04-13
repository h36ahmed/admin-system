var app = angular.module('lunchSociety');

var managePayoutCtrl = function($scope, payoutService, weekService, modalService, _) {

  var today_date = new Date();

  var year = today_date.getYear();

  $scope.tabview = "payouts";

  $scope.changeTabview = function(tabview) {
    $scope.tabview = tabview;
  }

  $scope.payouts = [];

  $scope.weeks = [];

  $scope.currentViewWeek = null;

  $scope.filterWeek = null;

  weekService
    .getWeeks({
      year: year
    })
    .success(function(data, status, headers, config) {
      $scope.weeks = data;
    })
    .error(function(data, status, headers, config) {
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.changeWeek = function(action) {
    switch (action) {
      case 'nextWeek':
        var nextWeekSet = $scope.currentViewWeek.id + 1;
        generatePayouts({
          id: nextWeekSet
        });
        var weeks = _.where($scope.weeks, {
          id: nextWeekSet
        });
        $scope.currentViewWeek = weeks[0];
        break;
      case 'prevWeek':
        var previousWeekSet = $scope.currentViewWeek.id - 1;
        generatePayouts({
          id: previousWeekSet
        });
        var weeks = _.where($scope.weeks, {
          id: previousWeekSet
        });
        $scope.currentViewWeek = weeks[0];
        break;
      case 'past':
        generatePastPayouts();
        break;
      case 'custom':
        generatePayouts({
          id: $scope.filterWeek.id
        });
        $scope.currentViewWeek = $scope.filterWeek;
        break;
      default:
        return true;
    }
  };

  $scope.confirmPayout = function() {
    if ($scope.currentViewWeek != null) {
      var promise = modalService.open(
        "payout", {
          header: 'Confirmation',
          message: 'Click CONFIRM only after you have selected the correct week period that you have paid restaurants for.',
          placeholder: $scope.currentViewWeek,
          weeks: $scope.weeks
        }
      );
      promise.then(
        function handleResolve(response) {
          payoutService
            .createPayout({week_id: response.id})
            .success(function(data, status, headers, config) {
              modalService.resolve();
              promise.then(
                function handleResolve(response) {
                  promise = modalService.open(
                    "alert", {
                      message: 'Payout Confirmed.'
                    }
                  );
                },
                function handleReject(error) {});
            })
            .error(function(data, status, headers, config) {
              promise = modalService.open(
                "alert", {
                  message: 'Error: Something Went Wrong!'
                }
              );
            });
        },
        function handleReject(error) {});
    } else {
      var promise = modalService.open(
        "alert", {
          message: 'Please filter by week before confirming payout.'
        }
      );
    }
  };

  function generatePastPayouts() {
    var promise = modalService.open(
      "status", {}
    );
    payoutService
      .getPayouts()
      .success(function(data, status, headers, config) {
        $scope.payouts = data;
        if ($scope.tabview == "payouts") {
          $scope.changeTabview('past-payouts');
        }
        modalService.resolve();
        promise.then(
          function handleResolve(response) {},
          function handleReject(error) {});
      })
      .error(function(data, status, headers, config) {
        $scope.message = 'Error: Something Went Wrong';
      });

  }

  function generatePayouts(options) {
    var promise = modalService.open(
      "status", {}
    );
    weekService
      .getWeek(options)
      .success(function(data, status, headers, config) {
        $scope.payouts = data;
        if ($scope.tabview == "past-payouts") {
          $scope.changeTabview('payouts');
        }
        modalService.resolve();
        promise.then(
          function handleResolve(response) {},
          function handleReject(error) {});
      })
      .error(function(data, status, headers, config) {
        $scope.message = 'Error: Something Went Wrong';
      });
  }

};

managePayoutCtrl.inject = ['$scope', 'payoutService', 'weekService', 'modalService'];

app.controller('managePayoutCtrl', managePayoutCtrl);
