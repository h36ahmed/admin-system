var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "invoiceService",
    function( $http, $q ) {
        // Return public API.
        return({
            getInvoices: getInvoices
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function getInvoices(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "invoices",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
