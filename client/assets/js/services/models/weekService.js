var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "weekService",
    function( $http, $q ) {

        // Return public API.
        return({
            getWeeks: getWeeks,
            getWeek: getWeek
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function getWeeks(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "weeks",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getWeek(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "week" + "/" + data.id,
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }
    }
);
