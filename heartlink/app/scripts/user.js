// Load facebook SDK
(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// http://stackoverflow.com/questions/8618464/how-to-wait-for-another-js-to-load-to-proceed-operation
var whenAvailable = function(name, callback) {
  var interval = 10; // ms
  window.setTimeout(function() {
    if (window[name]) {
      callback(window[name]);
    } else {
      window.setTimeout(arguments.callee, interval);
    }
  }, interval);
}

// Create initialized FB object (to use with whenAvailable)
whenAvailable('FB', function() {
  FB.init({
    appId      : '743453079069715',
    xfbml      : true,
    version    : 'v2.0'
  });
  window.InitializedFB = FB;
});

// TODO: any way to not pollute global scope?
// FIXME: don't access global `user` variable inside user object
var user = {
  uid: '',

  setProperties: function(authResponse) {
    user.uid = authResponse.userID;
  },

  initialize: function(callback) {
    whenAvailable('InitializedFB', function() {
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          user.setProperties(response.authResponse);
          callback(true);
        }
        else {
          callback(false);
        }
      });
    });
  },

  login: function() {
    FB.login(function(response) {
      if (response.status == 'connected') {
        console.log('Logged in');
        user.setProperties(response.authResponse);
      }
    });
  },

  logout: function() {
    FB.logout(function(response) {
      console.log('Logged out');
    });
  }
};
