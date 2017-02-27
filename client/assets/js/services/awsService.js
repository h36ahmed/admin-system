var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "awsService",
    function( $http, $q ) {

        // Return public API.
        return({
            signInAWS: signInAWS
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function signInAWS(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'signing',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
