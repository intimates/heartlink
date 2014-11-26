module.exports = {
  uid: '',
  isAuthenticated: false,
  ajaxHeaders: {},

  initializeWithAuthResponse: function(response) {
    this.isAuthenticated = true;
    this.uid = response.authResponse.userID;
    this.ajaxHeaders = {
      Authorization: 'Token token=' + this.uid
    };
  },

  initialize: function(callback) {
    var self = this;
    FB.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        self.initializeWithAuthResponse(response);
      }
      callback(self);
    });
  },

  login: function(callback) {
    var self = this;

    if (this.isAuthenticated) {
      callback();
      return;
    }

    FB.login(function(response) {
      if (response.status == 'connected') {
        self.initializeWithAuthResponse(response);
        callback();
      } else {
        // TODO: error handling
      }
    });
  },

  login_as_guest: function(callback) {
    var GUEST_USER_ID = 1;
    var fakeAuthResponse = {
      authResponse: {
        userID: GUEST_USER_ID
      }
    };
    this.initializeWithAuthResponse(fakeAuthResponse);
    callback();
  }
};
