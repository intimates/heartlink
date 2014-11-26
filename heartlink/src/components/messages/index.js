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
      var bubbleWidth = 56;
      var bubbleHeight = 56;
      var windowWidth = $(window).width();
      var windowHeight = $(window).height() * 3; // FIXME: get 'REAL' window height.
        
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
      
      /**** k-means start ****/
      var MESSAGE_BORDER_MODIFICATION_SCALE = 1.25;
      var axis_position = [-1.00, -0.50, 0.00, 0.50, 1.00];
      var HOUR_SIZE = 24;
      var AXIS_SIZE = axis_position.length;
      
      var gravity = new Array(HOUR_SIZE * AXIS_SIZE);
      var next_gravity = new Array(HOUR_SIZE * AXIS_SIZE);
      var cluster_count = new Array(HOUR_SIZE * AXIS_SIZE);
      
      for(var axis = 0; axis < AXIS_SIZE; axis++) {
        for(var hour = 0; hour < HOUR_SIZE; hour++) {
          // 初期化、O(N^2)
          var itr = HOUR_SIZE * axis + hour;
          gravity[itr] = {
            x: (windowWidth - bubbleWidth) * 0.5 + (windowWidth - bubbleWidth * MESSAGE_BORDER_MODIFICATION_SCALE) * 0.5 * axis_position[axis],
            y: windowHeight / 25 * hour + bubbleHeight * 0.5
          } // ポジネガ判定と同じ数式で配置。pn_valueがaxis_positionに変わっただけ。
          
          $("#messages-container").append('<div id="gravity'+ itr +'" class="gravity"></div>');
          $("#gravity"+ itr).css({
            left: gravity[itr].x + bubbleWidth * 0.5,
            top : gravity[itr].y + bubbleWidth * 0.5
          }).text(itr);
        }
      }
      
      // __learning__start__
      for(var learning = 0; learning < 1; learning++) { // 学習の反復回数、今は入るだけで回らない。
        for(var axis = 0; axis < AXIS_SIZE; axis++) {
          for(var hour = 0; hour < HOUR_SIZE; hour++) {
            var itr = HOUR_SIZE * axis + hour;
            next_gravity[itr] = {x: new Array(), y: new Array(), having: new Array()}; // Array clear
          }
        }
        
        $.each(messages, function() {
          minDist = {value: 9999, cluster: -1}; // 最短のクラスターとその距離を記録する変数。画面の縦サイズが1980だとしても、
                                                // ピタゴラス定理で1980 * 2/sqrt(3) = 2286だからだいぶ余裕あるかと。
                                                
          for(var axis = 0; axis < AXIS_SIZE; axis++) {
            for(var hour = 0; hour < HOUR_SIZE; hour++) {
              var itr = HOUR_SIZE * axis + hour;
              var dist = Math.sqrt( Math.pow((gravity[itr].x - this.x), 2) + Math.pow((gravity[itr].y - this.y), 2) );
              if(dist <  minDist.value) minDist = {value: dist, cluster: itr};
            }
          }
          
          this.cluster = minDist.cluster;
          next_gravity[minDist.cluster].x.push(this.x);
          next_gravity[minDist.cluster].y.push(this.y);
          next_gravity[minDist.cluster].having.push(this.id);
          
        });
        
        for(var axis = 0; axis < AXIS_SIZE; axis++) {
          for(var hour = 0; hour < HOUR_SIZE; hour++) {
            var itr = HOUR_SIZE * axis + hour;
            
            if(0 < next_gravity[itr].having.length){
              var average = {
                x: next_gravity[itr].x.reduce(function(a, b) { return a + b }) / next_gravity[itr].x.length,
                y: next_gravity[itr].y.reduce(function(a, b) { return a + b }) / next_gravity[itr].y.length
              };
              gravity[itr].x = average.x;
              gravity[itr].y = average.y;
              
              /*** デバッグ時、各クラスターの座標を表示するための処理
              $("#gravity"+ itr).css({
                left: average.x + bubbleWidth * 0.5,
                top: average.y + bubbleWidth * 0.5
              }).text(itr); ***/
            }
            
          }
        }
        
      }
      // __learning__end__
      /**** k-means end ****/
      
      /**** messages_grouping start ****/
      for(var axis = 0; axis < AXIS_SIZE; axis++) {
        for(var hour = 0; hour < HOUR_SIZE; hour++) {
          var itr = HOUR_SIZE * axis + hour;
          
          if(1 < next_gravity[itr].having.length) {
            
            $("#messages-container").append('<div id="grouping-messages-'+ itr +'" class="grouping-messages"></div>');
            
            var minX = Math.min.apply(null, next_gravity[itr].x);
            var minY = Math.min.apply(null, next_gravity[itr].y);
            $("#grouping-messages-"+ itr).css({
              left  : minX +"px",
              top   : minY +"px",
              width : Math.max.apply(null, next_gravity[itr].x) - minX + bubbleWidth +"px",
              height: Math.max.apply(null, next_gravity[itr].y) - minY + bubbleHeight +"px"
            }).bind('touchstart', {group_id: itr}, function(event) {
              /**** group_open start ****/
              
              var group_id = event.data.group_id;
              var move = 60;  // クラスターの重心を原点として半径move[px]の円周上にメッセージを配置。
              var BORDER_OFFSET = 1;
              
              event.preventDefault(); // スクロールされてしまわないように。
              
              $("#closer-curtain").css({
                display: "block",
                left   : 0,
                top    : 0,
                width  : windowWidth +"px",
                height : windowHeight + "px"
              });
              
              $("#grouping-curtain").css({
                display: "block",
                left   : gravity[group_id].x +"px",
                top    : gravity[group_id].y +"px",
                width  : "0px",
                height : "0px",
                "border-radius": move * 2 +"px"
              }).animate({
                opacity: 1,
                left   : gravity[group_id].x - move * 1.5 - BORDER_OFFSET +"px",
                top    : gravity[group_id].y - move * 1.5 - BORDER_OFFSET +"px",
                width  : move * 4 +"px",
                height : move * 4 +"px",
              }, {
                duration: 400,
                easing: "easeOutExpo"
              });
              
              var default_position = new Array();
              for(idx in next_gravity[group_id].having) {
                var id = next_gravity[group_id].having[idx];
                default_position[id] = $("#message-"+ id).position(); // メッセージの元いた座標を記憶
                
                var offset = Math.PI / 2; // 90deg
                var theta = 2 * Math.PI / next_gravity[group_id].having.length * idx; // 回転角θはメッセージの数で分割
                var top_move = move * Math.sin(theta + offset);
                var left_move = move * Math.cos(theta + offset);
                
                $("#message-"+ id).css({ zIndex: 5 });
                $("#message-"+ id).animate({
                  left  : gravity[group_id].x + left_move,
                  top   : gravity[group_id].y + top_move
                }, {
                  duration: 400,
                  easing: "easeOutExpo"
                });
              }
              
              
              var closerWidth = 40;
              
              $("#grouping-ring").css({
                display: "block",
                opacity: 0,
                left   : move * 2 +"px",
                top    : move * 2 +"px",
                width  : "0px",
                height : "0px",
                "border-radius": move * 2 +"px"
              }).animate({
                opacity: 1,
                left   : move * 0.5 - BORDER_OFFSET +"px",
                top    : move * 0.5 - BORDER_OFFSET +"px",
                width  : move * 3 +"px",
                height : move * 3 +"px",
              }, {
                duration: 400,
                easing: "easeOutExpo"
              });
              
              /**** group_close start ****/
              $("#grouping-close").css({
                display: "block",
                left: move * 2 - closerWidth * 0.5 - BORDER_OFFSET +"px",
                top : move * 2 - closerWidth * 0.5 - BORDER_OFFSET +"px"
              });
              $("#grouping-close, #closer-curtain").on("touch click", function() {
                $(this).off("touch click");
                
                for(idx in default_position) {
                  $("#message-"+ idx).css({ zIndex: 2 });
                  $("#message-"+ idx).animate({
                    left: default_position[idx].left,
                    top : default_position[idx].top
                  }, {
                    duration: 400,
                    easing: "easeOutExpo"
                  });
                }
                
                $("#closer-curtain").css({ display: "none" });
                $("#grouping-curtain").animate({
                  opacity: 0,
                  left   : gravity[group_id].x +"px",
                  top    : gravity[group_id].y +"px",
                  width  : "0px",
                  height : "0px"
                }, {
                  duration: 400,
                  easing: "easeOutExpo",
                  complete: function(){
                    $(this).css({
                      display: "none"
                    })
                  }
                });
              });
              /**** group_close end ****/
            });
            /**** group_open end ****/
          }
          
        }
      }
      
      /**** messages_grouping end ****/
      
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

        start: function() {
          dragstartPosition = {
            x: $(this).css('left'),
            y: $(this).css('top'),
            z: $(this).css("z-index")
          };
          $(this).css({'z-index': 8});
        },

        drag: function() {
          $("#trash").not(":animated").animate({
            "height"       : scaledTrashSize.height,
            "width"        : scaledTrashSize.width,
            "border-radius": scaledTrashSize.borderRadius
          }, {
            duration: 300, easing: "easeOutCubic"
          });
        },

        stop: function() {
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
