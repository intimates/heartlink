Front.LoginView = Ember.View.extend({
  // FIXME: duplicate code
  pn_value_to_rgba: function(pn_value) {
    var pn_color;
    if(0 < pn_value) pn_color = "rgba(190, 244, 4, "+ pn_value * 0.8 + ")";
    else if(pn_value < 0) pn_color = "rgba(112, 77, 157, "+ Math.abs(pn_value) * 0.8 + ")";
    else if(pn_value == 0) pn_color = "rgba(255, 255, 255, "+ pn_value * 0.8 + ")";
    return pn_color;
  },

  didInsertElement: function() {
    var self = this;

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

    $("div#login_card").css({
      "display": "block",
      "opacity": 0.0
    }).animate({
      "width"  : base_width * scale,
      "height" : base_width * scale * 0.8,
      "top"    : to_top + "px",
      "left"   : (($(window).width() - base_width * scale) * 0.5 - 4) +"px",
      "opacity": 1.0
    }, {
      duration: 300, easing: "easeOutBack"
    });

    var position = [{x: $(window).width() / 320 * 50, y: $(window).height() / 568 * 30},
      {x: $(window).width() / 320 * 200, y: $(window).height() / 568 * 70},
      {x: $(window).width() / 320 * 250, y: $(window).height() / 568 * 350},
      {x: $(window).width() / 320 * 20, y: $(window).height() / 568 * 420},
      {x: $(window).width() / 320 * 180, y: $(window).height() / 568 * 450}
    ];
    $("div[id^='dummy_message']").each(function(){
      var msg_id = parseInt($(this).data("message"));
      var pn_value = parseFloat($(this).data("pn_value"));

      pn_color = self.pn_value_to_rgba(pn_value);
      $("div#dummy_color"+ msg_id).css({
        "background-color": pn_color,
        "width" : 0,
        "height": 0
      });

      $(this).css({
        "left"   : position[msg_id - 1].x,
        "top"    : position[msg_id - 1].y,
        "width"  : 0,
        "height" : 0,
        "opacity": 0
      }).delay(msg_id * 100).animate({
        "height": 50,
        "width" : 50,
        "opacity": 1
      }, {
        duration: 300, easing: "easeOutBack"
      });

      $("div#dummy_color"+ msg_id).delay(msg_id * 100).animate({
        "height": 52,
        "width" : 52,
        "opacity": 1
      }, {
        duration: 300, easing: "easeOutBack"
      });

      var pn_value = parseFloat($(this).data("pn_value"));
      pn_color = self.pn_value_to_rgba(pn_value);
      $("div#dummy_color"+ msg_id).css({"background-color": pn_color});
    });


    $("span#login_submit").on("click", function(){
      var success = login_request($("input#input_mail").val(), $("input#input_pass").val());
      if(success){
        $("div#login_face").animate({
          opacity: 0.0
        }, {
          duration: 300, easing: "easeOutCubic",
          complete: function(){
            $("div#login_card").css({
              "background-image": "-webkit-image-set(url('images/send_message@x2.gif') 2x)"
            });

            var stamp_size = {width: $("img#stamp").width(), height: $("img#stamp").height()};
            $("img#stamp").css({
              "top"   : $("div#login_card").offset().top + $("div#login_card").height() * 0.5 + 20,
              "left"  : $("div#login_card").offset().left + $("div#login_card").width() * 0.5 + 10,
              "width" : 0,
              "height": 0
            }).delay(300).animate({
              "opacity":1,
              "top"   : "-="+ stamp_size.height * 0.5 +"px",
              "left"  : "-="+ stamp_size.width * 0.5 +"px",
              "width" : stamp_size.width,
              "height": stamp_size.height
            }, {
              duration: 300, easing: "easeOutBack",
              complete: function(){
                location.href = "index.html";
              }
            });
          }
        });
      } else {
        console.error("ログイン失敗");
      }
    });
  }
});
