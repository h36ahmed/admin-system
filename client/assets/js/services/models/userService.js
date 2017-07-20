var app = angular.module('lunchSociety');

var baseUrl = 'https://api.lunchsociety.ca';

var baseApi = '/api/v1/';

app.service(
  "userService",
  function($http, $q) {
    // Return public API.
    return ({
      createUser: createUser,
      getUsers: getUsers,
      getUser: getUser,
      editUser: editUser,
      deleteUser: deleteUser,
      authenticateUser: authenticateUser,
      forgotPassword: forgotPassword
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
        headers: {
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
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return request;
    }

    function getUser(data) {
      var request = $http({
        method: "get",
        url: baseUrl + baseApi + 'users' + "/" + data.id,
        data: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return request;
    }

    function editUser(data) {
      var request = $http({
        method: "put",
        url: baseUrl + baseApi + "user" + "/" + data.id,
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return request;
    }

    function deleteUser(id) {
      var request = $http({
        method: "delete",
        url: baseUrl + baseApi + "user",
        params: {
          action: "delete"
        },
        data: {
          id: id
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return request;
    }

    function authenticateUser(data) {
      var request = $http({
        method: "post",
        url: baseUrl + baseApi + "user" + "/" + "authenticate",
        data: data,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return request
    }

    function forgotPassword(data) {
      var request = $http({
        method: "post",
        url: baseUrl + baseApi + "user" + "/" + "forgotPassword",
        data: data,
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return request
    }
  }
);
