var app = angular.module('lunchSociety');

var createProfileCtrl = function ($scope, paymentPlanService, customerService, modalService) {

    $scope.screenview = "details";

    $scope.screens = [{
        name: "details",
        label: 'Personal Details',
        completed: false
      }, {
        name: "plans",
        label: 'Meal Plans',
        completed: false
      }, {
        name: "payment",
        label: 'Payment',
        completed: false
      }];

    $scope.prevScreen = null;
    $scope.nextScreen = $scope.screens[1].name;

    $scope.calcWidth = function (index) {
        var width = (index / ($scope.screens.length - 1)) * 100;
        return width.toString() + "%";
    }

    $scope.barComplete = {
        width: '0%'
    };

    $scope.plans = [];

    paymentPlanService
        .getPaymentPlans()
        .success(function (data, status, headers, config) {
            $scope.plans = data;
        })
        .error(function (data, status, headers, config) {
            var promise =  modalService.open(
                "status", {}
            );
            resolvePromise(promise, data, 'Error: Something Went Wrong With Getting Plans', false);
        });

    $scope.changeScreenView = function (screenview) {
        $scope.screenview = screenview;
        $scope.activeScreen = screenview;
        var checkIndex = {
            name: screenview
        };
        var index = _.findIndex($scope.screens, checkIndex);
        $scope.barComplete.width = $scope.calcWidth(index);
        if (index == 0) {
            $scope.prevScreen = null;
            $scope.screens[index + 1].completed = false;
            $scope.nextScreen = $scope.screens[index + 1].name;
        } else if (index == ($scope.screens.length - 1)) {
            $scope.prevScreen = $scope.screens[index - 1].name;
            $scope.screens[index - 1].completed = true;
            $scope.nextScreen = null;
        } else {
            $scope.prevScreen = $scope.screens[index - 1].name;
            $scope.screens[index - 1].completed = true;
            $scope.screens[index + 1].completed = false;
            $scope.nextScreen = $scope.screens[index + 1].name;
        }
    }

    $scope.activeScreen = $scope.screens[0].name;

    $scope.profileFormData = {
        first_name: '',
        last_name: '',
        email: '',
        postal_code: '',
        plan: ''
    };

    $scope.stripeCallback = function (code, result) {
        var formData = $scope.profileFormData;

        if (formData.first_name == '' || formData.last_name == '' ||
            formData.email == '' || formData.postal_code == '' || formData.plan == '') {
            var promise = modalService.open(
                "alert", {
                    message: 'Please Ensure You have filled out all fields and selected the plan!'
                }
            );
        } else {
            if (result.error) {
                var promise = modalService.open(
                    "alert", {
                        message: 'It failed! error: ' + result.error.message
                    }
                );
            } else {
                formData.stripe_token = result.id;
                var promise = modalService.open(
                    "status", {}
                );
                paymentService
                    .createProfile(formData)
                    .success(function (data, status, headers, config) {
                        modalService.resolve();
                        promise.then(
                            function handleResolve(response) {
                                promise = modalService.open(
                                    "alert", {
                                        message: 'Customer Profile Created. Please Login!'
                                    }
                                );
                                promise.then(function handleResolve(response) {

                                    },
                                    function handleReject(error) {

                                    });
                            },
                            function handleReject(error) {
                                console.log('Why is it rejected?');
                            }
                        );
                    })
                    .error(function (data, status, headers, config) {
                        resolvePromise(promise, data, 'Error: Something Went Wrong With Creating Profile', false);
                    });
            }
        }

    };

    $scope.planSelect = function (id, name, price, meals) {
        $scope.profileFormData.plan = {
            name: name,
            id: id,
            price: price,
            meals: meals
        };
    };

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
                        $location.path('/');
                    }
                }, function handleReject(error) {});
            },
            function handleReject(error) {
                console.log('Why is it rejected?');
            }
        );
    }

};

createProfileCtrl.inject = ['$scope', 'paymentPlanService', 'customerService', 'modalService'];

app.controller('createProfileCtrl', createProfileCtrl);
