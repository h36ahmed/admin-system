var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "mealService",
    function( $http, $q ) {
        // Return public API.
        return({
            createMeal: createMeal,
            getMeal: getMeal,
            editMeal: editMeal,
            getMeals: getMeals,
            deleteMeal: deleteMeal
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createMeal(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'meal',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getMeals(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "meals",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getMeal(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "meals" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editMeal(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "meal" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteMeal(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "meal" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
