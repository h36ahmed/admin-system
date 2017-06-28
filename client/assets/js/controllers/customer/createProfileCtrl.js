var app = angular.module('lunchSociety');

var createProfileCtrl = function ($scope, $stateParams, $location, commonService, paymentPlanService, paymentService, customerService, userService, modalService, utilService) {

    $scope.screenview = "details";

    $scope.customer = {};

    $scope.profileFormData = {
        first_name: '',
        last_name: '',
        email: '',
        postal_code: '',
        plan: ''
    };

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
            var promise = modalService.open(
                "status", {}
            );
            resolvePromise(promise, data, 'Error: Something Went Wrong With Getting Plans', false);
        });

    if ($stateParams.id) {
        userService
            .getUser({
                id: $stateParams.id
            })
            .success(function (data, status, headers, config) {
                $scope.user = data;
                $scope.profileFormData.email = $scope.user.email;
                if (user.confirmed_email == true) {
                    $location.path('browse');
                }
                console.log($scope.customer);
            })
            .error(function (data, status, headers, config) {
                // Handle login errors here
                $scope.message = 'Error: Something Went Wrong';
            });
    } else {
        $location.path('/');
    }

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

    $scope.planSelect = function (plan) {
        $scope.profileFormData.plan = {
            name: plan.name,
            id: plan.id,
            price: plan.price,
            meals: plan.num_meals,
            total_price: plan.price * plan.num_meals * 1.13,
            stripe_id: plan.stripe_id
        };
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
                formData.user_id = $stateParams.id;
                var promise = modalService.open(
                    "status", {}
                );
                console.log(JSON.stringify(formData));
                paymentService
                    .createPayment(formData)
                    .success(function (data, status, headers, config) {
                        modalService.resolve();
                        promise.then(
                            function handleResolve(response) {
                                promise = modalService.open(
                                    "alert", {
                                        message: 'Customer Profile Created and Payment Details Recorded!'
                                    }
                                );
                                promise.then(function handleResolve(response) {
                                    if (data.routeToCreateProfile == false) {
                                        commonService.setCustomerID(data.id);
                                        $location.path('browse');
                                    } else {
                                        promise = modalService.open(
                                            "alert", {
                                                message: 'Customer Profile Was Not Created. Please contact daniel@lunchsociety.ca'
                                            }
                                        );
                                    }
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

createProfileCtrl.inject = ['$scope', '$stateParams', '$location', 'commonService', 'paymentPlanService', 'paymentService', 'customerService', 'modalService', 'utilService'];

app.controller('createProfileCtrl', createProfileCtrl);
