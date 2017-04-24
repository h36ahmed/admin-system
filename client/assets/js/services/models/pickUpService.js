var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "pickUpService",
    function( $http, $q ) {

        // Return public API.
        return({
            getPickUps: getPickUps
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function getPickUps() {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "pickup-times",
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
