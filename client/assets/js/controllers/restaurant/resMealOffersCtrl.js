var app = angular.module('lunchSociety');

var resMealOffersCtrl = function ($scope, $filter, mealService, modalService, weekService, mealOfferService, payoutService, utilService) {

  $scope.offers = [];

  $scope.payouts = [];

  $scope.weeks = [];

  $scope.today_date = new Date();

  $scope.filterDate = null;

  $scope.currentViewWeek = null;

  $scope.filterWeek = null;

  const currentWeek = Math.ceil($filter('date')($scope.today_date, 'ww')/2) - 1

  const year = $scope.today_date.getFullYear();

  function offerService(date) {
    console.log(date)
    let promise = modalService.open(
      "status", {}
    );
    mealOfferService
      .getMealOffers({
        from: utilService.formatShortDate(date.from_date),
        to: utilService.formatShortDate(date.to_date)
      })
      .success(function(data, status, headers, config) {
        $scope.offers = data;
        modalService.resolve();
      })
      .error(function(data, status, headers, config) {
        // Handle login errors here
        $scope.message = 'Error: Something Went Wrong';
      });
  }

  weekService
    .getWeeks({
      year: year
    })
    .success(function(data, status, headers, config) {
      $scope.weeks = data;
      $scope.currentViewWeek = data[currentWeek]
      offerService(data[currentWeek]);
    })
    .error(function(data, status, headers, config) {
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.changeWeek = function(action) {
    switch (action) {
      case 'nextWeek':
        const nextWeekSet = $scope.currentViewWeek.id + 1;
        generatePayouts({ id: nextWeekSet });
        changeCurrentWeek(nextWeekSet)
        break;
      case 'prevWeek':
        const previousWeekSet = $scope.currentViewWeek.id - 1;
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

  $scope.formatDate = (date) => {
      const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ]
      const splitDate = date.split('T')[0].split('-')
      const day = splitDate[1]
      const month = monthNames[parseInt(splitDate[1] - 1)]
      const year = splitDate[0]

      return `${month} ${day}, ${year}`
  }

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
        console.log(data)
        $scope.payouts = data;
        modalService.resolve();
      })
      .error((data, status, headers, config) => {
        $scope.message = 'Error: Something Went Wrong';
      });
  }

  const resolvePromise = (promise, data, message, redirect) => {
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
