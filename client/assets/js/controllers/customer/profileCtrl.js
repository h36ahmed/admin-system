var app = angular.module('lunchSociety');

var profileCtrl = function ($scope, commonService, customerService, modalService) {

    const customer = commonService.getCustomerID()

    $scope.customer = {};

    customerService
        .getCustomer({
            id: customer
        })
        .success(function (data, status, headers, config) {
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
        reminder_emails: $scope.customer.reminder_emails === false ? false : true,
        id: customer,
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
                // setTimeout
              },
                function handleReject(error){});
          },
          function handleReject(error){
            console.log('Why is it rejected?');
          }
        );
        // console.log('data', data)
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

    $scope.passwordChangeModal = () => {
    let promise = modalService.open(
      'status', {}
    )

    modalService.resolve()
    promise.then(function handleResolve(response) {
      promise = modalService.open(
        "password-change", {
          message: 'Change your password'
        }
      )
      promise.then(function handleResolve(response) {
        promise = modalService.open(
          'alert', {
            message: 'Your password has been updated!'
          }
        )
        promise.then(function handleResolve(response){}, function handleReject(error){})
      }, function handleReject(error){})
    }, function handleReject(error) {
      console.log('Why is it rejected?')
    })
  }
};

profileCtrl.inject = ['$scope', 'commonService', 'customerService', 'modalService'];

app.controller('profileCtrl', profileCtrl);
