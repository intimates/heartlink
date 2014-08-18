Front.MessagesCreateRoute = Ember.Route.extend({
  beforeModel: function() {
    var controller = this.controllerFor('messages.create');
    controller.set('searchTerm', '');
    controller.set('toUid', '');
    controller.set('messageBody', '');
  }
});
