var app = angular.module('lunchSociety');

var resMealOffersCtrl = function ($scope, $filter, $location, commonService, mealService, modalService, weekService, mealOfferService, payoutService, utilService, moment) {

  var year = moment().year();

  var restaurant = commonService.getRestaurantID();

  $scope.offers = [];

  $scope.weeks = [];

  $scope.currentViewWeek = null;

  $scope.filterWeek = null;

  $scope.reportGenerated = false;

  const currentWeek = Math.ceil(moment().week() / 2)

  function offerService(week_id) {
    mealOfferService
      .getMealOfferReport({week_id: week_id, restaurant_id: restaurant})
      .success(function(data, status, headers, config) {
        $scope.offers = data;
        $scope.reportGenerated = true;
      })
      .error(function(data, status, headers, config) {
        $scope.message = 'Error: Something Went Wrong';
      });
  }

  weekService
    .getWeeks({
      year: year
    })
    .success(function(data, status, headers, config) {
      $scope.weeks = data;
      $scope.filterWeek = $scope.weeks[currentWeek - 1]
      $scope.currentViewWeek = $scope.weeks[currentWeek - 1]

      offerService(data[currentWeek - 1].id)
    })
    .error(function(data, status, headers, config) {
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.editMealOffer = (id) => {
    $location.path(`/restaurant/edit-meal-offer/${id}`)
  }

  $scope.changeWeek = function(action) {
    $scope.offers = []
    switch (action) {
      case 'nextWeek':
        const nextWeekSet = $scope.currentViewWeek.id + 1;
        offerService(nextWeekSet)
        var weeks = _.where($scope.weeks, {
          id: nextWeekSet
        });
        $scope.currentViewWeek = weeks[0];
        break;
      case 'prevWeek':
        const previousWeekSet = $scope.currentViewWeek.id - 1;
        offerService(previousWeekSet)
        var weeks = _.where($scope.weeks, {
          id: previousWeekSet
        });
        $scope.currentViewWeek = weeks[0];
        break;
      case 'current':
        offerService(currentWeek)
        var weeks = _.where($scope.weeks, {
          id: currentWeek
        })
        $scope.currentViewWeek = weeks[0]
        break
      case 'custom':
        $scope.currentViewWeek = $scope.filterWeek;
        offerService($scope.currentViewWeek.id);
        break;
      default:
        return true;
    }
  };

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

resMealOffersCtrl.inject = ['$scope','$filter', '$location', 'commonService', 'mealService', 'modalService', 'weekService', 'mealOfferService', 'payoutService', 'utilService', 'moment'];

app.controller('resMealOffersCtrl', resMealOffersCtrl);
