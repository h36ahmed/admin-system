var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "restaurantService",
    function( $http, $q ) {
        // Return public API.
        return({
            createRestaurant: createRestaurant,
            getRestaurants: getRestaurants,
            editRestaurant: editRestaurant,
            getRestaurant: getRestaurant,
            deleteRestaurant: deleteRestaurant
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function createRestaurant(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'restaurant',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getRestaurants(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "restaurants",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getRestaurant(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "restaurants" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editRestaurant(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "restaurant" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteRestaurant(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "restaurant" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }
    }
);
