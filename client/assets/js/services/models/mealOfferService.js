var app = angular.module('lunchSociety');

// var baseUrl = 'https://ls-backend.herokuapp.com';
var baseUrl = 'localhost:3000'

var baseApi = '/api/v1/';

app.service(
    "mealOfferService",
    function( $http, $q ) {
        // Return public API.
        return({
            createMealOffer: createMealOffer,
            getMealOffers: getMealOffers,
            deleteMealOffer: deleteMealOffer,
            editMealOffer: editMealOffer,
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createMealOffer(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'offer',
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getMealOffers(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "offers",
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteMealOffer(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "offer" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editMealOffer(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "offer" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

    }
);
