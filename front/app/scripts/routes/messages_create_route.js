Front.MessagesCreateRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('user');
  },

  beforeModel: function() {
    var controller = this.controllerFor('messages.create');
    controller.set('searchTerm', '');
    controller.set('toUid', '');
    controller.set('messageBody', '');
  }
});
