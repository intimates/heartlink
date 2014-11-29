module.exports = {
  kmeans: {
    gravity: null,
    nextGravity: null,
    
    init: function(AXIS_SIZE, HOUR_SIZE) {
      var ARRAY_SIZE = HOUR_SIZE * AXIS_SIZE;
      this.gravity = new Array(ARRAY_SIZE);
      this.nextGravity = new Array(ARRAY_SIZE);
    }, 
    
    learn: function(messages, AXIS_SIZE, HOUR_SIZE) {
      console.log("k-means learn", "AXIS_SIZE -> "+ AXIS_SIZE, "HOUR_SIZE -> "+ HOUR_SIZE); 
      
      for(var axis = 0; axis < AXIS_SIZE; axis++) {
        for(var hour = 0; hour < HOUR_SIZE; hour++) {
          var idx = HOUR_SIZE * axis + hour;
          this.nextGravity[idx] = {x: new Array(), y: new Array(), having: new Array()}; // Array clear
        }
      }
      
      var kmeans = {gravity: this.gravity, nextGravity: this.nextGravity};  // eachの中でthisがmessages要素になってしまうため一時保持
      $.each(messages, function() {
        minDist = {value: Infinity, cluster: -1};
        
        for(var axis = 0; axis < AXIS_SIZE; axis++) {
          for(var hour = 0; hour < HOUR_SIZE; hour++) {
            var idx = HOUR_SIZE * axis + hour;
            var dist = Math.sqrt( Math.pow((kmeans.gravity[idx].x - this.x), 2) + Math.pow((kmeans.gravity[idx].y - this.y), 2) );
            if(dist <  minDist.value) minDist = {value: dist, cluster: idx};
          }
        }
        
        this.cluster = minDist.cluster;
        kmeans.nextGravity[minDist.cluster].x.push(this.x);
        kmeans.nextGravity[minDist.cluster].y.push(this.y);
        kmeans.nextGravity[minDist.cluster].having.push(this.id);
        
      });
      
      this.gravity = kmeans.gravity;
      this.nextGravity = kmeans.nextGravity;
      
      for(var axis = 0; axis < AXIS_SIZE; axis++) {
        for(var hour = 0; hour < HOUR_SIZE; hour++) {
          var idx = HOUR_SIZE * axis + hour;
          
          if(0 < this.nextGravity[idx].having.length){
            var average = {
              x: this.nextGravity[idx].x.reduce(function(a, b) { return a + b }) / this.nextGravity[idx].x.length,
              y: this.nextGravity[idx].y.reduce(function(a, b) { return a + b }) / this.nextGravity[idx].y.length
            };
            this.gravity[idx].x = average.x;
            this.gravity[idx].y = average.y;
            
            /*** デバッグ時、各クラスターの座標を表示するための処理
            var bubbleWidth = 56;
            $("#gravity"+ idx).css({
              left: average.x + bubbleWidth * 0.5,
              top: average.y + bubbleWidth * 0.5
            }).text(idx); ***/
          }
          
        }
      }
    },
    
    grouping: function(idx, bubbleWidth, bubbleHeight, windowWidth, windowHeight){
      $("#messages-container").append('<div id="grouping-messages-'+ idx +'" class="grouping-messages"></div>');
      
      var kmeans = {gravity: this.gravity, nextGravity: this.nextGravity};  // bindの中でthisがmessages要素になってしまうため一時保持
      var minX = Math.min.apply(null, this.nextGravity[idx].x);
      var minY = Math.min.apply(null, this.nextGravity[idx].y);
      
      $("#grouping-messages-"+ idx).css({
        left  : minX +"px",
        top   : minY +"px",
        width : Math.max.apply(null, this.nextGravity[idx].x) - minX + bubbleWidth +"px",
        height: Math.max.apply(null, this.nextGravity[idx].y) - minY + bubbleHeight +"px"
      }).bind('touchstart', {groupID: idx}, function(event) {
        /**** group_open start ****/
        $(this).css({ zIndex: 0 }); // 触れさせなくする。（物理的にunbind）
        
        var groupID = event.data.groupID;
        var RADIUS = 60;  // クラスターの重心を原点として半径RADIUS[px]の円周上にメッセージを配置。
        var BORDER_OFFSET = 1;
        
        event.preventDefault(); // スクロールされてしまわないように。
        
        $("#closer-curtain-group").css({
          display: "block",
          left   : 0,
          top    : 0,
          width  : windowWidth +"px",
          height : windowHeight + "px"
        });
        
        $("#grouping-curtain").css({
          display: "block",
          left   : kmeans.gravity[groupID].x +"px",
          top    : kmeans.gravity[groupID].y +"px",
          width  : "0px",
          height : "0px",
          "border-radius": RADIUS * 2 +"px"
        }).animate({
          opacity: 1,
          left   : kmeans.gravity[groupID].x - RADIUS * 1.5 - BORDER_OFFSET +"px",
          top    : kmeans.gravity[groupID].y - RADIUS * 1.5 - BORDER_OFFSET +"px",
          width  : RADIUS * 4 +"px",
          height : RADIUS * 4 +"px",
        }, {
          duration: 400,
          easing: "easeOutExpo"
        });
        
        var defaultPosition = new Array();
        for(idx in kmeans.nextGravity[groupID].having) {
          var id = kmeans.nextGravity[groupID].having[idx];
          defaultPosition[id] = $("#message-"+ id).position(); // メッセージの元いた座標を記憶
          
          var offset = Math.PI / 2; // 90deg
          var theta = 2 * Math.PI / kmeans.nextGravity[groupID].having.length * idx; // 回転角θはメッセージの数で分割
          var topMove = RADIUS * Math.sin(theta + offset);
          var leftMove = RADIUS * Math.cos(theta + offset);
          
          $("#message-"+ id).css({ zIndex: 5 });
          $("#message-"+ id).animate({
            left  : kmeans.gravity[groupID].x + leftMove,
            top   : kmeans.gravity[groupID].y + topMove
          }, {
            duration: 400,
            easing: "easeOutExpo"
          });
        }
        
        
        var closerWidth = 40;
        
        $("#grouping-ring").css({
          display: "block",
          opacity: 0,
          left   : RADIUS * 2 +"px",
          top    : RADIUS * 2 +"px",
          width  : "0px",
          height : "0px",
          "border-radius": RADIUS * 2 +"px"
        }).animate({
          opacity: 1,
          left   : RADIUS * 0.5 - BORDER_OFFSET +"px",
          top    : RADIUS * 0.5 - BORDER_OFFSET +"px",
          width  : RADIUS * 3 +"px",
          height : RADIUS * 3 +"px",
        }, {
          duration: 400,
          easing: "easeOutExpo"
        });
        
        /**** group_close start ****/
        $("#grouping-close").css({
          display: "block",
          left: RADIUS * 2 - closerWidth * 0.5 - BORDER_OFFSET +"px",
          top : RADIUS * 2 - closerWidth * 0.5 - BORDER_OFFSET +"px"
        });
        $("#grouping-close, #closer-curtain-group").on("touch click", function() {
          $(this).off("touch click");
          
          for(idx in defaultPosition) {
            $("#message-"+ idx).css({ zIndex: 2 });
            $("#message-"+ idx).animate({
              left: defaultPosition[idx].left,
              top : defaultPosition[idx].top
            }, {
              duration: 400,
              easing: "easeOutExpo"
            });
          }
          
          $("#closer-curtain-group").css({ display: "none" });
          $("#grouping-curtain").animate({
            opacity: 0,
            left   : kmeans.gravity[groupID].x +"px",
            top    : kmeans.gravity[groupID].y +"px",
            width  : "0px",
            height : "0px"
          }, {
            duration: 400,
            easing: "easeOutExpo",
            complete: function(){
              $(this).css({ display: "none" });
              $("#grouping-messages-"+ groupID).css({ zIndex: 3 });
            }
          });
        });
        /**** group_close end ****/
      });
      /**** group_open end ****/
      
    }
  }
}
