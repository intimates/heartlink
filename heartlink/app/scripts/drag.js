$(window).load(function() { // TODO: .load以外での呼び差しを検討
  var dragstartPosition = {x: 0, y: 0, z: 0};
  var trashSize = {width: $("#trash").css("width"), height: $("#trash").css("height"), borderRadius: $("#trash").css("border-radius")};
  var scaledTrashSize = {width: "400px", height: "400px", borderRadius: "102px"};
  
  $("div[id^='message-']").draggable({
    containment: "body",
    scroll: false,
    
    start: function(){
      dragstartPosition = {x: $(this).offset().left, y: $(this).offset().top, z: $(this).css("z-index")};
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
      // TODO: make isual feedback
      //$("#trash").css({"border-color": "rgba(0, 0, 0, 0.7)"});
    }
  });
});