var app = angular.module('lunchSociety');

var manageMealOfferCtrl = function($scope, mealOfferService, modalService, utilService) {

  $scope.offers = [];

  $scope.today_date = new Date();

  $scope.filterDate = null;

  $scope.currentViewDate = new Date();

  $scope.offerStatus = { inactive: false }

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

  $scope.submitEditForm = (offer, offer_id) => {
    let promise = modalService.open('status', {})
    mealOfferService
      .editMealOffer({ status: offer, id: offer_id})
      .success((data, status, headers, config) => {
        modalService.resolve()
        promise.then(function handleResolve(response) {
          promise = modalService.open(
            'alert', {
              message: `Meal ID #${offer_id} is now ${offer === 'inactive' ? 'inactive' : 'active'}`
            }
          )
          promise.then(function handleResolve(response){}, function handleReject(error){})
        }, function handleReject(error){
          console.log('Why is it rejected?')
        })
      })
  }

  function offerService(date) {
    var promise = modalService.open(
      "status", {}
    );
    mealOfferService
      .getMealOffers({
        offer_date: utilService.formatDate(date)
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

};

manageMealOfferCtrl.inject = ['$scope', 'mealOfferService', 'modalService', 'utilService'];

app.controller('manageMealOfferCtrl', manageMealOfferCtrl);
