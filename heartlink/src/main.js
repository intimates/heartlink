require('insert-css')(require('./normalize.css'));
require('insert-css')(require('./app.css'));

var $ = require('jquery-browserify');
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
      apiUrlBase: 'http://localhost:3000/api/v1'
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

    this.initLayout();
  },

  methods: {
    changeView: function(view) {
      this.$data.currentView = view;
    },

    initLayout: function() {
      // Background Settings.
      $("body").css({height: $(window).height() * 3});
      // TODO: ここに背景の星とか、かもめとかを設置するコードも記載したい。
    }
  }
});
