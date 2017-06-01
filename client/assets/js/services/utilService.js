var app = angular.module('lunchSociety');


app.factory(
  "utilService",
  function($http, $q, $window, $location) {

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
      console.log(dd)
      console.log(mm)
      var yyyy = date.getUTCFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      return type === 'browse' ? yyyy + "-" + mm + "-" + parseInt(dd+1) : yyyy + "-" + mm + "-" + dd;
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

    utilService.formatShortDate = (date) => {
      return date.split('T')[0]
    }

    utilService.formatDateWithTimezone = (date) => {
      let day = date.getUTCDate()
      let month = date.getUTCMonth() + 1
      const year = date.getUTCFullYear()

      if (day < 10) {
        day = `0${day}`
      }

      if (month < 10) {
        month = `0${month}`
      }

      return `${year}-${month}-${day}T00:00:00.000Z`
    }

    utilService.sortByDate = (a,b) => {
      let type = ''
      if (a.hasOwnProperty('order_date') || b.hasOwnProperty('order_date')) {
        type = 'order_date'
      } else {
        type = 'offer_date'
      }

      if (a[type] > b[type]) {
        return -1
      }
      if (a[type] < b[type]) {
        return 1
      }
      return 0
    }

    utilService.isKitchenOpen = () => {
      // checks the current hour only and will redirect depending on the hour

      // const hour = new Date(1495051243414).getHours() // this is for dev purpose to keep kitchen closed
      const hour = new Date(1495062343414).getHours() // this is for dev purpose to keep kitchen open
      // const hour = new Date().getHours() // this is current hour

      if (hour > 9 && hour < 17) {
        return false
      }

      return true
    }

    utilService.checkFeedbackProvided = (data) => {
      const baseUrl = 'https://ls-backend.herokuapp.com';
      const baseApi = '/api/v1/';
      const deferred = $q.defer()

        const request = $http({
            method: "get",
            url: baseUrl + baseApi + 'feedbacks',
            params: data,
            headers : {
                'Content-Type': 'application/json',
            }
        });

        request.success((data, status, headers, config) => {
          deferred.resolve(data)
        })
        .error((data, status, headers, config) => {
          deferred.reject(data)
          console.log('Error: Something Went Wrong');
        });
        return deferred.promise
    }

    return utilService;

  }
);
