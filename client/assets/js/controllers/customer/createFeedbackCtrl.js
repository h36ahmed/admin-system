var app = angular.module('lunchSociety');

var createFeedbackCtrl = function ($scope, $location, orderService, feedbackService, customerService, userService, modalService) {

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
            id: 1
        })
        .success((data, status, headers, config) => {
            $scope.order = data;
            $scope.feedbackFormData.order_id = data.id
            customerService
              .getCustomer({
                id: data.customer_id
              })
              .then(customerData => {
                $scope.feedbackFormData.email = customerData.data.user.email
              })
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
                    $location.path('history')
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

createFeedbackCtrl.inject = ['$scope', '$location', 'orderService', 'feedbackService', 'customerService', 'userService', 'modalService'];

app.controller('createFeedbackCtrl', createFeedbackCtrl);
