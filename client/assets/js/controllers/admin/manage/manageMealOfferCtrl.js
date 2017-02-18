var app = angular.module('lunchSociety');

var manageMealOfferCtrl = function($scope, mealOfferService, modalService) {

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
        offer_date: formatDate(date)
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

manageMealOfferCtrl.inject = ['$scope', 'mealOfferService', 'modalService'];

app.controller('manageMealOfferCtrl', manageMealOfferCtrl);
