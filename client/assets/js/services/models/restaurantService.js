var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "restaurantService",
    function( $http, $q ) {
        // Return public API.
        return({
            createRestaurant: createRestaurant,
            getRestaurants: getRestaurants,
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


        function deleteRestaurant( id ) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "restaurant",
                params: {
                    action: "delete"
                },
                data: {
                    id: id
                },
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }
    }
);
