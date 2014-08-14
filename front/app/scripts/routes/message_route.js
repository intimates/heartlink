Front.MessageRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('message', params.message_id);
  }
});

