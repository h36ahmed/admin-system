var app = angular.module('lunchSociety');

var createFeedbackCtrl = function ($scope, $location, $stateParams, orderService,commonService, feedbackService, customerService, userService, modalService) {

    $scope.tabview = "description";

    $scope.changeTabview = function (tabview) {
        $scope.tabview = tabview;
    }

    $scope.order = {};

    $scope.feedbackFormData = {
        flavour: 0,
        portion: 0,
        overall: 0,
        comments: '',
    };

    orderService
        .getOrder({
            id: $stateParams.id
        })
        .success((data, status, headers, config) => {
            $scope.order = data;
            $scope.feedbackFormData.order_id = parseInt($stateParams.id, 10)
            $scope.feedbackFormData.email = data.customer.user.email
        })
        .error(function (data, status, headers, config) {
            // Handle login errors here
            $scope.message = 'Error: Something Went Wrong';
        });

    $scope.submit = () => {
      let promise = modalService.open(
        "status", {}
      );
      feedbackService
        .createFeedback($scope.feedbackFormData)
          .success((data, status, headers, config) => {
            modalService.resolve();
            promise.then(
              function handleResolve(response){
                  $scope.feedbackFormData = {};
                  promise = modalService.open(
                    "alert", {
                      message: 'Thanks for the feedback! An email will be sent to you shortly'
                    }
                  );
                  promise.then(function handleResolve(response) {
                    commonService.deleteFeedbackID()
                    $location.path('browse')
                  },
                    function handleReject(error){});
              },
              function handleReject(error){
                console.log('Why is it rejected?');
              }
            );
          })
          .error((data, status, headers, config) => {
            modalService.resolve();
            promise.then(
              function handleResolve(response){
                promise = modalService.open(
                  "alert", {
                    message: 'Error: Something Went Wrong'
                  }
                );
                promise.then(function handleResolve(response){},
                  function handleReject (error){});
              },
              function handleReject(error){
                console.log('Why is it rejected?');
              }
            );
          });
    }
};

createFeedbackCtrl.inject = ['$scope', '$location', '$stateParams', 'orderService',  'commonService', 'feedbackService', 'customerService', 'userService', 'modalService'];

app.controller('createFeedbackCtrl', createFeedbackCtrl);
