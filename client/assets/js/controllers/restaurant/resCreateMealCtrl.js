var app = angular.module('lunchSociety');

var resCreateMealCtrl = function ($scope, commonService, mealService, modalService, awsService, Upload) {

  var restaurant = commonService.getRestaurantID();

  $scope.createMealFormData = {};

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var filename = $scope.createMealFormData.meal_file_image.name;
      var type = $scope.createMealFormData.meal_file_image.type;
      var query = {
        filename: filename,
        type: type,
        page: "meals",
        file: $scope.createMealFormData.meal_file_image
      };

      var promise = modalService.open("status", {});
      awsService
        .signInAWS(query)
        .success(function(result) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              createMeal(result);
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

  function createMeal(result) {
    var promise = modalService.open(
      "status", {});
    $scope.createMealFormData.restaurant_id = restaurant
    $scope.createMealFormData.tagline = ''
    $scope.createMealFormData.meal_image = result.file_name;
    mealService
      .createMeal($scope.createMealFormData)
      .success(function(data, status, headers, config) {

        result.fields.file = $scope.createMealFormData.meal_file_image;
        Upload.upload({
          url: result.url, //s3Url
          data: result.fields,
          method: 'POST'
        }).progress(function(evt) {
          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          console.log('file ' + $scope.createMealFormData.meal_file_image.name + 'is uploaded successfully. Response: ' + data);
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              promise = modalService.open(
                "alert", {
                  message: 'Meal Created'
                }
              );
              promise.then(function handleResolve(response) {}, function handleReject(error) {});
            },
            function handleReject(error) {
              console.log('Why is it rejected?');
            }
          );
        }).error(function() {
          error(promise, data, 'Error: Meal Created But Something Went Wrong With Uploading Image');
        });
      })
      .error(function(data, status, headers, config) {
        error(promise, data, 'Error: Something Went Wrong With Creating Meal in Database');
      });
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

resCreateMealCtrl.inject = ['$scope', 'commonService', 'mealService', 'modalService', 'awsService', 'Upload'];

app.controller('resCreateMealCtrl', resCreateMealCtrl);
