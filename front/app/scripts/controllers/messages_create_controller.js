Front.MessagesCreateController = Ember.ArrayController.extend({
  toUid: "",
  messageBody: "",

  filteredUsers: function() {
    var searchTerm = this.get('searchTerm');
    var regExp = new RegExp(searchTerm, 'i');

    var filteredResults = this.filter(function(user) {
      return regExp.test(user.get('name'));
    });
    return filteredResults;
  }.property('@each.name', 'searchTerm'),

  actions: {
    setRecipient: function(user) {
      this.set('toUid', user.get('uid'));
    },

    send: function() {
      var toUid = this.get('toUid');
      // TODO: set fromUid from current user (using session)
      var fromUid = "688784467878364";
      var body = this.get('messageBody');

      if (toUid === "") {
        alert('宛先を指定して下さい');
        return;
      }

      if (body === "") {
        alert('メッセージを入力して下さい');
        return;
      }

      // Does not work... so use jQuery for now
      /*
      this.store.createRecord('message', {
        from_uid: fromUid,
        to_uid: toUid,
        body: body
      });
      */
      $.ajax({
        url: 'http://localhost:3000/api/v1/messages',
        type: 'post',
        data: {
          message: {
            from_uid: fromUid,
            to_uid: toUid,
            body: body
          }
        },
        headers: {
          Authorization: 'Token token=688784467878364'
        },
        dataType: 'json',
        statusCode: {
          201: function() {
            alert('message was successfully sent.');
          }
        }
      });
    }
  }
});
