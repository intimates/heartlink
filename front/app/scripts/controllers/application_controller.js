Front.ApplicationController = Ember.Controller.extend({
  currentUser: null,

  // http://stackoverflow.com/questions/8618464/how-to-wait-for-another-js-to-load-to-proceed-operation
  whenAvailable: function(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
      if (window[name]) {
        callback(window[name]);
      } else {
        window.setTimeout(arguments.callee, interval);
      }
    }, interval);
  },

  setCurrentUser: function() {
    var self = this;

    FB.api('/me', function(response) {
      var currentUser = {
        name: response.name,
        uid: response.id
      };
      Ember.set('Front.ApplicationController.currentUser', currentUser);

      // create user
      $.ajax({
        url: 'http://localhost:3000/api/v1/users',
        type: 'post',
        data: {
          user: currentUser
        },
        statusCode: {
          201: function() {
            // alert('user was successfully created.');
          }
        }
      });
    });
  }
});
