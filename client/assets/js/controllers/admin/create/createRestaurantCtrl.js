var app = angular.module('lunchSociety');

var createRestaurantCtrl = function($scope, $location, ownerService, restaurantService, modalService, awsService, Upload, $timeout, _) {

  $scope.createRestaurantFormData = {};

  $scope.owners = [];

  ownerService
    .getOwners({
      no_restaurant_list: true
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      if ($location.search().id) {
        // Have option been selected to the owner who just got added
        // Have the option display as $scope.owners[i].last_name + ' - ' + $scope.owners[i].email
        $scope.createRestaurantFormData.owner = $scope.owners[0];
      } else {
        $scope.createRestaurantFormData.owner = $scope.owners[0];
      }

    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });


  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      var filename = $scope.createRestaurantFormData.logo_image.name;
      var type = $scope.createRestaurantFormData.logo_image.type;
      var query = {
        filename: filename,
        type: type,
        page: "restaurants"
      };
      var promise = modalService.open("status", {});
      awsService
        .signInAWS(query)
        .success(function(result) {
          modalService.resolve();
          promise.then(
            function handleResolve(response) {
              createRestaurant(result);
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

  function createRestaurant(result) {
    var promise = modalService.open(
      "status", {}
    );
    $scope.createRestaurantFormData.owner_id = $scope.createRestaurantFormData.owner.id;
    $scope.createRestaurantFormData.phone_number = parseInt($scope.createRestaurantFormData.phone_number);
    $scope.createRestaurantFormData.logo = result.file_name;

    restaurantService
      .createRestaurant($scope.createRestaurantFormData)
      .success(function(data, status, headers, config) {
        var resData = data;
        result.fields.file = $scope.createRestaurantFormData.logo_image;
        Upload.upload({
          url: result.url, //s3Url
          data: result.fields,
          method: 'POST'
        }).progress(function(evt) {
          console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          console.log('file ' + $scope.createRestaurantFormData.logo_image.name + 'is uploaded successfully. Response: ' + data);
          success(promise, resData);
        }).error(function(data) {
          error(promise, data, 'Error: Restaurant Created But Something Went Wrong With Uploading Image');
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
            message: 'Restaurant Created'
          }
        );
        promise.then(function handleResolve(response) {
           $location.path('create-meal');
        }, function handleReject(error) {});
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

createRestaurantCtrl.inject = ['$scope', '$location', 'ownerService', 'restaurantService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('createRestaurantCtrl', createRestaurantCtrl);
