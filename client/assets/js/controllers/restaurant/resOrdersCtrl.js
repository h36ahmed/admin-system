var app = angular.module('lunchSociety');

var resOrdersCtrl = function ($scope, $location, orderService, modalService, utilService, commonService) {

  var restaurant = commonService.getRestaurantID()

  $scope.orders = [];

  $scope.today_date = new Date();

  $scope.filterDate = null;

  $scope.currentViewDate = new Date();

  var options = {
    order_date: $scope.currentViewDate,
    getOrders: true,
    status: 'active'
  }

  $scope.changeDate = function(action) {
    switch (action) {
      case 'nextDay':
        $scope.currentViewDate.setDate($scope.currentViewDate.getDate() + 1);
        options.order_date = $scope.currentViewDate;
        options.status = '';
        getOffers(options);
        break;
      case 'prevDay':
        $scope.currentViewDate.setDate($scope.currentViewDate.getDate() - 1);
        options.order_date = $scope.currentViewDate;
        options.status = '';
        getOffers(options);
        break;
      case 'today':
        options.order_date = $scope.today_date;
        options.status = '';
        getOffers(options);
        $scope.currentViewDate = new Date();
        break;
      case 'custom':
        if ($scope.filterDate != null || $scope.filterDate.length > 0) {
          var customDate = new Date($scope.filterDate);
          options.order_date = customDate;
          options.status = '';
          getOffers(options);
          $scope.currentViewDate = customDate;
        }
        break;
      default:
        return true;
    }
  };

  getOffers(options);

  function getOffers(options) {
    orderService
      .getOrders({'order_date': utilService.formatDateWithTimezone(options.order_date)})
      .success((data, status, headers, config) => {
        $scope.orders = data
      })
  }
}
resOrdersCtrl.inject = ['$scope', '$location', 'orderService', 'modalService', 'utilService', 'commonService'];

app.controller('resOrdersCtrl', resOrdersCtrl);
