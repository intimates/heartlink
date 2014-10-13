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
      
      calcMessageParams: function(messages) {
        $.each(messages, function() {
          // Set pn_value
          var pnValue = this.pn_value;
          var r, g, b, a;
          if(0 < pnValue) {
            r = 190; g = 244; b =   4; a = pnValue * 0.8;
          } else if(pnValue < 0) {
            r = 112; g =  77; b = 157; a = Math.abs(pnValue) * 0.8;
          } else if(pnValue === 0) {
            r = 255; g =  255; b = 255; a = pnValue * 0.8;
          }
          this.color = {r: r, g: g, b: b, a: a};
          
          // Set Message x, y
          var bubbleWidth = 56;
          var bubbleHeight = 56;
          var windowWidth = $(window).width();
          var windowHeight = $(window).height() * 3;
          
          var dateObj = new Date(this.sent_at);
          var hour = dateObj.getHours();
          var minute = dateObj.getMinutes();
          
          hour = parseFloat(hour) + parseFloat(minute / 60) + 0.01;
          var fixHour = 0 < (hour - 6) ? hour - 6 : 24 + (hour - 6);
          
          this.x = (windowWidth - bubbleWidth) * 0.5 + (windowWidth - bubbleWidth / 0.8) * 0.5 * this.pn_value;
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
        self.calcMessageParams(data.messages);
      });
    }
  });
})(jQuery, Vue);
