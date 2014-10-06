(function($, Vue) {
  'use strict';

  var userUid = 1; // TODO: use valid uid (1 is for GUEST user)
  var apiUrlBase = 'http://localhost:3000/api/v1';
  var ajaxHeaders = {
    Authorization: 'Token token=' + userUid
  };

  window.app = new Vue({
    el: '#main',
    data: {
      message: null,
      messages: []
  },

    methods: {
      openMessage: function(id) {
        var self = this;

        var jqxhr = $.ajax({
          url: apiUrlBase + '/messages/' + id,
          headers: ajaxHeaders
        });

        jqxhr.done(function(data) {
          self.$data.message = data.message;
        });
      },

      closeMessage: function() {
        this.$data.message = null;
      }
    },

    ready: function() {
      var self = this;

      var jqxhr = $.ajax({
        url: apiUrlBase + '/messages',
        headers: ajaxHeaders
      });

      jqxhr.done(function(data) {
        self.$data.messages = data.messages;
      });
    }
  });
})(jQuery, Vue);