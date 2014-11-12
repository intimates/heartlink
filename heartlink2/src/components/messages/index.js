require('insert-css')(require('./style.css'))

var $ = require('jquery-browserify')

module.exports = {
  template: require('./template.html'),
  replace: true,

  data: function () {
    return {
      messages: [],
      message: null
    }
  },

  ready: function() {
    var self = this;
    var user = self.$parent.user;
    var global = self.$parent.$data.appGlobals;

    var jqxhr = $.ajax({
      url: global.apiUrlBase + '/messages',
      headers: user.ajaxHeaders
    });

    jqxhr.done(function(data) {
      self.$data.messages = data.messages;
      self.calcMessageParams(data.messages);
    });
  },

  methods: {
    openMessage: function(id) {
      var self = this;
      var user = self.$parent.user;
      var global = self.$parent.$data.appGlobals;

      var jqxhr = $.ajax({
        url: global.apiUrlBase + '/messages/' + id,
        headers: user.ajaxHeaders
      });

      jqxhr.done(function(data) {
        self.$data.message = data.message;
      });
    },

    closeMessage: function() {
      this.$data.message = null;
    },

    openMessageForm: function() {
      this.$parent.changeView('message_form');
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
  }
}
