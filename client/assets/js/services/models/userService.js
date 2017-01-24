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

        var authToken;

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
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        function getUsers() {
            var request = $http({
                method: "get",
                url: baseUrl + baseApi + "users",
                params: {
                    action: "get"
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }


        function removeUser( id ) {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "user",
                params: {
                    action: "delete"
                },
                data: {
                    id: id
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }

        // ---
        // PRIVATE METHODS.
        // ---

        function handleError( response ) {
            if (
                ! angular.isObject( response.data ) ||
                ! response.data.message
                ) {
                return( $q.reject( "An unknown error occurred." ) );
            }
            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess( response ) {
            return( response.data );
        }
    }
);
