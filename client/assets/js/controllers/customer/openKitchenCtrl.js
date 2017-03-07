var app = angular.module('lunchSociety');

var openKitchenCtrl = function($scope, $state, $location, $stateParams, uiGmapGoogleMapApi) {

  $scope.map = {
    center: {
      latitude: 43.6532,
      longitude: -79.3832
    },
    zoom: 14
  };

  uiGmapGoogleMapApi.then(function(maps) {

  });

};

openKitchenCtrl.inject = ['$scope', '$state', '$location', '$stateParams', 'uiGmapGoogleMapApi'];

app.controller('openKitchenCtrl', openKitchenCtrl);
