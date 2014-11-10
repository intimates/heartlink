var FB = require('facebook');

module.exports = {
  uid: '',
  isAuthenticated: false,
  initialize: function(callback) {
    var self = this;
    FB.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        self.isAuthenticated = true;
        self.uid = response.authResponse.userID;
        console.log(self);
      }
      callback(self);
    });
  }
};
