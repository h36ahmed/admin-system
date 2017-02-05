var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "orderService",
    function( $http, $q ) {
        // Return public API.
        return({
            createOrder: createOrder,
            editOrder: editOrder,
            getOrders: getOrders,
            deleteOrder: deleteOrder
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createOrder(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'order',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getOrders(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "orders",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editOrder() {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "order",
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteOrder() {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "order",
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);