Front.MessageView = Ember.View.extend({
  show_body: function(item) {
    var msg_id = item.data("message");
    var item_position = item.offset();
    msg_open = {item: msg_id, flag: true};
    var base_width = $(window).width();
    var base_height = $(window).height();
    var is_port = base_width < base_height; // 頑張れ
    if (!is_port) {
      var temp = base_width;
      base_width = base_height;
      base_height = temp;
    }
    var scale = 0.8;
    var to_top = 0;
    if (is_port) {
      to_top = $(window).scrollTop() + (base_height - scale * base_width) * 0.5;	
    } else {
      to_top = $(window).scrollTop() + (base_width - scale * base_width) * 0.5;	
    }

    $("div#message_body").off("click touch");
    $("div#message_body").css({
      "display": "block",
      "opacity": 0.0,
      "top"    : item_position.top + "px",
      "left"   : item_position.left + "px"
    }).animate({
      "width"  : base_width * scale,
      "height" : base_width * scale,
      "top"    : to_top + "px",
      "left"   : (($(window).width() - base_width * scale) * 0.5 - 12) +"px",
      "opacity": 1.0
    }, {
      duration: 300, easing: "easeOutBack"
    });

    $("div#pn_color"+ msg_id).css({
      "background-image"   : "-webkit-image-set(url('./images/mail_white_opened@x2.png') 2x)",
      "background-position": "center top"
    });

    $("div#message"+ msg_id).css({
      "border": "3px solid rgba(0, 0, 0, 0.9)"
    });
  },

  hide_body: function(callback) {
    this.close_curtain();
    var model = this.get('controller.model');
    var msg_id = model.id;
    var item_position = $("div#message"+ msg_id).offset();

    $("div#message"+ msg_id).data("unread", 0);

    $("div#message_body").animate({
      "width"  : 0 +"px",
      "height" :  0 +"px",
      "top"    : item_position.top + $("div#message"+ msg_id).height() * 0.5 - 8 +"px",
      "left"   : item_position.left + $("div#message"+ msg_id).width() * 0.5 - 4 + "px"
    }, {
      duration: 300, easing: "easeOutCubic", 
      complete: function(){
        click = {item: 0, flag: false};
        $(this).hide();
        callback();
      }
    });
  },

  close_curtain: function() {
    $("div#curtain").animate({
      opacity: 0.0
    }, {
      duration: 500, easing: "easeOutCubic",
      complete: function(){
        $(this).css({
          display: "none",
        });
      }
    });
  },

  open_curtain: function() {
    $("div#curtain").css({
      display: "block",
      opacity: 0.0
    }).animate({
      opacity: 1.0
    }, {
      duration: 500, easing: "easeOutCubic"
    });
  },

  didInsertElement: function() {
    this.open_curtain();

    var model = this.get('controller.model');
    this.show_body($('#message' + model.id));

    var self = this;
    var router = this.get('controller.target.router');
    $("div#curtain").on("click", function(){
      $(this).off("click");
      self.hide_body(function() {
        router.transitionTo('messages');
      });
    });
  }
});
