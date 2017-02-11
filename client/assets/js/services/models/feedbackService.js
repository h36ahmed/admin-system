var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "feedbackService",
    function( $http, $q ) {
        // Return public API.
        return({
            getFeedbacks: getFeedbacks
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function getFeedbacks(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "feedbacks",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
