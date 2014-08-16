Front.MessagesRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('message');
  },

  setupController: function(controller, model){
    controller.set('model', model);
  }
});

