Front.MessagesController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    openMessage: function(message) {
      // fire GET request and set opened_at on server
      message.reload();
      this.transitionToRoute('message', message);
    }
  }
});
