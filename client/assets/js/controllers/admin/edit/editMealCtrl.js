var app = angular.module('lunchSociety');

var editMealCtrl = function($scope, $state, $location,
  $stateParams, mealService,
  restaurantService, modalService, awsService, Upload, $timeout, _) {

  $scope.meal = {};
  $scope.editMealFormData = {
    meal_file_image: null
  };
  $scope.restaurants = [];

  if ($stateParams.id) {
    var promise = modalService.open(
      "status", {}
    );
    restaurantService
      .getRestaurants()
      .success(function(data, status, headers, config) {
        $scope.restaurants = data;
        mealService
          .getMeal({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                $scope.meal = data;
                fillFormData();
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Error: Meal ID Does Not Exist', true);
          });
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong', true);
      });
  } else {
    $location.path('meals');
  }

  // Edit Form

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      if ($scope.editMealFormData.meal_file_image != null) {
        var filename = $scope.editMealFormData.meal_file_image.name;
        var type = $scope.editMealFormData.meal_file_image.type;
        var query = {
          filename: filename,
          type: type,
          page: "meals"
        };
        var promise = modalService.open("status", {});
        awsService
          .signInAWS(query)
          .success(function(result) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                editMeal(result);
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
        editMeal({
          file_name: $scope.editMealFormData.meal_image
        });
      }
    }
  };

  // Delete Form

  $scope.submitDeleteForm = function() {
    var promise = modalService.open(
      "confirm", {
        message: 'Do you want to delete this meal?',
        confirmButton: "Yes, Please Delete!",
        denyButton: "No, wait!"
      }
    );
    promise.then(
      function handleResolve(response) {
        promise = modalService.open(
          "status", {}
        );

        mealService
          .deleteMeal({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Meal Deleted!', true);
          })
          .error(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Error: Something Went Wrong', false);
          });
      },
      function handleReject(error) {});
  }

  // Functions

  function fillFormData() {
    $scope.editMealFormData.name = $scope.meal.name;
    $scope.editMealFormData.tagline = $scope.meal.tagline;
    $scope.editMealFormData.price = $scope.meal.price;
    $scope.editMealFormData.restaurant = _.findWhere($scope.restaurants, {
      id: $scope.meal.restaurant_id
    });
    $scope.editMealFormData.description = $scope.meal.description;
    $scope.editMealFormData.ingredients = $scope.meal.ingredients;
    $scope.editMealFormData.meal_image = $scope.meal.meal_image;
  }

  function editMeal(result) {
    var promise = modalService.open(
      "status", {});

    $scope.editMealFormData.restaurant_id = $scope.editMealFormData.restaurant.id;
    $scope.editMealFormData.id = $stateParams.id;

    $scope.editMealFormData.meal_image = result.file_name;

    mealService
      .editMeal($scope.editMealFormData)
      .success(function(data, status, headers, config) {
        var mealData = data;

        if ($scope.editMealFormData.meal_file_image != null) {
          result.fields.file = $scope.editMealFormData.meal_file_image;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.editMealFormData.meal_file_image.name + 'is uploaded successfully. Response: ' + data);
            resolvePromise(promise, mealData, 'Meal Updated!', false);
          }).error(function() {
            resolvePromise(promise, mealData, 'Error: Something Went Wrong With Uploading', false);
          });
        } else {
          resolvePromise(promise, mealData, 'Meal Updated!', false);
        }
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong With Updating Meal in Database', false);
      });
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
            $location.path('meals');
          }
        }, function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }
};

editMealCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'mealService', 'restaurantService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('editMealCtrl', editMealCtrl);
