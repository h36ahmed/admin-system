var app = angular.module('lunchSociety');

var editCustomerCtrl = function($scope, $state, $location,
  $stateParams, customerService, paymentPlanService, modalService, utilService, awsService, Upload, $timeout) {

  $scope.customerFormData = {
    image_file: null,
    image: ''
  };

  $scope.customer = {};
  $scope.plans = [];

    $scope.tabview = "pinfo";

  $scope.changeTabview = function(tabview) {
    $scope.tabview = tabview;
  }

  if ($stateParams.id) {
    var promise = modalService.open(
      "status", {}
    );
    paymentPlanService
      .getPaymentPlans()
      .success(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            $scope.plans = data;

            customerService
              .getCustomer({
                id: $stateParams.id
              })
              .success(function(data, status, headers, config) {
                modalService.resolve();
                promise.then(
                  function handleResolve(response) {
                    $scope.customer = data;
                    fillFormData();
                  },
                  function handleReject(error) {
                    console.log('Why is it rejected?');
                  }
                );
              })
              .error(function(data, status, headers, config) {
                resolvePromise(promise, data, 'Error: Customer ID Does Not Exist', true);
              });
          },
          function handleReject(error) {
            console.log('Why is it rejected?');
          }
        );
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Payment Plans Could Not Be Retrieved', true);
      });

  } else {
    $location.path('customers');
  }

  // Edit Form

  $scope.submitEditForm = function(isValid) {
    if (isValid) {
      if ($scope.customerFormData.image_file != null) {
        var filename = $scope.customerFormData.image_file.name;
        var type = $scope.customerFormData.image_file.type;
        var query = {
          filename: filename,
          type: type,
          page: "misc"
        };
        var promise = modalService.open("status", {});
        awsService
          .signInAWS(query)
          .success(function(result) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                editCustomer(result);
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Error: Something Went Wrong With Signing on AWS', false);
          });
      } else {
        editCustomer({
          file_name: $scope.customerFormData.profile_image
        });
      }
    }
  };

  function editCustomer(result) {
    var promise = modalService.open(
      "status", {});

    $scope.customerFormData.id = $stateParams.id;
    $scope.customerFormData.profile_image = result.file_name;
    $scope.customerFormData.payment_plan_id = $scope.customerFormData.payment_plan.id;
    $scope.customerFormData.meals_remaining = parseInt($scope.customerFormData.meals_remaining);

    customerService
      .editCustomer($scope.customerFormData)
      .success(function(data, status, headers, config) {
        var customerData = data;
        if ($scope.customerFormData.image_file != null) {
          result.fields.file = $scope.customerFormData.image_file;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.customerFormData.image_file.name + 'is uploaded successfully. Response: ' + data);
            resolvePromise(promise, customerData, 'Customer Updated!', false);
          }).error(function() {
            resolvePromise(promise, customerData, 'Error: Customer Updated But Something Went Wrong With Uploading Image', false);
          });
        } else {
          resolvePromise(promise, customerData, 'Customer Updated!', false);
        }
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong With Updating Customer in Database', false);
      });
  }

  function fillFormData() {
    $scope.customerFormData.first_name = $scope.customer.first_name;
    $scope.customerFormData.last_name = $scope.customer.last_name;
    $scope.customerFormData.postal_code = $scope.customer.postal_code;
    $scope.customerFormData.profile_image = $scope.customer.profile_image;
    $scope.customerFormData.payment_plan = $scope.plans[$scope.customer.payment_plan_id - 1];
    $scope.customerFormData.meals_remaining = $scope.customer.meals_remaining;
    $scope.customerFormData.cycle_start_date = utilService.formatLongDate(new Date($scope.customer.cycle_start_date.slice(0,10)));
    $scope.customerFormData.cycle_end_date = utilService.formatLongDate(new Date($scope.customer.cycle_end_date.slice(0,10)));
    $scope.customerFormData.status = $scope.customer.status == 'active';
    $scope.customerFormData.reminder_emails = $scope.customer.reminder_emails == 'active';
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
            $location.path('customers');
          }
        }, function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }
};

editCustomerCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'customerService', 'paymentPlanService',  'modalService', 'utilService', 'awsService', 'Upload', '$timeout'];

app.controller('editCustomerCtrl', editCustomerCtrl);
