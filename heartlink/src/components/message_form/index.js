require('insert-css')(require('./style.css'))

var $ = require('jquery-browserify')
require('../../../bower_components/jquery-easing/jquery.easing.js');

module.exports = {
  template: require('./template.html'),
  replace: true,

  data: function () {
    return {
      message: {
        to_uid: '',
        body: ''
      },
      recipientCandidates: [],
      recipient: null,
      userQuery: ''
    }
  },

  ready: function() {
    var self = this;
    var parent = self.$parent;
    var global = parent.$data.appGlobals;

    var jqxhr = $.ajax({
      url: global.apiUrlBase + '/users',
      headers: parent.user.ajaxHeaders
    });

    jqxhr.done(function(data) {
      self.$data.recipientCandidates = data.users;
      // create empty recipient
      self.$data.recipientCandidates.push({ name: '', uid: '' });
    });

    $('#user-query').on('focus', self.showRecipientCandidates);

    $("#message-form-wrapper").css({
      "display": "block",
      "opacity": 0.0,
      "top"    : $(window).scrollTop() + $(window).height() * 0.5 - $("#message-form-wrapper").height() * 0.5,
      "left"   : $(window).width() * 0.5
    }).animate({
      "opacity": 1.0,
      "left"   : $(window).width() * 0.5 - $("#message-form-wrapper").width() * 0.5
    }, {
      duration: 500, easing: "easeInOutBack",
      step: function(now){
        $(this).css("left", ($(window).width() * 0.5 - $("#message-form").width() * 0.5) * (1-now));
        $(this).css('transform', 'rotate('+ (now) * -0.1 +'deg)');
      }
    });
  },

  methods: {
    selectUser: function(user) {
      this.$data.recipient = user;
      $('#user-query').val(user.name);
      this.hideRecipientCandidates();
    },

    sendMessage: function() {
      var self = this;
      var parent = this.$parent;
      var global = this.$parent.$data.appGlobals;

      var recipient = this.$data.recipient;
      var message = this.$data.message;
      message.to_uid = recipient === null ? '' : recipient.uid;

      if (message.to_uid === '') {
        alert('宛先を選択してください');
        return;
      }
      if (message.body === '') {
        alert('本文を入力してください');
        return;
      }

      var jqxhr = $.ajax({
        type: 'POST',
        url: global.apiUrlBase + '/messages',
        headers: parent.user.ajaxHeaders,
        data: { message: message }
      });

      var topBase = parseInt($('#message-form-wrapper').css('top'));
      $('#message-form-wrapper').css({
        'background-image': '-webkit-image-set(url("/images/send_message@x2.gif") 2x)'
      });
      $('#message-form').animate({
        opacity: 0.0
      }, {
        duration: 300, easing: 'easeOutCubic',
        complete: function(){
          $('#message-form-wrapper').animate({
            'top'    : '-100px',
            'opacity': 0.0
          }, {
            duration: 800, easing: 'easeInBack',
            complete: function(){
              $(this).css({
                'opacity'         : 0.0,
                'background-image': 'none',
                'display'         : 'none',
              });
              self.closeForm();
            }
          });
        }
      });
    },

    cancelMessage: function() {
      var self = this;

      $("#message-form-wrapper").animate({
        "opacity": 0.0
      }, {
        duration: 500, easing: "easeOutCubic",
        step: function(now){
          $(this).css("top", "+="+ now * 10 +"px");
        },
        complete: function(){
          $(this).css({ "display": "none" });
          self.closeForm();
        }
      });
    },

    closeForm: function() {
      var parent = this.$parent;
      parent.changeView('messages');
    },

    showRecipientCandidates: function() {
      $('#recipient-select-box').show();
    },

    hideRecipientCandidates: function() {
      $('#recipient-select-box').hide();
    },
  }
}
