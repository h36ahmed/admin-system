var app = angular.module('lunchSociety');


app.factory(
  "passwordService",
  function() {

    var passwordService = {};

    // ---
    // PUBLIC METHODS.
    // ---

    var consonant, letter, password, vowel;
    letter = /[a-zA-Z]$/;
    vowel = /[aeiouAEIOU]$/;
    consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;


    passwordService.generatePassword = function(length, memorable, pattern, prefix) {
      var char = "",
        n, i, validChars = [];
      if (length == null) {
        length = 10;
      }
      if (memorable == null) {
        memorable = true;
      }
      if (pattern == null) {
        pattern = /\w/;
      }
      if (prefix == null) {
        prefix = '';
      }

      // Non memorable passwords will pick characters from a pre-generated
      // list of characters
      if (!memorable) {
        for (i = 33; 126 > i; i += 1) {
          char = String.fromCharCode(i);
          if (char.match(pattern)) {
            validChars.push(char);
          }
        }

        if (!validChars.length) {
          throw new Error("Could not find characters that match the " +
            "password pattern " + pattern + ". Patterns must match individual " +
            "characters, not the password as a whole.");
        }
      }


      while (prefix.length < length) {
        if (memorable) {
          if (prefix.match(consonant)) {
            pattern = vowel;
          } else {
            pattern = consonant;
          }
          n = rand(33, 126);
          char = String.fromCharCode(n);
        }

        if (memorable) {
          char = char.toLowerCase();
        }
        if (char.match(pattern)) {
          prefix = "" + prefix + char;
        }
      }
      return prefix;
    };

    function rand(min, max) {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    return passwordService;

  }
);
