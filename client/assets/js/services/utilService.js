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
      tomorrow.setDate(tomorrow.getUTCDate()+1);
      return tomorrow;
    };

    utilService.formatDate = function(date, type = null) {
      var dd = date.getUTCDate();
      var mm = date.getUTCMonth() + 1; //January is 0!

      var yyyy = date.getUTCFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      return type === 'browse' ? yyyy + "-" + mm + "-" + parseInt(dd+1) : yyyy + "-" + mm + "-" + dd;
      // return yyyy + "-" + mm + "-" + dd;
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

      return monthNames[monthIndex] + ' ' + day + ', ' + year;

    }

    return utilService;

  }
);
