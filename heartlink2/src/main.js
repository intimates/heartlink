require('insert-css')(require('./app.css'));

var Vue = require('vue');
var user = require('./lib/user');

window.app = new Vue({
  el: '#main',
  components: {
    messages: require('./components/messages'),
    message_form: require('./components/message_form')
  },

  // require html enabled by the partialify transform
  template: require('./app.html'),
  data: {
    currentView: 'messages',
    user: user,
    appGlobals: {
      apiUrlBase: 'http://localhost:3000/api/v1',
      ajaxHeaders: {
        // TODO: set valid token
        Authorization: 'Token token=1'
      }
    }
  },

  methods: {
    openMessageForm: function() {
      this.$data.currentView = 'message_form';
    },
  }
})
