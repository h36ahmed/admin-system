var app = angular.module('lunchSociety');


app.factory(
  "utilService",
  function() {

    var utilService = {};

    // ---
    // PUBLIC METHODS.
    // ---
    utilService.getNextDate = function(date) {
        var newDate = date;
        return newDate;
    };

    utilService.formatDate = function(date) {
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!

      var yyyy = date.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      return yyyy + "-" + mm + "-" + dd;
    };

    return utilService;

  }
);
