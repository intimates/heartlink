Front.ApplicationRoute = Ember.Route.extend({
  beforeModel: function(transition) {
    // preload loading animation
    jQuery("<img>").attr("src", "./images/logo_animation@x2.gif");

    var currentUser = Ember.get('Front.ApplicationController.currentUser');
    if (currentUser === undefined) {
      this.transitionTo('loading');
    }

    jQuery("<img>").attr("src", "./images/send_message@x2.gif");
    jQuery("<img>").attr("src", "./images/mail_white_opened@x2.png");
    jQuery("<img>").attr("src", "./images/mail_black@x2.gif");
    jQuery("<img>").attr("src", "./images/mail_white@x2.gif");
    jQuery("<img>").attr("src", "./images/stamp@x2.png");
    jQuery("<img>").attr("src", "./images/letter1.png");
  }
});
