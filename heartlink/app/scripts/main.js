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
      },
      
      setPNrgba: function(messages) {
        $.each(messages, function() {
          var pnValue = this.pn_value;
          var color;
          if(0 < pnValue) {
            color = 'rgba(190, 244, 4, '+ pnValue * 0.8 + ')';
          } else if(pnValue < 0) {
            color = 'rgba(112, 77, 157, '+ Math.abs(pnValue) * 0.8 + ')';
          } else if(pnValue === 0) {
            color = 'rgba(255, 255, 255, '+ pnValue * 0.8 + ')';
          }
          this.pn_rgba = color;
        });
      },
      
      setMessagesX: function(messages) {
        var bubbleWidth = 0; // TODO: check bubble width.
        var windowWidth = $(window).width();
        
        $.each(messages, function() {
          this.x = (windowWidth - bubbleWidth) * 0.5 + (windowWidth - bubbleWidth / 0.8) * 0.5 * this.pn_value;
        });
      },
      
      setMessagesY: function(messages) {
        var bubbleHeight = 0; // TODO: check bubble height.
        var windowHeight = $(window).height();
      
        $.each(messages, function() {
          var dateObj = new Date(this.sent_at);
          var hour = dateObj.getHours();
          var minute = dateObj.getMinutes();
          
          hour = parseFloat(hour) + parseFloat(minute / 60) + 0.01;
          var fixHour = 0 < (hour - 6) ? hour - 6 : 24 + (hour - 6);
          
          this.y = windowHeight / 25 * fixHour + bubbleHeight * 0.5;
        });
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
        self.setPNrgba(data.messages);
        self.setMessagesX(data.messages);
        self.setMessagesY(data.messages);
      });
    }
  });
})(jQuery, Vue);
