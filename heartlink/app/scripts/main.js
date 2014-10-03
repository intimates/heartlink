(function($, Vue) {
  'use strict';

  new Vue({
    el: '#messages-container',
    data: {
      messages: []
    },

    ready: function() {
      var self = this;

      var userUid = 1; // TODO: use valid uid (1 is for GUEST user)
      var apiUrlBase = 'http://localhost:3000/api/v1';
      var jqxhr = $.ajax({
        url: apiUrlBase + '/messages',
        headers: {
          Authorization: 'Token token=' + userUid
        }
      });

      jqxhr.done(function(data) {
        self.$data.messages = data.messages;
      });
    }
  });
})(jQuery, Vue);
