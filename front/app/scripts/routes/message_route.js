Front.MessageRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('message', params.message_id);
  },

  setUpController: function(controller, model) {
    controller.set('model', model);
  }
});

