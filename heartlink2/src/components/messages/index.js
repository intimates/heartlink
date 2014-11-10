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
    var global = self.$parent.$data.appGlobals;

    var jqxhr = $.ajax({
      url: global.apiUrlBase + '/messages',
      headers: global.ajaxHeaders
    });

    jqxhr.done(function(data) {
      self.$data.messages = data.messages;
    });
  },

  methods: {
    openMessage: function(id) {
      var self = this;
      var global = self.$parent.$data.appGlobals;

      var jqxhr = $.ajax({
        url: global.apiUrlBase + '/messages/' + id,
        headers: global.ajaxHeaders
      });

      jqxhr.done(function(data) {
        self.$data.message = data.message;
      });
    },

    closeMessage: function() {
      this.$data.message = null;
    },
  }
}