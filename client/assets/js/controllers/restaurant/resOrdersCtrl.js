var app = angular.module('lunchSociety');

var resOrdersCtrl = function ($scope, $location, orderService, modalService, mealOfferService, utilService, commonService, moment) {

  var restaurant = commonService.getRestaurantID()

  $scope.orders = [];

  $scope.today_date = moment().format();

  $scope.filterDate = null;

  $scope.currentViewDate = moment().format();

  var options = {
    order_date: $scope.currentViewDate,
    getOrders: true,
    status: 'active'
  }

  function getOrders(options) {
    orderService
      .getOrders({
        restaurant: restaurant,
        offer_date: moment(options.order_date).format('YYYY-MM-DD')
      })
      .success((data, status, headers, config) => {
        $scope.orders = data
      })
  }

  $scope.changeDate = function(action) {
    switch (action) {
      case 'nextDay':
        $scope.currentViewDate = moment($scope.currentViewDate).add(1, 'd').format()
        options.order_date = $scope.currentViewDate;
        options.status = '';
        getOrders(options);
        break;
      case 'prevDay':
        $scope.currentViewDate = moment($scope.currentViewDate).subtract(1, 'd').format()
        options.order_date = $scope.currentViewDate;
        options.status = '';
        getOrders(options);
        break;
      case 'today':
        options.order_date = $scope.today_date;
        options.status = '';
        getOrders(options);
        $scope.currentViewDate = moment().format();
        break;
      case 'custom':
        if ($scope.filterDate != null || $scope.filterDate.length > 0) {
          var customDate = utilService.formatMonthToNum($scope.filterDate)
          options.order_date = customDate;
          options.status = '';
          getOrders(options);
          $scope.currentViewDate = $scope.filterDate;
        }
        break;
      default:
        return true;
    }
  };

  $scope.viewMealOffer = (currentViewDate) => {
    let promise = modalService.open(
        "status", {}
    );
    mealOfferService
      .getMealOffers({ restaurant: restaurant, offer_date: moment(currentViewDate).format('YYYY-MM-DD') })
      .success((data, status, headers, config) => {
        if (data.length > 0) {
          modalService.resolve()
          promise.then(function handleResolve(response) {
            promise = modalService.open(
              'meal-offer', {
                offer: data[0]
              }
            )
            promise.then(
              function handleResolve(response){},
              function handleReject(error){}
            )
          },
            function handleReject(error) {
              console.log('Why is it rejected?')
            }
          )
        } else {
          modalService.resolve()
          promise.then(function handleResolve(response) {
            promise = modalService.open(
              'alert-create', {
                message: 'You have no offers for this day.'
              }
            )
            promise.then(
              function handleResolve(response) {
                $location.path('restaurant/create-meal-offer')
              },
              function handleReject(error) {}
            )
          },
            function handleReject(error) {
              console.log('Why is it rejected?')
            }
          )
        }
      })
  }

  getOrders(options);
}
resOrdersCtrl.inject = ['$scope', '$location', 'orderService', 'modalService', 'mealOfferService', 'utilService', 'commonService', 'moment'];

app.controller('resOrdersCtrl', resOrdersCtrl);
