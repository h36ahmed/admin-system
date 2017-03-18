var app = angular.module('lunchSociety');

var editRestaurantCtrl = function($scope, $state, $location,
  $stateParams, restaurantService,
  ownerService, modalService, awsService, Upload, $timeout, _) {

  $scope.restaurant = {};

  $scope.editRestaurantFormData = {
    logo_file: null,
    logo: ''
  };

  $scope.owners = [];

  if ($stateParams.id) {
    var promise = modalService.open(
      "status", {}
    );
    ownerService
      .getOwners()
      .success(function(data, status, headers, config) {
        $scope.owners = data;
        restaurantService
          .getRestaurant({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                $scope.restaurant = data;
                fillFormData();
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Error: Restaurant ID Does Not Exist', true);
          });
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Could not get list of owners', true);
      });
  } else {
    $location.path('restaurants');
  }



  // Edit Form

  $scope.submitEditForm = function(isValid) {
    if (isValid) {
      if ($scope.editRestaurantFormData.logo_file != null) {
        var filename = $scope.editRestaurantFormData.logo_file.name;
        var type = $scope.editRestaurantFormData.logo_file.type;
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
                editRestaurant(result);
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            error(promise, data, 'Error: Something Went Wrong With Signing on AWS', false);
          });
      } else {
        editRestaurant({
          file_name: $scope.editRestaurantFormData.logo
        });
      }
    }
  };

  function editRestaurant(result) {
    var promise = modalService.open(
      "status", {});

    $scope.editRestaurantFormData.owner_id = parseInt($scope.editRestaurantFormData.owner.id);
    $scope.editRestaurantFormData.phone_number = parseInt($scope.editRestaurantFormData.phone_number);
    $scope.editRestaurantFormData.id = $stateParams.id;

    $scope.editRestaurantFormData.logo = result.file_name;

    restaurantService
      .editRestaurant($scope.editRestaurantFormData)
      .success(function(data, status, headers, config) {
        var resData = data;

        if ($scope.editRestaurantFormData.logo_file != null) {
          result.fields.file = $scope.editRestaurantFormData.logo_file;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.editRestaurantFormData.logo_file.name + 'is uploaded successfully. Response: ' + data);
            resolvePromise(promise, resData, 'Restaurant Updated!', false);
          }).error(function() {
            resolvePromise(promise, resData, 'Error: Restaurant Updated But Something Went Wrong With Uploading Image', false);
          });
        } else {
          resolvePromise(promise, resData, 'Restaurant Updated!', false);
        }
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong With Updating Restaurant in Database', false);
      });
  }

  function fillFormData() {
    $scope.editRestaurantFormData.name = $scope.restaurant.name;
    $scope.editRestaurantFormData.phone_number = parseInt($scope.restaurant.phone_number);
    $scope.editRestaurantFormData.postal_code = $scope.restaurant.postal_code;
    $scope.editRestaurantFormData.owner = _.findWhere($scope.owners, {
      id: $scope.restaurant.owner_id
    });
    $scope.editRestaurantFormData.street_address = $scope.restaurant.street_address;
    $scope.editRestaurantFormData.city = $scope.restaurant.city;
    $scope.editRestaurantFormData.country = $scope.restaurant.country;
    $scope.editRestaurantFormData.state = $scope.restaurant.state;
    $scope.editRestaurantFormData.visible = $scope.restaurant.visible;
    $scope.editRestaurantFormData.logo = $scope.restaurant.logo;
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
            $location.path('restaurants');
          }
        }, function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }
};

editRestaurantCtrl.inject = ['$scope', '$state', ' $location', '$stateParams', 'restaurantService', 'ownerService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('editRestaurantCtrl', editRestaurantCtrl);
