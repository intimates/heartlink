require('insert-css')(require('./app.css'));

var Vue = require('vue');
var user = require('./lib/user');

window.app = new Vue({
  el: '#main',
  components: {
    loading: require('./components/loading'),
    login: require('./components/login'),
    messages: require('./components/messages'),
    message_form: require('./components/message_form')
  },

  // require html enabled by the partialify transform
  template: require('./app.html'),
  data: {
    currentView: 'loading',
    user: user,
    appGlobals: {
      apiUrlBase: 'http://localhost:3000/api/v1',
      ajaxHeaders: {
        // TODO: set valid token
        Authorization: 'Token token=1'
      }
    }
  },

  ready: function() {
    var self = this;
    this.$data.user.initialize(function(user) {
      if (!user.isAuthenticated) {
        self.changeView('login');
      } else {
        self.changeView('messages');
      }
    });
  },

  methods: {
    changeView: function(view) {
      this.$data.currentView = view;
    }
  }
})
