var app = angular.module('lunchSociety');

var resOrdersCtrl = function ($scope, $location, orderService, modalService, utilService, commonService, moment) {

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
        getOffers(options);
        break;
      case 'prevDay':
        $scope.currentViewDate = moment($scope.currentViewDate).subtract(1, 'd').format()
        options.order_date = $scope.currentViewDate;
        options.status = '';
        getOffers(options);
        break;
      case 'today':
        options.order_date = $scope.today_date;
        options.status = '';
        getOffers(options);
        $scope.currentViewDate = moment().format();
        break;
      case 'custom':
        if ($scope.filterDate != null || $scope.filterDate.length > 0) {
          var customDate = utilService.formatMonthToNum($scope.filterDate)
          options.order_date = customDate;
          options.status = '';
          getOffers(options);
          $scope.currentViewDate = $scope.filterDate;
        }
        break;
      default:
        return true;
    }
  };

  getOffers(options);

  function getOffers(options) {
    orderService
      .getOrders({'order_date': moment(options.order_date).format('YYYY-MM-DDT00:00:00.000[Z]')})
      .success((data, status, headers, config) => {
        $scope.orders = data
      })
  }
}
resOrdersCtrl.inject = ['$scope', '$location', 'orderService', 'modalService', 'utilService', 'commonService', 'moment'];

app.controller('resOrdersCtrl', resOrdersCtrl);
