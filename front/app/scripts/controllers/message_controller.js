Front.MessageController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    deleteRecord: function(message) {
      // does not work, so jQuery for now
      // message.destroyRecord();

      message.deleteRecord();
      var controller = this;
      var app = this.get('controllers.application');

      $.ajax({
        url: app.ajaxRoot + 'messages/' + message.id,
        type: 'delete',
        headers: app.authHeader(),
        statusCode: {
          200: function() {
            alert('message was successfully deleted.');
            controller.transitionToRoute('messages');
          }
        }
      });
    }
  }
});

