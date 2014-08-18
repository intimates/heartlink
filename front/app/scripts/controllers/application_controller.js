Front.ApplicationController = Ember.Controller.extend({
  currentUser: null,
  ajaxRoot: 'http://pigeon.ngrok.com/api/v1/',
  authHeader: function() {
    return { Authorization: 'Token token=' + this.currentUser.uid };
  },

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

  setCurrentUser: function(callback) {
    var self = this;

    FB.api('/me', function(response) {
      var currentUser = {
        name: response.name,
        uid: response.id
      };
      self.set('currentUser', currentUser);

      // create user
      $.ajax({
        url: self.ajaxRoot + 'users',
        type: 'post',
        data: {
          user: currentUser
        },
        statusCode: {
          201: function() {
            // alert('user was successfully created.');
            // FIXME: This is not recommended way
            //   http://api.jquery.com/jQuery.ajaxSetup/
            Ember.$.ajaxSetup({
              headers: {
                'Authorization': 'Token token=' + currentUser.uid
              }
            });
            callback();
          }
        }
      });
    });
  }
});
