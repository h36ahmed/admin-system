var app = angular.module('lunchSociety');

var baseUrl = 'http://api.lunchsociety.ca/';
// var baseUrl = 'localhost:3000'

var baseApi = '/api/v1/';

app.service(
    "feedbackService",
    function( $http, $q ) {
        // Return public API.
        return({
            getFeedbacks: getFeedbacks,
            createFeedback: createFeedback
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

        function createFeedback(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'feedback',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }
        return feedbackService
    }
);
