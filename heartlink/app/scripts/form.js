(function($, Vue) {
  'use strict';

  var userUid = 1; // TODO: use valid uid (1 is for GUEST user)
  var apiUrlBase = 'http://localhost:3000/api/v1';
  var ajaxHeaders = {
    Authorization: 'Token token=' + userUid
  };

  Vue.component('message-form', {
    el: '#message-form',
    data: {
      message: {
        from_uid: userUid,
        to_uid: '',
        body: ''
      },
      recipientCandidates: [],
      userQuery: ''
    },

    methods: {
      sendMessage: function() {
        // FIXME: not cool
        this.$data.message.to_uid = $('#recipient-select option:selected').val();

        var jqxhr = $.ajax({
          type: 'POST',
          url: apiUrlBase + '/messages',
          headers: ajaxHeaders,
          data: { message: this.$data.message }
        });
      }
    },

    ready: function() {
      var self = this;

      var jqxhr = $.ajax({
        url: apiUrlBase + '/users',
        headers: ajaxHeaders
      });

      jqxhr.done(function(data) {
        self.$data.recipientCandidates = data.users;
        // create empty recipient
        self.$data.recipientCandidates.push({ name: '', to_uid: '' });
      });
    }
  });
})(jQuery, Vue);
