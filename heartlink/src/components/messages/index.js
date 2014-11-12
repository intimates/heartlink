require('insert-css')(require('./style.css'))

var Vue = require('vue');
var $ = require('jquery-browserify');
// TODO: use jquery plugins the better way
require('../../../bower_components/jquery-easing/jquery.easing.js');
require('../../../bower_components/jquery-ui/jquery-ui.js');
require('../../../bower_components/jquery-ui-touch-punch/jquery.ui.touch-punch.js');

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
      Vue.nextTick(function() {
        self.setDraggable();
      });
    });

    this.registerVueTransition();
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
        $("#pn-"+ id).removeClass("pn-color neutral");
        $("#pn-"+ id).removeClass("pn-color negative");
        $("#pn-"+ id).removeClass("pn-color positive");
        $("#pn-"+ id).addClass("pn-color opened");
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

        var MESSAGE_BORDER_MODIFICATION_SCALE = 1.25;
        this.x = (windowWidth - bubbleWidth) * 0.5 + (windowWidth - bubbleWidth * MESSAGE_BORDER_MODIFICATION_SCALE) * 0.5 * this.pn_value;
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
    },

    registerVueTransition: function() {
      var self = this;
      var openedMessageId = null;
      Vue.transition('message-content-transition', {
        enter: function (el, done) {
          var scale = 0.8;
          openedMessageId = self.$data.message.id;
          var msg = $('#message-' + openedMessageId);
          var x = msg.offset().left + msg.width() * 0.5;
          var y = msg.offset().top + msg.height() * 0.5;

          $(el).css({
            display: "block",
            opacity: 0.0,
            left   : x + "px",
            top    : y + "px"
          }).animate({
            opacity: 1.0,
            width  : $(window).width() * scale + "px",
            height : $(window).width() * scale + "px",
            left   : ($(window).width() - ($(window).width() * scale)) * 0.5 +"px",
            top    : $(window).scrollTop() + ($(window).height() - ($(window).width() * scale)) * 0.5 +"px"
          }, {
            duration: 400,
            easing: "easeOutExpo",
            complete: done
          });
        },

        leave: function (el, done) {
          var msg = $('#message-' + openedMessageId);
          var x = msg.offset().left + msg.width() * 0.5;
          var y = msg.offset().top + msg.height() * 0.5;

          $(el).animate({
            opacity: 0.0,
            width  : 0 +"px",
            height : 0 +"px",
            left   : x +"px",
            top    : y +"px"
          }, {
            duration: 400,
            easing: "easeOutQuad",
            complete: done
          });
        }
      });
    },

    setDraggable: function() {
      var dragstartPosition = {x: 0, y: 0, z: 0};
      var trashSize = {width: $("#trash").css("width"), height: $("#trash").css("height"), borderRadius: $("#trash").css("border-radius")};
      var scaledTrashSize = {width: "200px", height: "200px", borderRadius: "102px"};

      $("div[id^='message-']").draggable({
        containment: "body",
        scroll: false,

        start: function(){
          dragstartPosition = {
            x: $(this).css('left'),
            y: $(this).css('top'),
            z: $(this).css("z-index")
          };
          $(this).css({'z-index': 5});
        },

        drag: function(){
          $("#trash").not(":animated").animate({
            "height"       : scaledTrashSize.height,
            "width"        : scaledTrashSize.width,
            "border-radius": scaledTrashSize.borderRadius
          }, {
            duration: 300, easing: "easeOutCubic"
          });
        },

        stop: function(){
          $(this).animate({
            "left": dragstartPosition.x,
            "top" : dragstartPosition.y,
            "z-index": dragstartPosition.z,
          }, {
            duration: 300, easing: "easeOutBack",
          });

          $("#trash").animate({
            "height"       : trashSize.height,
            "width"        : trashSize.width,
            "border-radius": trashSize.borderRadius
          }, {
            duration: 300, easing: "easeOutCubic"
          });
        }
      });

      $("#trash").droppable({
        accept: "div[id^='message-']",
        hoverClass: "trash-hover",

        drop: function(ev, ui) {
          ui.draggable.hide();
          // TODO: delete message
        },

        over: function(ev, ui) {
          // TODO: make visual feedback
          //$("#trash").css({"border-color": "rgba(0, 0, 0, 0.7)"});
        }
      });
    }
  }
}
