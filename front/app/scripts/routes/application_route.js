Front.ApplicationRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    var currentUser = Ember.get('Front.ApplicationController.currentUser');
    if (currentUser === undefined) {
      this.transitionTo('loading');
    }
  }
});
