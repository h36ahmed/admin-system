var app = angular.module('lunchSociety');

var profileCtrl = function ($scope, customerService, modalService) {

    $scope.customer = {};

    customerService
        .getCustomer({
            id: 2
        })
        .success(function (data, status, headers, config) {
            console.log('get customer data', data)
            $scope.customer = data;
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });

      $scope.submitEditForm = () => {
      let promise = modalService.open(
        "status", {}
      );
      customerService
        .editCustomer({
          id: 2,
          // i'm confused as to how this part actually works
          // reminder_emails: !$scope.customer.reminder_emails,
          reminder_emails: $scope.customer.reminder_emails === false ? false : true
        })
        .success(function (data, status, headers, config) {
          $scope.customer = data
          modalService.resolve();
          promise.then(
            function handleResolve(response){
                promise = modalService.open(
                  "alert", {
                    message: $scope.customer.reminder_emails === false ?
                              'You will not be sent a reminder email!' :
                              'You will be sent a reminder email!'
                  }
                );
                promise.then(function handleResolve(response) {
                  setTimeout
                },
                  function handleReject(error){});
            },
            function handleReject(error){
              console.log('Why is it rejected?');
            }
          );
          console.log('data', data)
        })
        .error(function (data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response){
              promise = modalService.open(
                "alert", {
                  message: 'Error: Something Went Wrong'
                }
              );
              promise.then(function handleResolve(response){},
                function handleReject (error){});
            },
            function handleReject(error){
              console.log('Why is it rejected?');
            }
          );
        })
    }
};

profileCtrl.inject = ['$scope', 'customerService', 'modalService'];

app.controller('profileCtrl', profileCtrl);
