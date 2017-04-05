var app = angular.module('lunchSociety');


app.factory(
  "utilService",
  function() {

    var utilService = {};

    // ---
    // PUBLIC METHODS.
    // ---
    utilService.getNextDate = function() {
      var tomorrow = new Date();
      tomorrow.setDate(today.getUTCDate()+1);
      return getNextDate;
    };

    utilService.formatDate = function(date) {
      var dd = date.getUTCDate();
      var mm = date.getUTCMonth() + 1; //January is 0!

      var yyyy = date.getUTCFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      return yyyy + "-" + mm + "-" + dd;
    };

    utilService.formatLongDate = function(date) {

      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = date.getUTCDate();
      var monthIndex = date.getUTCMonth();
      var year = date.getUTCFullYear();

      return day + ' ' + monthNames[monthIndex] + ', ' + year;

    }

    return utilService;

  }
);
