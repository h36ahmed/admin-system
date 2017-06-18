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
      .getMealOffers({ restaurant: restaurant, offer_date: moment(currentViewDate).format('YYYY-MM-DDT00:00:00.000[Z]') })
      .success((data, status, headers, config) => {
        modalService.resolve()
        promise.then(function handleResolve(response) {
          promise = modalService.open(
            'meal-offer', {
              message: 'test message',
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
      })
  }

  getOrders(options);

  function getOrders(options) {
    orderService
      .getOrders({'order_date': moment(options.order_date).format('YYYY-MM-DDT00:00:00.000[Z]')})
      .success((data, status, headers, config) => {
        $scope.orders = data
      })
  }

  // console.log('orders', $scope.orders)
  // $scope.getMealDetails = function (offer) {
  //   console.log(offer)
  //       var promise = modalService.open(
  //           "meal-choice", {
  //               pickups: $scope.pickups,
  //               message: 'Click CONFIRM only after you have selected the correct week period that you have paid restaurants for.',
  //               meal: offer.meal
  //           }
  //       );
  //       promise.then(
  //           function handleResolve(response) {
  //               var order = {
  //                   order_date: utilService.formatDate(new Date()),
  //                   offer_id: offer.id,
  //                   pickup_time_id: response.id,
  //                   customer_id: $scope.customer_id,
  //               };
  //               promise = modalService.open(
  //                   "status", {}
  //               );
  //               orderService
  //                   .createOrder(order)
  //                   .success(function (data, status, headers, config) {
  //                     console.log('trigger')
  //                     console.log('data', data)
  //                       modalService.resolve();
  //                       promise.then(
  //                           function handleResolve(response) {
  //                               promise = modalService.open(
  //                                   "alert", {
  //                                       message: 'Order Successfully Placed!'
  //                                   }
  //                               );
  //                               promise.then(function handleResolve(response) {
  //                                   $location.path(`order/${data.id}`);
  //                               }, function handleReject(error) {});
  //                           },
  //                           function handleReject(error) {
  //                           });
  //                   })
  //                   .error(function (data, status, headers, config) {
  //                       modalService.resolve();
  //                       promise.then(
  //                           function handleResolve(response) {
  //                               promise = modalService.open(
  //                                   "alert", {
  //                                       message: 'Error: Something Went Wrong'
  //                                   }
  //                               );
  //                               promise.then(function handleResolve(response) {}, function handleReject(error) {});
  //                           },
  //                           function handleReject(error) {
  //                               console.log('Why is it rejected?');
  //                           }
  //                       );
  //                   });
  //           },
  //           function handleReject(error) {});
  //   };
}
resOrdersCtrl.inject = ['$scope', '$location', 'orderService', 'modalService', 'mealOfferService', 'utilService', 'commonService', 'moment'];

app.controller('resOrdersCtrl', resOrdersCtrl);
