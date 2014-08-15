Front.MessagesView = Ember.View.extend({
  didInsertElement: function() {
    function click_event_on(item){
      var msg_id = item.data("message");
      click = {item: item.data("message"), flag: true};

      item.off("touch");
      over_curtain(msg_id);
      open_curtain();

      axis_move("right", msg_id);

      /*** show body -> ***/
      show_body(item);
      /*** <- show body ***/

      /*item.on("touch", function(){
        hide_body(msg_id);
        $(this).off("touch");
        });*/
      $("div#curtain").on("touchstart", function(){
        hide_body(msg_id);
        $(this).off("touchstart");
      });
    }

    function time_follow(item){
      var msg_id = item.data("message");
      if(msg_id){
        $("div#time"+ msg_id).css({
          "left": item.offset().left + item.width() +"px",
          "top" : item.offset().top + item.height() +"px"
        });
      }
    }

    function pn_value_follow(item){
      var msg_id = item.data("message");
      if(msg_id){
        if(parseInt($("div#pn_value"+ msg_id).text()) < 0){
          $("div#pn_value"+ msg_id).css({
            "left": item.offset().left - $("div#pn_value"+ msg_id).width() - 10 +"px",
            "top" : item.offset().top +"px"
          });
        } else {
          $("div#pn_value"+ msg_id).css({
            "left": item.offset().left + item.width() + 5 +"px",
            "top" : item.offset().top +"px"
          });
        }
      }
    }

    function follows_hide(item){
      $("div#time"+ item).animate({ opacity: 0.0 }, {
        duration: 100, easing: "easeOutCubic",
        complete: function(){ $(this).hide(); }
      });
      $("div#pn_value"+ item).animate({ opacity: 0.0 }, {
        duration: 100, easing: "easeOutCubic",
        complete: function(){ $(this).hide(); }
      });
    }

    function over_curtain(msg_id){
      $("div#message"+ msg_id).css({zIndex: 5});
      $("div#time"+ msg_id).css({zIndex: 5});
      $("div#pn_value"+ msg_id).css({zIndex: 5});
    }
    function under_curtain(msg_id){
      $("div#message"+ msg_id).css({zIndex: 2});
      $("div#time"+ msg_id).css({zIndex: 2});
      $("div#pn_value"+ msg_id).css({zIndex: 2});
    }

    function open_curtain(){
      $("div#curtain").css({
        display: "block",
        opacity: 0.0
      }).animate({
        opacity: 1.0
      }, {
        duration: 500, easing: "easeOutCubic"
      });
    }

    function close_curtain(){
      $("div#curtain").animate({
        opacity: 1.0
      }, {
        duration: 500, easing: "easeOutCubic"
      }).css({
        display: "none",
        opacity: 0.0
      });
    }

    function show_body(item){
      var msg_id = item.data("message");
      var item_position = item.offset();
      msg_open = {item: msg_id, flag: true};
      $("div#message_body").css({
        "display": "block",
        "opacity": 0.0,
        "top"    : item_position.top + "px",
        "left"   : item_position.left + "px"
      }).animate({
        "top"    : item_position.top - item.height() - 15 + "px",
        "left"   : 30 + "px",
        "width"  : $(window).width() * 0.5,
        "height" : $(window).width() * 0.5,
        "opacity": 1.0,
      });
      $("div#message_body").perfectScrollbar('update');
    }

    function hide_body(msg_id){
      close_curtain();
      under_curtain(msg_id);
      $("div#message_body").animate({
        opacity: 0.0, 
        "width"  : 0 +"px",
        "height" :  0 +"px",
        top    : $("div#message_body").offset().top + 30 + "px"
      }, {
        duration: 500, easing: "easeOutCubic", 
        complete: function(){
          click = {item: 0, flag: false};
          axis_move("left", msg_id);
        }
      }).html("");
    }

    function axis_move(direction, event_on){
      switch(direction){
        case "right":
          $("div[id^='message']").each(function(){
          var msg_id = $(this).data("message");
          if(msg_id)
            {
              $(this).animate({
                left: $(this).offset().left + 80 + "px"
              }, {
                duration: 500, easing: "easeOutCubic",
                step: function(){
                  $("div#time"+ msg_id).css({left: $(this).offset().left + $(this).width()});
                  if(parseInt($("div#pn_value"+ msg_id).text()) < 0){
                    $("div#pn_value"+ msg_id).css({
                      "left": $("div#message"+ msg_id).offset().left - $("div#pn_value"+ msg_id).width() - 10 +"px",
                      "top" : $("div#message"+ msg_id).offset().top +"px"
                    });
                  } else {
                    $("div#pn_value"+ msg_id).css({
                      "left": $("div#message"+ msg_id).offset().left + $("div#message"+ msg_id).width() + 5 +"px",
                      "top" : $("div#message"+ msg_id).offset().top +"px"
                    });
                  }
                }
              });
            }
        });
        break;

        case "left":
          $("div[id^='message']").each(function(){
          var msg_id = $(this).data("message");
          if(msg_id)
            {
              $(this).animate({
                left: $(this).offset().left - 80 - parseInt($(this).css("margin")) * 2 + "px"
              }, {
                duration: 500, easing: "easeOutCubic",
                step: function(){
                  $("div#time"+ msg_id).css({left: $(this).offset().left + $(this).width()});
                  if(parseInt($("div#pn_value"+ msg_id).text()) < 0){
                    $("div#pn_value"+ msg_id).css({
                      "left": $("div#message"+ msg_id).offset().left - $("div#pn_value"+ msg_id).width() - 10 +"px",
                      "top" : $("div#message"+ msg_id).offset().top +"px"
                    });
                  } else {
                    $("div#pn_value"+ msg_id).css({
                      "left": $("div#message"+ msg_id).offset().left + $("div#message"+ msg_id).width() + 5 +"px",
                      "top" : $("div#message"+ msg_id).offset().top +"px"
                    });
                  }
                }
              });
            }
        });
        $("div#message"+ event_on).on("touch", function(){
          click_event_on($(this));
        });
        break;
      }
    }

    var cursor = {x: 0, y: 0};
    var catch_gap = {x: 0, y: 0};
    var msg_position = {x1: 0, y1: 0, x2: 0, y2: 0};

    var drag = {item: 0, flag: false};
    var bow = {item: 0, flag: false};
    var click = {item: 0, flag: false};
    var msg_open = {item: 0, flag: false};
    var blow = {item: 0, flag: false};

    var isTouch = ('ontouchstart' in window);

    /*** animation draw -> ***/
    itv = setInterval(function(){
      draw();
    }, 1)
    /*** <- animation draw ***/

    $(function(){

      /*** init message -> ***/
      $("div[id^='message']").each(function(){
        var msg_id = $(this).data("message");
        var hour = parseInt($("div#time"+ msg_id).text().split(':')[0]);

        $(this).css({
          "left": $(window).width() * 0.5 - $(this).width() * 0.5 - parseInt($(this).css("margin")) +"px",
          "top" : 75 * hour + $(this).height() * 0.5 +"px"
        });

        time_follow($(this));
        pn_value_follow($(this));
      });
      /*** <- init message ***/

      /*** touch event ON -> ***/
      $("div[id^='message']").on("touch click", function(){
        click_event_on($(this));
      });
      /*** <- touch event ON ***/

      /*** touchstart event ON -> ***/
      $("div[id^='message']").on("touchstart", function(){
        drag = {item: $(this).data("message"), flag: true};

        try{
          cursor.x = (isTouch ? event.changedTouches[0].clientX : e.clientX);
        }catch(e){
          drag = {item: 0, flag: false};
          bow  = {item: 0, flag: false};
        }

        catch_gap.x = cursor.x - $(this).offset().left + parseInt($(this).css("margin"));
        msg_position.x1 = $(this).offset().left - parseInt($(this).css("margin"));
      });
      /*** <- touchstart event ON ***/

      /*** touchmove event ON -> ***/
      $(window).on("touchmove", function(e){
        if(drag.flag){
          e.preventDefault();
          cursor.x = (isTouch ? event.changedTouches[0].clientX : e.clientX);
        }
      })
      /*** touchmove event ON -> ***/

      /*** touched event ON -> ***/
      $(window).on("touchend", function(){
        if(drag.flag){
          bow = {item: drag.item, flag: true};
          drag = {item: 0, flag: false};
          msg_position.x2 = cursor.x;
        }
      });
      /*** touched event ON -> ***/

      $("div#message_body").perfectScrollbar();
    });

    function draw(){

      time_follow($("div#message"+ bow.item));
      pn_value_follow($("div#message"+ bow.item));

      if(drag.flag){
        /*** direct move -> ***/
        $("div#message"+ drag.item).css({
          "left": cursor.x - catch_gap.x +"px"
        });

        time_follow($("div#message"+ drag.item));
        pn_value_follow($("div#message"+ drag.item));
        /*** <- direct move ***/

        var pulled = cursor.x - msg_position.x1;
        if(pulled > 200){
          $("div#message"+ drag.item).css({
            backgroundColor: "rgba(204, 68, 37, 1.0)",
            boxShadow: '0 0 3px 3px rgba(204, 68, 37, 1.0)'
          });
        } else if(pulled > 150){
          $("div#message"+ drag.item).css({
            backgroundColor: "rgba(204, 68, 37, 0.8)",
            boxShadow: '0 0 3px 3px rgba(204, 68, 37, 0.8)'
          });
        } else if(pulled > 100){
          $("div#message"+ drag.item).css({
            backgroundColor: "rgba(204, 68, 37, 0.5)",
            boxShadow: '0 0 3px 3px rgba(204, 68, 37, 0.5)'
          });
        } else if(pulled < 0){
          blow = drag;
          drag = {item: 0, flag: false};
        } else {
          $("div#message"+ drag.item).css({
            backgroundColor: "rgba(129, 204, 42, 0.7)",
            boxShadow: '0 0 3px 3px rgba(129, 204, 42, 0.7)'
          });
        }
      }

      if(bow.flag && !click.flag){
        var pulled = msg_position.x2 - msg_position.x1;
        if(pulled > 200){
          bow.flag = false;
          message_drop(bow.item);
          follows_hide(bow.item);

          var down_step = 10;
          $("div#message"+ bow.item).animate({
            left: "-200"
          }, {
            duration: 300, easing: "easeOutCubic",
            step: function(s,tw){
              if(0 < s){
                $(this).css({
                  top: "+="+ down_step +"px"
                });
              } else {
                $(this).stop().animate({
                  left: "200"
                }, {
                  duration: 300, easing: "easeOutCubic", 
                  step: function(s, tw){
                    $(this).css({
                      top: "+="+ down_step +"px"
                    });
                  }
                });
              }
              down_step *= 1.2;
            }
          });
        } else if(pulled > 150){
          bow.flag = false;
          message_drop(bow.item);
          follows_hide(bow.item);

          var down_step = 10;
          $("div#message"+ bow.item).animate({
            left: "-150"
          }, {
            duration: 300, easing: "easeOutCubic",
            step: function(s,tw){
              if(0 < s){
                $(this).css({
                  top: "+="+ down_step +"px"
                });
              } else {
                $(this).stop().animate({
                  left: "150"
                }, {
                  duration: 300, easing: "easeOutCubic", 
                  step: function(s, tw){
                    $(this).css({
                      top: "+="+ down_step +"px"
                    });
                  }
                });
              }
              down_step *= 1.2;
            }
          });
        } else if(pulled > 100){
          bow.flag = false;
          message_drop(bow.item);
          follows_hide(bow.item);

          var down_step = 10;
          $("div#message"+ bow.item).animate({
            left: "-60"
          }, {
            duration: 500, easing: "easeOutCubic",
            step: function(s,tw){
              if(0 < s){
                $(this).css({
                  top: "+="+ down_step +"px"
                });
              } else {
                $(this).stop().animate({
                  left: "60"
                }, {
                  duration: 300, easing: "easeOutCubic", 
                  step: function(s, tw){
                    $(this).css({
                      top: "+="+ down_step +"px"
                    });
                  }
                });
              }
              down_step *= 1.2;
            }
          });
        } else {
          bow.flag = false;
          $("div#message"+ bow.item).animate({
            left: msg_position.x1
          }, {
            duration: 300, easing: "easeOutCubic",
          });
        }
      }

      if(blow.flag)
        {
          $("div#message"+ blow.item).animate({
            left: -100,
            backgroundColor: "rgba(204, 68, 37, 0.5)",
            boxShadow: '0 0 3px 3px rgba(204, 68, 37, 0.5)'
          }, {
            duration: 300, easing: "easeOutCubic",
            complete: function(){
              message_drop(blow.item);
              blow = {item: 0, flag: false};
            }
          });
          follows_hide(blow.item)
        }

    }
  }
});
