var app = angular.module('lunchSociety');

var resMealOffersCtrl = function ($scope, $filter, commonService, mealService, modalService, weekService, mealOfferService, payoutService, utilService, moment) {

  var restaurant = commonService.getRestaurantID();

  $scope.offers = [];

  $scope.weeks = [];

  $scope.today_date = new Date();

  $scope.currentViewWeek = null;

  $scope.filterWeek = null;

  const currentWeek = Math.ceil($filter('date')($scope.today_date, 'ww')/2)

  const year = $scope.today_date.getFullYear();

  function offerService(date) {
    mealOfferService
      .getMealOffers({
        from: utilService.formatShortDate(date.from_date),
        to: utilService.formatShortDate(date.to_date)
      })
      .success(function(data, status, headers, config) {
        // sort on backend
        const sortedData = data.sort(utilService.sortByDate)
        $scope.offers = sortedData;
      })
      .error(function(data, status, headers, config) {
        // Handle login errors here
        $scope.message = 'Error: Something Went Wrong';
      });
  }

 // weekService
 //    .getWeeks({
 //      id: currentWeek,
 //    })
 //    .success(function(data, status, headers, config) {
 //      $scope.currentViewWeek = data[currentWeek - 1]
 //      offerService(data[currentWeek]);
 //    })
 //    .error(function(data, status, headers, config) {
 //      $scope.message = 'Error: Something Went Wrong';
 //    });

    weekService
      .getWeek({id: 11, type: 'resMealOffer'})
      .success((data, status, headers, config) => {
        console.log('trigger')
        console.log(data)
        $scope.offers = data
      })

  $scope.changeWeek = function(action) {
    switch (action) {
      case 'nextWeek':
        const nextWeekSet = $scope.currentViewWeek.id + 1;
        changeCurrentWeek(nextWeekSet)
        break;
      case 'prevWeek':
        const previousWeekSet = $scope.currentViewWeek.id - 1;
        changeCurrentWeek(previousWeekSet)
        break;
      case 'current':
        changeCurrentWeek(currentWeek)
        break
      case 'custom':
        $scope.currentViewWeek = $scope.filterWeek;
        break;
      default:
        return true;
    }
  };

  const changeCurrentWeek = (id) => {
    const weeks = _.where($scope.weeks, { id });
    $scope.currentViewWeek = weeks[0];
    offerService(weeks[0])
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

resMealOffersCtrl.inject = ['$scope','$filter', 'commonService', 'mealService', 'modalService', 'weekService', 'mealOfferService', 'payoutService', 'utilService', 'moment'];

app.controller('resMealOffersCtrl', resMealOffersCtrl);
