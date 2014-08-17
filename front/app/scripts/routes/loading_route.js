Front.LoadingRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    var app = this.controllerFor('application');
    app.whenAvailable('FB', function() {
      FB.init({
        appId      : '702215373193486',
        xfbml      : true,
        version    : 'v2.0'
      });

      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          app.setCurrentUser();
          // app.transitionToRoute('messages');
        }
        else {
          app.transitionToRoute('login');
        }
      });
    });
  }
});
