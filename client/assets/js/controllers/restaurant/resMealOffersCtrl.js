var app = angular.module('lunchSociety');

var resMealOffersCtrl = function ($scope, $filter, mealService, modalService, weekService, mealOfferService, payoutService, utilService) {

// this is from manage meal offer ctrl from admin
  $scope.offers = [];

  $scope.today_date = new Date();

  $scope.filterDate = null;

  $scope.currentViewDate = new Date();

  offerService($scope.currentViewDate);

  $scope.changeDate = function(action) {
    switch (action) {
      case 'nextDay':
        $scope.currentViewDate.setDate($scope.currentViewDate.getDate() + 1);
        offerService($scope.currentViewDate);
        break;
      case 'prevDay':
        $scope.currentViewDate.setDate($scope.currentViewDate.getDate() - 1);
        offerService($scope.currentViewDate);
        break;
      case 'today':
        offerService($scope.today_date);
        $scope.currentViewDate = new Date();
        break;
      case 'custom':
        if ($scope.filterDate != null || $scope.filterDate.length > 0) {
          var customDate = new Date($scope.filterDate);
          offerService(customDate);
          $scope.currentViewDate = customDate;
        }
        break;
      default:
        return true;
    }
  };

  function offerService(date) {
    var promise = modalService.open(
      "status", {}
    );
    mealOfferService
      .getMealOffers({
        offer_date: utilService.formatDate(date)
      })
      .success(function(data, status, headers, config) {
        $scope.offers = data;
        modalService.resolve();
        promise.then(
          function handleResolve(response) {},
          function handleReject(error) {});

      })
      .error(function(data, status, headers, config) {
        // Handle login errors here
        $scope.message = 'Error: Something Went Wrong';
      });
  }
// this is the end of the meal offer ctrl from admin

// this is the beginning of the payout ctrl

  var year = $scope.today_date.getFullYear();

  var currentWeek = Math.ceil($filter('date')($scope.today_date, 'ww')/2)

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
      $scope.currentViewWeek = data[currentWeek]
    })
    .error(function(data, status, headers, config) {
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.changeWeek = function(action) {
    switch (action) {
      case 'nextWeek':
        var nextWeekSet = $scope.currentViewWeek.id + 1;
        generatePayouts({ id: nextWeekSet });
        changeCurrentWeek(nextWeekSet)
        break;
      case 'prevWeek':
        var previousWeekSet = $scope.currentViewWeek.id - 1;
        generatePayouts({ id: previousWeekSet });
        changeCurrentWeek(previousWeekSet)
        break;
      case 'current':
        generatePayouts({
          id: currentWeek
        })
        changeCurrentWeek(currentWeek)
        break
      case 'custom':
        generatePayouts({ id: $scope.filterWeek.id });
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

  const changeCurrentWeek = (id) => {
    const weeks = _.where($scope.weeks, { id });
    $scope.currentViewWeek = weeks[0];
  }

  const generatePayouts = (options) => {
    let promise = modalService.open(
      "status", {}
    );
    weekService
      .getWeek(options)
      .success((data, status, headers, config) => {
        $scope.payouts = data;
        modalService.resolve();
      })
      .error((data, status, headers, config) => {
        $scope.message = 'Error: Something Went Wrong';
      });
  }

// this is the end of the manage payout ctrl from admin
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

};

resMealOffersCtrl.inject = ['$scope', 'mealService', 'modalService', 'weekService', 'mealOfferService', 'payoutService', 'utilService'];

app.controller('resMealOffersCtrl', resMealOffersCtrl);
