var app = angular.module('lunchSociety');

var editPaymentPlanCtrl = function($scope, $state, $location,
  $stateParams, paymentPlanService, modalService, awsService, Upload, $timeout) {

  $scope.paymentPlanFormData = {
    image_file: null,
    image: ''
  };

  if ($stateParams.id) {
    var promise = modalService.open(
      "status", {}
    );
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
        resolvePromise(promise, data, 'Error: Payment Plan ID Does Not Exist', true);
      });
  } else {
    $location.path('payment-plans');
  }


  // Edit Form

  $scope.submitEditForm = function(isValid) {
    if (isValid) {
      if ($scope.paymentPlanFormData.image_file != null) {
        var filename = $scope.paymentPlanFormData.image_file.name;
        var type = $scope.paymentPlanFormData.image_file.type;
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
                editPlan(result);
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
        editPlan({
          file_name: $scope.paymentPlanFormData.image
        });
      }
    }
  };

  function editPlan(result) {
    var promise = modalService.open(
      "status", {});

    $scope.paymentPlanFormData.id = $stateParams.id;
    $scope.paymentPlanFormData.image = result.file_name;

    paymentPlanService
      .editPaymentPlan($scope.paymentPlanFormData)
      .success(function(data, status, headers, config) {
        var planData = data;

        if ($scope.paymentPlanFormData.image_file != null) {
          result.fields.file = $scope.paymentPlanFormData.image_file;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.paymentPlanFormData.image_file.name + 'is uploaded successfully. Response: ' + data);
            resolvePromise(promise, planData, 'Payment Plan Updated!', false);
          }).error(function() {
            resolvePromise(promise, planData, 'Error: Payment Plan Updated But Something Went Wrong With Uploading Image', false);
          });
        } else {
          resolvePromise(promise, planData, 'Payment Plan Updated!', false);
        }
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong With Updating Payment Plan in Database', false);
      });
  }

  function fillFormData() {
    $scope.paymentPlanFormData.name = $scope.paymentPlan.name;
    $scope.paymentPlanFormData.price = $scope.paymentPlan.price;
    $scope.paymentPlanFormData.description = $scope.paymentPlan.description;
    $scope.paymentPlanFormData.image = $scope.paymentPlan.image;
    $scope.paymentPlanFormData.num_meals = $scope.paymentPlan.num_meals;
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
            $location.path('payment-plans');
          }
        }, function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }
};

editPaymentPlanCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'paymentPlanService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('editPaymentPlanCtrl', editPaymentPlanCtrl);
