var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
    "ownerService",
    function( $http, $q ) {
        // Return public API.
        return({
            createOwner: createOwner,
            editOwner: editOwner,
            getOwners: getOwners,
            getOwner: getOwner,
            deleteOwner: deleteOwner
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function createOwner(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'owner',
                data: data,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function getOwners(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "owners",
                params: data,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function getOwner(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "owners" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function editOwner(data) {
            var request = $http({
                method: "put",
                url: baseUrl + baseApi + "owner" + "/" + data.id,
                data: data,
                headers : {
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }

        function deleteOwner(data) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "owner" + "/" + data.id,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

    }
);
