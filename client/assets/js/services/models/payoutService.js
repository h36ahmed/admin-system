var app = angular.module('lunchSociety');

var baseUrl = 'http://api.lunchsociety.ca/';

var baseApi = '/api/v1/';

app.service(
    "payoutService",
    function( $http, $q ) {

        // Return public API.
        return({
            getPayouts: getPayouts,
            getPayout: getPayout,
            createPayout: createPayout
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function getPayouts(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "payouts",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getPayout(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "payout" + "/" + data.id,
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function createPayout(data) {
             var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'payout',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
