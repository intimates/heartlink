var Front = window.Front = Ember.Application.create();

window.fbAsyncInit = function() {
  FB.init({
    appId      : '702215373193486',
    xfbml      : true,
    version    : 'v2.0'
  });

  function setCurrentUser() {
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

  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      setCurrentUser();
    }
    else {
      FB.login(function(response) {
        if (response.authResponse) {
          setCurrentUser();
        }
      });
    }
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
