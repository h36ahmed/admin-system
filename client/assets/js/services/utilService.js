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

    utilService.formatMonthToNum = (date) => {
      const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
      let day = parseInt(date.split(' ')[1].split(',')[0])
      let month = parseInt(monthNames.indexOf(date.split(' ')[0]) + 1)
      const year = date.split(' ')[2]

      if (day < 10) {
        day = `0${day}`
      }
      if (month < 10) {
        month = `0${month}`
      }

      return `${year}-${month}-${day}`
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

      // const hour = moment(1495051243414).hour() // this is for dev purpose to keep kitchen closed
      const hour = moment(1495062343414).hour() // this is for dev purpose to keep kitchen open
      // const hour = moment().hour() // this is the current hour

      if (hour > 9 && hour < 17) {
        return false
      }

      return true
    }

    utilService.checkRestaurantOffers = (data) => {
      const baseUrl = 'https://ls-backend.herokuapp.com';
      const baseApi = '/api/v1/';

      const request = $http({
        method: 'get',
        url: `${baseUrl}${baseApi}offers`,
        params: data,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      return request
    }

    utilService.checkCustomerOrdered = (data) => {
      const baseUrl = 'https://ls-backend.herokuapp.com';
      const baseApi = '/api/v1/';

      const request = $http({
        method: 'get',
        url: `${baseUrl}${baseApi}orders`,
        params: data,
        headers: {
          'Content-Type': 'application/json',
        }
      })

      return request
    }

    return utilService;

  }
);
