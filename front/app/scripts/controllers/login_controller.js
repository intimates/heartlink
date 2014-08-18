Front.LoginController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    login: function() {
      var app = this.get('controllers.application');
      FB.login(function(response) {
        if (response.authResponse) {
          app.setCurrentUser();

          $("div#login_face").animate({
            opacity: 0.0
          }, {
            duration: 300, easing: "easeOutCubic",
            complete: function(){
              $("div#login_card").css({
                "background-image": "-webkit-image-set(url('../images/send_message@x2.gif') 2x)"
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
                  setTimeout(function() { app.transitionToRoute('messages') }, 300);
                }
              });
            }
          });
        }
      });
    }
  }
});
