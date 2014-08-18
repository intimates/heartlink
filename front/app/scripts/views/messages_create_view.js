Front.MessagesCreateView = Ember.View.extend({
  // FIXME: duplicate code
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

  didInsertElement: function() {
    $("div#post_card").css({
      "display": "block",
      "opacity": 0.0,
      "top"    : $(window).scrollTop() + $(window).height() * 0.5 - $("div#post_card").height() * 0.5,
      "left"   : $(window).width() * 0.5
    }).animate({
      "opacity": 1.0,
      "left"   : $(window).width() * 0.5 - $("div#post_card").width() * 0.5
    }, {
      duration: 500, easing: "easeInOutBack",
      step: function(now){
        $(this).css("left", ($(window).width() * 0.5 - $("div#post_card").width() * 0.5) * (1-now));
        $(this).css('transform', 'rotate('+ (now) * -0.1 +'deg)');
      }
    });

    $("input#post_card_to").focus(function(){
      $("div#user_suggest").css({
        "display": "block",
        "width"  : $("input#post_card_to").width() + 17 + "px"
      });
    });

    this.open_curtain();
  },

  willDestroyElement: function() {
    this.close_curtain();
  }

});
