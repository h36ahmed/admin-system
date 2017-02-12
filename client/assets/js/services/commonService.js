var app = angular.module('lunchSociety');

var baseUrl = 'https://ls-backend.herokuapp.com';

var baseApi = '/api/v1/';

app.service(
    "commonService",
    function( $http, $q, $window ) {

        // Return public API.
        return({
            loginUser: loginUser,
            getUserID: getUserID,
            setUserID: setUserID,
            setCustomerID: setCustomerID,
            getCustomerID: getCustomerID,
            setOwnerID: setOwnerID,
            getOwnerID: getOwnerID,
            setAuthToken: setAuthToken,
            deleteAuthToken: deleteAuthToken,
            logoutUser: logoutUser
        });

        // ---
        // PUBLIC METHODS.
        // ---


        function setAuthToken(token) {
            $window.sessionStorage.token = token;
        }

        function deleteAuthToken() {
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.userID;
        }

        function setUserID(id) {
            $window.sessionStorage.userID = id;
        }

        function getUserID() {
            return $window.sessionStorage.userID;
        }

        function setCustomerID(id) {
            $window.sessionStorage.customerID = id;
        }

        function getCustomerID() {
            return $window.sessionStorage.customerID;
        }

        function setOwnerID(id) {
            $window.sessionStorage.ownerID = id;
        }

        function getOwnerID() {
            return $window.sessionStorage.ownerID;
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
                    'Content-Type': 'application/json'
                }
            });
            return request;
        }


        function logoutUser() {
            var request = $http({
                method: "delete",
                url: baseUrl + baseApi + "users/login",
                headers : {
                    'Content-Type': 'application/json'
                }
            });

            return request;
        }

    }
);
