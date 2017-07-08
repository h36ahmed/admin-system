var app = angular.module('lunchSociety');

var baseUrl = 'http://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "paymentPlanService",
    function( $http, $q ) {
        // Return public API.
        return({
            createPaymentPlan: createPaymentPlan,
            getPaymentPlan: getPaymentPlan,
            editPaymentPlan: editPaymentPlan,
            getPaymentPlans: getPaymentPlans,
            deletePaymentPlan: deletePaymentPlan
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createPaymentPlan(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'payment-plan',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getPaymentPlans(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "payment-plans",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getPaymentPlan(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "payment-plans" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editPaymentPlan(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "payment-plan" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deletePaymentPlan(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "payment-plan" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
