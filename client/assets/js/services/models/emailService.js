var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "emailService",
    function( $http, $q ) {

        // Return public API.
        return({
            sendOrders: sendOrders
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function sendOrders() {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + "sendROEmail",
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
