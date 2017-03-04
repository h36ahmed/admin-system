var app = angular.module('lunchSociety');

var createOwnerCtrl = function($scope, $location, userService, ownerService, modalService, awsService, Upload, $timeout, _) {

  $scope.createOwnerFormData = {
      profile_image_file: null
  };

  $scope.owners = [];

  userService
    .getUsers({
      type: "owner",
      owner_list: true
    })
    .success(function(data, status, headers, config) {
      $scope.owners = data;
      $scope.createOwnerFormData.user = $scope.owners[0];
    })
    .error(function(data, status, headers, config) {
      // Handle login errors here
      $scope.message = 'Error: Something Went Wrong';
    });

  $scope.submitForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {

      if ($scope.createOwnerFormData.profile_image_file != null) {
        var filename = $scope.createOwnerFormData.profile_image_file.name;
        var type = $scope.createOwnerFormData.profile_image_file.type;
        var query = {
          filename: filename,
          type: type,
          page: "users"
        };
        var promise = modalService.open("status", {});
        awsService
          .signInAWS(query)
          .success(function(result) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                createOwner(result);
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            error(promise, data, 'Error: Something Went Wrong With Signing on AWS');
          });
      } else {
        createOwner({
          file_name: ''
        });
      }
    }
  };

  function createOwner(result) {

    var promise = modalService.open(
      "status", {}
    );

    $scope.createOwnerFormData.user_id = $scope.createOwnerFormData.user.id;
    $scope.createOwnerFormData.profile_image = result.file_name;

    ownerService
      .createOwner($scope.createOwnerFormData)
      .success(function(data, status, headers, config) {
        var ownerData = data;

        if ($scope.createOwnerFormData.profile_image_file != null) {
          result.fields.file = $scope.createOwnerFormData.profile_image_file;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.createOwnerFormData.profile_image_file.name + 'is uploaded successfully. Response: ' + data);
            success(promise, ownerData);
          }).error(function() {
            error(promise, data, 'Error: Something Went Wrong With Uploading');
          });
        } else {
          success(promise, ownerData);
        }

      })
      .error(function(data, status, headers, config) {
        error(promise, data, 'Error: Something Went Wrong With Creating Owner in Database');
      });
  }

  function success(promise, data) {
    modalService.resolve();
    promise.then(
      function handleResolve(response) {
        promise = modalService.open(
          "alert", {
            message: 'Owner Created'
          }
        );
        promise.then(function handleResolve(response) {
          $location.path('create-restaurant');
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

createOwnerCtrl.inject = ['$scope', '$location', 'userService', 'ownerService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('createOwnerCtrl', createOwnerCtrl);
