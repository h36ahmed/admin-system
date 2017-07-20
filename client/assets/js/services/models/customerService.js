var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "customerService",
    function( $http, $q ) {
        // Return public API.
        return({
            createCustomer: createCustomer,
            editCustomer: editCustomer,
            getCustomers: getCustomers,
            getCustomer: getCustomer,
            deleteCustomer: deleteCustomer
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createCustomer(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'customer',
                data: data,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function getCustomers(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "customers",
                params: data,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function getCustomer(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "customers" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function editCustomer(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "customer" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteCustomer(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "customer" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

    }
);
