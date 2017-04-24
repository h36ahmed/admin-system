var app = angular.module('lunchSociety');

app.directive('lsRating', ratingDirective);

function ratingDirective() {

    var directive = {};
    directive.restrict = 'AE';

    directive.scope = {
        value: '=value',
        max: '=max'
    };

    directive.templateUrl = "templates/directives/rating.html";

    directive.link = function (scope, elements, attr) {

        scope.updateStars = function () {
            var idx = 0;
            scope.stars = [];
            for (idx = 0; idx < scope.max; idx += 1) {
                scope.stars.push({
                    full: scope.value > idx
                });
            }
        };

        scope.hover = function ( /** Integer */ idx) {
            scope.hoverIdx = idx;
        };

        scope.stopHover = function () {
            scope.hoverIdx = -1;
        };

        scope.starColor = function ( /** Integer */ idx) {
            var starClass = 'ls-rating-normal';
            if (idx <= scope.hoverIdx) {
                starClass = 'ls-rating-highlight';
            }
            return starClass;
        };

        scope.starClass = function ( /** Star */ star, /** Integer */ idx) {
            var starClass = 'fa-star-o';
            if (star.full || idx <= scope.hoverIdx) {
                starClass = 'fa-star';
            }
            return starClass;
        };

        scope.setRating = function (idx) {
            scope.value = idx + 1;
            scope.stopHover();
        };

        scope.$watch('value', function (newValue, oldValue) {
            if (newValue !== null && newValue !== undefined) {
                scope.updateStars();
            }
        });
    };

    return directive;
}
