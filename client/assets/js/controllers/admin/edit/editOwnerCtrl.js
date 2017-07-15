var app = angular.module('lunchSociety');

var editOwnerCtrl = function($scope, $state, $location,
  $stateParams, ownerService,
  userService, modalService, awsService, Upload, $timeout, _) {

  $scope.owner = {};
  $scope.editOwnerFormData = {
    profile_image_file: null,
    profile_image: ''
  };
  $scope.owners = [];

  if ($stateParams.id) {
    var promise = modalService.open(
      "status", {}
    );
    userService
      .getUsers({
        type: "owner"
      })
      .success(function(data, status, headers, config) {
        $scope.owners = data;
        ownerService
          .getOwner({
            id: $stateParams.id
          })
          .success(function(data, status, headers, config) {
            modalService.resolve();
            promise.then(
              function handleResolve(response) {
                $scope.owner = data;
                fillFormData();
              },
              function handleReject(error) {
                console.log('Why is it rejected?');
              }
            );
          })
          .error(function(data, status, headers, config) {
            resolvePromise(promise, data, 'Error: Owner ID Does Not Exist', true);
          });
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Could not get list of users', true);
      });
  } else {
    $location.path('owners');
  }

  // Edit Form

  $scope.submitEditForm = function(isValid) {
    // check to make sure the form is completely valid
    if (isValid) {
      if ($scope.editOwnerFormData.profile_image_file != null) {
        var filename = $scope.editOwnerFormData.profile_image_file.name;
        var type = $scope.editOwnerFormData.profile_image_file.type;
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
                editOwner(result);
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
        editOwner({
          file_name: $scope.editOwnerFormData.profile_image
        });
      }
    }
  };

  function fillFormData() {
    $scope.editOwnerFormData.first_name = $scope.owner.first_name;
    $scope.editOwnerFormData.last_name = $scope.owner.last_name;
    $scope.editOwnerFormData.phone_number = parseInt($scope.owner.phone_number);
    $scope.editOwnerFormData.owner = _.findWhere($scope.owners, {
      id: $scope.owner.user_id
    });
    $scope.editOwnerFormData.confirmed_email = $scope.owner.user.confirmed_email;
    $scope.editOwnerFormData.profile_image = $scope.owner.profile_image;
    $scope.editOwnerFormData.status = $scope.owner.status;
  }

  function editOwner(result) {
    var promise = modalService.open(
      "status", {});

    $scope.editOwnerFormData.user_id = parseInt($scope.editOwnerFormData.owner.id);
    $scope.editOwnerFormData.id = $stateParams.id;

    $scope.editOwnerFormData.profile_image = result.file_name;

    ownerService
      .editOwner($scope.editOwnerFormData)
      .success(function(data, status, headers, config) {
        var ownerData = data;

        if ($scope.editOwnerFormData.profile_image_file != null) {
          result.fields.file = $scope.editOwnerFormData.profile_image_file;
          Upload.upload({
            url: result.url, //s3Url
            data: result.fields,
            method: 'POST'
          }).progress(function(evt) {
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            console.log('file ' + $scope.editOwnerFormData.profile_image_file.name + 'is uploaded successfully. Response: ' + data);
            resolvePromise(promise, ownerData, 'Owner Updated!', false);
          }).error(function() {
            resolvePromise(promise, ownerData, 'Error: Owner Updated But Something Went Wrong With Uploading Image', false);
          });
        } else {
          resolvePromise(promise, ownerData, 'Owner Updated!', false);
        }
      })
      .error(function(data, status, headers, config) {
        resolvePromise(promise, data, 'Error: Something Went Wrong With Updating Owner in Database', false);
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
            $location.path('owners');
          }
        }, function handleReject(error) {});
      },
      function handleReject(error) {
        console.log('Why is it rejected?');
      }
    );
  }
};

editOwnerCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'ownerService', 'userService', 'modalService', 'awsService', 'Upload', '$timeout'];

app.controller('editOwnerCtrl', editOwnerCtrl);
