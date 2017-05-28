var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "paymentService",
    function( $http, $q ) {
        // Return public API.
        return({
            createPayment: createPayment
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function createPayment(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'create-subscription',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
