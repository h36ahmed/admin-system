var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "userService",
    function( $http, $q ) {
        // Return public API.
        return({
            createUser: createUser,
            getUsers: getUsers,
            deleteUser: deleteUser
        });

        // ---
        // PUBLIC METHODS.
        // ---

        function createUser(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'user',
                data: {
                    email: data.email,
                    password: data.password,
                    type: data.type
                },
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }

        function getUsers(data) {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "users",
                params: data,
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }


        function deleteUser( id ) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "user",
                params: {
                    action: "delete"
                },
                data: {
                    id: id
                },
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return request;
        }
    }
);