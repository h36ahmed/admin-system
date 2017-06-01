var app = angular.module('lunchSociety');

var homeCtrl = function ($scope, $location, commonService, modalService, $window) {

    $window.sessionStorage.loginPage = true;
    $scope.userFormData = {};

    $scope.submitForm = function (isValid) {
        delete $window.sessionStorage.loginPage;
        // check to make sure the form is completely valid
        if (isValid) {
            var promise = modalService.open(
                "status", {}
            );
            commonService
                .loginUser($scope.userFormData)
                .success(function (data, status, headers, config) {
                    modalService.resolve();
                    promise.then(
                        function handleResolve(response) {
                            commonService.setAuthToken(data.token);
                            commonService.setUserID(data.user_id);
                            if (data.type == "customer") {
                                commonService.setCustomerID(data.customer_id);
                                $location.path('browse');
                            }
                            if (data.type == "restaurant") {
                                commonService.setOwnerID(data.owner_id);
                                commonService.setRestaurantID(data.restaurant_id);
                                $location.path('/restaurant/orders');
                            }
                            if (data.type == "admin") {
                                $location.path('/restaurant/meal-offers');
                            }
                        },
                        function handleReject(error) {
                            console.log('Why is it rejected?');
                        }
                    );

                })
                .error(function (data, status, headers, config) {
                    modalService.resolve();
                    promise.then(
                        function handleResolve(response) {
                            commonService.deleteAuthToken();
                            promise = modalService.open(
                                "alert", {
                                    message: 'Error: Invalid user or password'
                                }
                            );
                            promise.then(function handleResolve(response) {
                                console.log("Alert resolved.");
                                $window.sessionStorage.loginPage = true;
                            }, function handleReject(error) {
                                console.warn("Alert rejected!");
                            });
                        },
                        function handleReject(error) {
                            console.log('Why is it rejected?');
                        }
                    );
                });
        }
    };

};

homeCtrl.inject = ['$scope', '$location', 'commonService', 'modalService', '$window'];

app.controller('homeCtrl', homeCtrl);
