var app = angular.module('lunchSociety');

var editPaymentPlanCtrl = function($scope, $state, $location,
  $stateParams, paymentPlanService, modalService) {

  $scope.editPaymentPlanFormData = {};

  var promise = modalService.open(
    "status", {}
  );

  if ($stateParams.id) {
    paymentPlanService
      .getPaymentPlan({
        id: $stateParams.id
      })
      .success(function(data, status, headers, config) {
        modalService.resolve();

        promise.then(
          function handleResolve(response) {
            $scope.paymentPlan = data;
            fillFormData();
          },
          function handleReject(error) {
            console.log('Why is it rejected?');
          }
        );
      })
      .error(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Payment Plan ID Does Not Exist'
              }
            );
            promise.then(function handleResolve(response) {
                $location.path('payment-plans');
            },
              function handleReject(error) {});
          },
          function handleReject(error) {
            console.log('Why is it rejected?');
          }
        );
      });
  } else {
    $location.path('payment-plans');
  }


  function fillFormData() {
    $scope.editPaymentPlanFormData.name = $scope.paymentPlan.name;
    $scope.editPaymentPlanFormData.price = $scope.paymentPlan.price;
    $scope.editPaymentPlanFormData.description = $scope.paymentPlan.description;
  }

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      promise = modalService.open(
        "status", {}
      );
      $scope.editPaymentPlanFormData.id = $stateParams.id;
      paymentPlanService
        .editPaymentPlan($scope.editPaymentPlanFormData)
        .success(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Payment Plan Updated!'
                }
              );
              promise.then(function handleResolve(response) {},
                function handleReject(error) {});
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        })
        .error(function(data, status, headers, config) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Error: Something Went Wrong'
                }
              );
              promise.then(function handleResolve(response) {},
                function handleReject(error) {});
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        });
    }
  };

  $scope.submitDeleteForm = function() {
    promise = modalService.open(
      "confirm", {
        message: 'Do you want to delete this payment plan?',
        confirmButton: "Yes, Please Delete!",
        denyButton: "No, wait!"
      }
    );
    promise.then(
      function handleResolve(response) {
        paymentPlanService
          .deletePaymentPlan({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Payment Plan Deleted!'
              }
            );
            promise.then(function handleResolve(response) {
                $location.path('payment-plans');
              },
              function handleReject(error) {});

          })
          .error(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Went Wrong'
              }
            );
            promise.then(function handleResolve(response) {},
              function handleReject(error) {});
          });
      },
      function handleReject(error) {

      });
  }
};

editPaymentPlanCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'paymentPlanService', 'restaurantService', 'modalService'];

app.controller('editPaymentPlanCtrl', editPaymentPlanCtrl);
