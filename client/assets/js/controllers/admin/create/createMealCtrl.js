var app = angular.module('lunchSociety');

var createMealCtrl = function($scope, $location, restaurantService, mealService, modalService, Upload, $timeout, _) {

  $scope.createMealFormData = {};

  $scope.restaurants = [];

  restaurantService
    .getRestaurants()
    .success(function(data, status, headers, config) {
      $scope.restaurants = data;
      if ($location.search().id) {
        // Have option been selected to the restaurant who just got added
        $scope.createMealFormData.restaurant = $scope.restaurants[0];
      } else {
        $scope.createMealFormData.restaurant = $scope.restaurants[0];
      }

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      if (files.length > 0) {
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          filename: filename,
          type: type
        };
        awsService
          .signInAWS(query)
          .success(function(result) {
            createMeal(result)
          })
          .error(function(data, status, headers, config) {
            promise = modalService.open(
              "alert", {
                message: 'Error: Something Went Wrong With Signing on AWS'
              }
            );
            promise.then(function handleResolve(response) {},
              function handleReject(error) {});
        });
      } else {
          createMeal({fileName: null});
      }
    }
  };

  function createMeal(result) {
    var promise = modalService.open(
      "status", {}
    );
    $scope.createMealFormData.restaurant_id = $scope.createMealFormData.restaurant.id;
    $scope.createMealFormData.meal_image = result.fileName;
    mealService
      .createMeal($scope.createMealFormData)
      .success(function(data, status, headers, config) {
        modalService.resolve();
        promise.then(
          function handleResolve(response) {
            promise = modalService.open(
              "alert", {
                message: 'Meal Created'
              }
            );
            promise.then(function handleResolve(response) {
              if (files.length > 0) {
                uploadFile(result);
              }
            }, function handleReject(error) {});
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
                message: 'Error: Something Went Wrong With Creating Meal in Database'
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

  function uploadFile(result) {
    Upload.upload({
      url: result.url, //s3Url
      transformRequest: function(data, headersGetter) {
        var headers = headersGetter();
        delete headers.Authorization;
        return data;
      },
      fields: result.fields, //credentials
      method: 'POST',
      file: files[0]
    }).progress(function(evt) {
      console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
    }).success(function(data, status, headers, config) {
      // file is uploaded successfully
      console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
    }).error(function() {
        promise = modalService.open(
          "alert", {
            message: 'Error: Something Went Wrong With Uploading'
          }
        );
        promise.then(function handleResolve(response) {},
          function handleReject(error) {});
    });
  }

};

createMealCtrl.inject = ['$scope', '$location', 'restaurantService', 'mealService', 'modalService', 'Upload', '$timeout'];

app.controller('createMealCtrl', createMealCtrl);
