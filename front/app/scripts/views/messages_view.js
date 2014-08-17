Front.MessagesView = Ember.View.extend({
  isInitialized: false,

  initTrash: function() {
    $('div#trash').droppable({
      tolerence: 'fit',
      over: function() {
        console.log('over');
        $("div#trash").css({ "border-color": "rgba(255, 0, 48, 0.7)" });
      },
      out: function() {
        $("div#trash").css({ "border-color": "rgba(0, 0, 0, 0.7)" });
      },
      drop: function() {
        $("div#trash").css({ "border-color": "rgba(0, 0, 0, 0.7)" });
        alert("DROP");
      }
    });
    $('div#trash').droppable('disable');
  },

  initMessages: function() {
    var self = this;

    $("div[id^='message']").each(function(){
      var msg_id = $(this).data("message");
      if(msg_id){
        var hour = $(this).data("time").split(':');
        hour = parseFloat(hour[0]) + parseFloat(hour[1] / 60) + 0.01;
        var fix_hour = 0 < (hour - 6) ? hour - 6 : 24 + (hour - 6);

        var pn_value = parseFloat($(this).data("pn_value"));
        var left_position = ($(window).width() - $(this).width()) * 0.5 + ($(window).width() - $(this).width() / 0.8) * 0.5 * pn_value - 3;

        pn_color = self.pn_value_to_rgba(pn_value);
        $("div#pn_color"+ msg_id).css({"background-color": pn_color});

        $(this).css({
          "left": left_position +"px",
          "top" : 75 * fix_hour + $(this).height() * 0.5 +"px"
        });

        if($(this).data("unread")){
          $(this).css({
            "border-color": "rgba(255, 96, 37, 0.8)"
          });
          $("div#pn_color"+ msg_id).css({
            "background-image": "-webkit-image-set(url('img/mail_white@x2.gif') 2x)"
          });
        } else {
          $("div#pn_color"+ msg_id).css({
            "background-image": "-webkit-image-set(url('img/mail_white_opened@x2.png') 2x)",
            "background-position": "center top"
          });
        }

        $(this).data("position-left", $(this).position().left);
        $(this).data("position-top", $(this).position().top);
      }
    });

    // Drag
    $("div[id^='message']").draggable({
      start: function() {
        $(this).css({"z-index": 5});

        setTimeout(function(){
          $("div#trash").not(":animated").animate({
            "height"         : 200 + "px",
            "width"          : 200 + "px",
            "border-radius"  : 102 + "px"
          }, {
            duration: 300, easing: "easeOutCubic",
            complete: function() {
              $('div#trash').droppable('enable');
            }
          });
        }, 300);
      },

      stop: function() {
        $(this).css({"z-index": 2});

        $("div#trash").animate({
          "height": 40 + "px",
          "width" : 40 + "px",
          "border-radius" : 23 + "px"
        }, {
          duration: 300, easing: "easeOutCubic"
        });

        $(this).animate({
          "left": $(this).data('position-left'),
          "top" : $(this).data('position-top'),
          "z-index": 1
        }, {
          duration: 300, easing: "easeOutBack",
        });
      }
    });
  },

  pn_value_to_rgba: function(pn_value) {
    var pn_color;
    if(0 < pn_value) pn_color = "rgba(190, 244, 4, "+ pn_value * 0.8 + ")";
    else if(pn_value < 0) pn_color = "rgba(112, 77, 157, "+ Math.abs(pn_value) * 0.8 + ")";
    else if(pn_value == 0) pn_color = "rgba(255, 255, 255, "+ pn_value * 0.8 + ")";
    return pn_color;
  },

  didInsertElement: function() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;

    this.initTrash();
    this.initMessages();
  }
});
