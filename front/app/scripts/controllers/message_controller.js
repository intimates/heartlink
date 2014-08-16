Front.MessageController = Ember.ObjectController.extend({
  actions: {
    deleteRecord: function(message) {
      // does not work, so jQuery for now
      // message.destroyRecord();

      message.deleteRecord();
      var controller = this;

      $.ajax({
        url: 'http://localhost:3000/api/v1/messages/' + message.id,
        type: 'delete',
        headers: {
          Authorization: 'Token token=688784467878364'
        },
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

