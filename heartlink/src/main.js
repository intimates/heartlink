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
      // preload images
      jQuery("<img>").attr("src", "./images/send_message@x2.gif");
      jQuery("<img>").attr("src", "./images/mail_white_opened@x2.png");
      jQuery("<img>").attr("src", "./images/mail_black@x2.gif");
      jQuery("<img>").attr("src", "./images/mail_white@x2.gif");
      jQuery("<img>").attr("src", "./images/stamp@x2.png");
      jQuery("<img>").attr("src", "./images/letter1.jpg");

      // Background Settings.
      $("body").css({height: $(window).height() * 3});
      var doc_size = {height: $(document).height(), width: $(document).width()};
      $("img#st0").css({left: "20px" , top: "60px"});
      $("img#st1").css({left: "40px" , top: "40px"});
      $("img#st2").css({left: "70px" , top: "20px"});
      $("img#st3").css({left: "90px" , top: "30px"});
      $("img#st4").css({left: "120px", top: "10px"});
      $("img#st5").css({left: "180px" , top: "40px"});
      $("img#st6").css({left: "200px" , top: "50px"});
      $("img#st7").css({left: "240px" , top: "20px"});
      $("img#st8").css({left: "280px" , top: "30px"});
      $("img#st9").css({left: "300px", top: "60px"});
      $("img#env_sun").css({left: doc_size.width * 0.1, top: doc_size.height * 0.20});
      $("img#env_moon").css({left: doc_size.width * 0.2, top: doc_size.height * 0.93});
      $("img#env_bird1").css({left: doc_size.width * 0.75, top: doc_size.height * 0.45});
      $("img#env_bird2").css({left: doc_size.width * 0.85, top: doc_size.height * 0.46});
    }
  }
});
