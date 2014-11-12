(function($, Vue) {
  'use strict';

  var userUid = 1; // TODO: use valid uid (1 is for GUEST user)
  var apiUrlBase = 'http://localhost:3000/api/v1';
  var ajaxHeaders = {
    Authorization: 'Token token=' + userUid
  };
  var openedMessagePosition = {
    x: 0, y: 0
  };
  
  $("div[id^='message-']").draggable();

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
          $("#pn-"+ id).removeClass("pn-color neutral");
          $("#pn-"+ id).removeClass("pn-color negative");
          $("#pn-"+ id).removeClass("pn-color positive");
          $("#pn-"+ id).addClass("pn-color opened");
        });
        
        var msgobj = $("#message-"+ id);
        openedMessagePosition = {
          x: msgobj.offset().left + msgobj.width() * 0.5,
          y: msgobj.offset().top + msgobj.height() * 0.5
        };
      },

      closeMessage: function() {
        this.$data.message = null;
      },

      calcMessageParams: function(messages) {
        $.each(messages, function() {
          // Set pn_value
          var r, g, b, a;
          if(0 < this.pn_value) {
            r = 190; g = 244; b =   4;
          } else if(this.pn_value < 0) {
            r = 112; g =  77; b = 157;
          } else if(this.pn_value === 0) {
            r = 255; g =  255; b = 255;
          }
          a = Math.abs(this.pn_value) * 0.8;
          this.color = {r: r, g: g, b: b, a: a};

          // Set Message x, y
          var bubbleWidth = 56;
          var bubbleHeight = 56;
          var windowWidth = $(window).width();
          var windowHeight = $(window).height() * 3; // FIXME: get 'REAL' window height.

          var dateObj = new Date(this.sent_at);
          var hour = dateObj.getHours();
          var minute = dateObj.getMinutes();

          hour = parseFloat(hour) + parseFloat(minute / 60) + 0.01;
          var fixHour = 0 < (hour - 6) ? hour - 6 : 24 + (hour - 6);

          this.x = (windowWidth - bubbleWidth) * 0.5 + (windowWidth - bubbleWidth / 0.8) * 0.5 * this.pn_value;
          this.y = windowHeight / 25 * fixHour + bubbleHeight * 0.5;
          
          if(this.opened_at == undefined)
          {
            this.imageClass = "neutral";
            if(this.pn_value < 0) this.imageClass = "negative";
              else if(0 < this.pn_value) this.imageClass = "positive";
          } else {
            this.imageClass = "opened";
          }
        });
      }
    },

    ready: function() {
      var self = this;

      user.initialize(function(isAuthenticated) {
        if (isAuthenticated) {
          // TODO: show main view
          console.log('connected');
        } else {
          // TODO: show login form
          console.log('not connected');
        }
      });

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
  
  Vue.effect('message-content', {
    enter: function (el, insert, timeout) {
        var scale = 0.8;
        
        $(el).css({
          display: "block",
          opacity: 0.0,
          left   : openedMessagePosition.x + "px",
          top    : openedMessagePosition.y + "px"
        }).animate({
          opacity: 1.0,
          width  : $(window).width() * scale +"px",
          height : $(window).width() * scale +"px",
          left   : ($(window).width() - ($(window).width() * scale)) * 0.5 +"px",
          top    : $(window).scrollTop() + ($(window).height() - ($(window).width() * scale)) * 0.5 +"px"
        }, {duration: 400, easing: "easeOutExpo"});
        insert();
    },
    leave: function (el, remove, timeout) {
        $(el).animate({
          opacity: 0.0,
          width  : 0 +"px",
          height : 0 +"px",
          left   : openedMessagePosition.x +"px",
          top    : openedMessagePosition.y +"px"
        }, {duration: 400, easing: "easeOutQuad",
          complete: function(){
            remove();
          }
        });
    }
  });
})(jQuery, Vue);
