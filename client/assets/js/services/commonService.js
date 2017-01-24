var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "commonService",
    function( $http, $q ) {
        // Return public API.
        return({
            loginUser: loginUser,
            getAuthToken: getAuthToken,
            logoutUser: logoutUser
        });

        var authToken;

        // ---
        // PUBLIC METHODS.
        // ---

        function getAuthToken() {
            return authToken;
        }

        function loginUser(data) {
            var request = $http({
                method: "post",
                url: baseUrl + baseApi + 'users/login',
                data: {
                    email: data.email,
                    password: data.password
                },
                headers : {
                    'Content-Type': 'application/json',
                }
            });
            return( request.then( handleSuccess, handleError ) );
        }


        function logoutUser() {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "users/login",
                headers : {
                    'Content-Type': 'application/json',
                    'Auth': getAuthToken()
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
            console.log(response);
            return( response.data );
        }
    }
);
