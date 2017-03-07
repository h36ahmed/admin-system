var app = angular.module('lunchSociety');

var manageOrderCtrl = function($scope, orderService, modalService, utilService) {

  $scope.offers = [];

  $scope.today_date = new Date();

  $scope.filterDate = null;

  $scope.currentViewDate = new Date();

  var options = {
    order_date: $scope.currentViewDate,
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
    options.order_date = utilService.formatDate(options.order_date);
    var promise = modalService.open(
      "status", {}
    );
    orderService
      .getOrders(options)
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

  function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return yyyy + "-" + mm + "-" + dd;
  }
};

manageOrderCtrl.inject = ['$scope', 'orderService', 'modalService', 'utilService'];

app.controller('manageOrderCtrl', manageOrderCtrl);
