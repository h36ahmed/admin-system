var jquery = angular.module('jquery', []);
jquery.factory('$', ['$window', function($window) {
  return $window.$;
}]);
