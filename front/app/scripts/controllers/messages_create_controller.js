Front.MessagesCreateController = Ember.ArrayController.extend({
  needs: ['application'],

  searchTerm: "",
  toUid: "",
  messageBody: "",

  filteredUsers: function() {
    var app = this.get('controllers.application');
    var searchTerm = this.get('searchTerm');
    var regExp = new RegExp(searchTerm, 'i');

    var filteredResults = app.get('allUsers').filter(function(user) {
      return regExp.test(user.get('name'));
    });
    return filteredResults;
  }.property('@each.name', 'searchTerm'),

  actions: {
    setRecipient: function(user) {
      this.set('searchTerm', user.get('name'));
      this.set('toUid', user.get('uid'));
    },

    cancel: function() {
      var self = this;

      $("div#post_card").animate({
        "opacity": 0.0
      }, {
        duration: 500, easing: "easeOutCubic",
        step: function(now){
          $(this).css("top", "+="+ now * 10 +"px");
        },
        complete: function(){
          $(this).css({ "display": "none" });
          self.transitionToRoute('messages');
        }
      });
    },

    send: function() {
      var app = this.get('controllers.application');
      var controller = this;

      var toUid = this.get('toUid');
      var fromUid = app.currentUser.uid;
      var body = this.get('messageBody');

      if (toUid === "") {
        alert('宛先を指定して下さい');
        return;
      }

      if (body === "") {
        alert('メッセージを入力して下さい');
        return;
      }

      $("div#post_card_face").animate({
        opacity: 0.0
      }, {
        duration: 300, easing: "easeOutCubic",
        step: function(now){
          $(this).css("top", "+="+ now * 10 +"px");
        },
        complete: function(){
          $("div#post_card").css({
            "background-image": "-webkit-image-set(url('../images/send_message@x2.gif') 2x)"
          }).delay(300).animate({
            "top"    : "-=100px",
            "opacity": 0.0
          }, {
            duration: 300, easing: "easeInBack",
            complete: function(){
              $(this).css({
                "opacity"         : 0.0,
                "background-image": "none",
                "display"         : "none",
              });
              // controller.transitionToRoute(); // this makes bad UX
              controller.transitionToRoute('messages');
            }
          });
        }
      });

      // Does not work... so use jQuery for now
      /*
      this.store.createRecord('message', {
        from_uid: fromUid,
        to_uid: toUid,
        body: body
      });
      */

      $.ajax({
        url: app.ajaxRoot + 'messages',
        type: 'post',
        data: {
          message: {
            from_uid: fromUid,
            to_uid: toUid,
            body: body
          }
        },
        headers: app.authHeader(),
        dataType: 'json',
        statusCode: {
          201: function() {
            // alert('message was successfully sent.');

            // reload messages by transitions (there should be a better way)
            // controller.transitionToRoute();
            // controller.transitionToRoute('messages');
          }
        }
      });
    }
  }
});
