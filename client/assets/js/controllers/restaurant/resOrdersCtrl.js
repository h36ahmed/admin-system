var app = angular.module('lunchSociety');

var resOrdersCtrl = function ($scope, $location, mealOfferService, modalService, utilService) {

  $scope.offers = [];

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
    options.order_date = utilService.formatDate(options.order_date);
    var promise = modalService.open(
      "status", {}
    );
    mealOfferService
      .getMealOffers(options)
      .success(function(data, status, headers, config) {
        console.log(data)
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

resOrdersCtrl.inject = ['$scope', '$location', 'mealOfferService', 'modalService', 'utilService'];

app.controller('resOrdersCtrl', resOrdersCtrl);
