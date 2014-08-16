Front.LoginController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    login: function() {
      var app = this.get('controllers.application');
      FB.login(function(response) {
        if (response.authResponse) {
          app.setCurrentUser();
          app.transitionToRoute('messages');
        }
      });
    }
  }
});
