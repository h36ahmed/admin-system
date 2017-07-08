var app = angular.module('lunchSociety');

var baseUrl = 'http://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "mealOfferService",
    function( $http, $q ) {
        // Return public API.
        return({
            createMealOffer: createMealOffer,
            getMealOffers: getMealOffers,
            getMealOffer: getMealOffer,
            getMealOfferReport: getMealOfferReport,
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

        function getMealOffer(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "offers" + "/" + data.id,
                params: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function getMealOfferReport(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "offers-report",
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
