var app = angular.module('lunchSociety');

var createPaymentPlanCtrl = function($scope, $window, $location, paymentPlanService, modalService, awsService, Upload, $timeout) {

  $scope.paymentPlanFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
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
              createPlan(result);
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        })
        .error(function(data, status, headers, config) {
          error(promise, data, 'Error: Something Went Wrong With Signing on AWS');
        });
    }
  };

  function createPlan(result) {
    var promise = modalService.open(
      "status", {}
    );
    $scope.paymentPlanFormData.image = result.file_name;
    paymentPlanService
      .createPaymentPlan($scope.paymentPlanFormData)
      .success(function(data, status, headers, config) {
        var planData = data;
        result.fields.file = $scope.paymentPlanFormData.image_file;
        Upload.upload({
          url: result.url, //s3Url
          data: result.fields,
          method: 'POST'
        }).progress(function(evt) {
          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          console.log('file ' + $scope.paymentPlanFormData.image_file.name + 'is uploaded successfully. Response: ' + data);
          success(promise, planData);
        }).error(function(data) {
          error(promise, data, 'Error: Payment Plan Created But Something Went Wrong With Uploading Image');
        });
      })
      .error(function(data, status, headers, config) {
        error(promise, data, 'Error: Something Went Wrong');
      });
  }

  function success(promise, data) {
    modalService.resolve();
    promise.then(
      function handleResolve(response) {
        promise = modalService.open(
          "alert", {
            message: 'Payment Plan Added!'
          }
        );
        promise.then(function handleResolve(response) {},
          function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }

  function error(promise, data, message) {
    modalService.resolve();
    promise.then(
      function handleResolve(response) {
        promise = modalService.open(
          "alert", {
            message: message
          }
        );
        promise.then(function handleResolve(response) {},
          function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }

};

createPaymentPlanCtrl.inject = ['$scope', '$window', '$location', 'paymentPlanService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('createPaymentPlanCtrl', createPaymentPlanCtrl);
