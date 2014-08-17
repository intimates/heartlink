Front.MessagesCreateController = Ember.ArrayController.extend({
  searchTerm: "",
  toUid: "",
  messageBody: "",

  filteredUsers: function() {
    var searchTerm = this.get('searchTerm');
    var regExp = new RegExp(searchTerm, 'i');

    var filteredResults = this.filter(function(user) {
      return regExp.test(user.get('name'));
    });
    return filteredResults;
  }.property('@each.name', 'searchTerm'),

  actions: {
    setRecipient: function(user) {
      this.set('searchTerm', user.get('name'));
      this.set('toUid', user.get('uid'));
      $("div#user_suggest").hide();
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
      var toUid = this.get('toUid');
      // TODO: set fromUid from current user (using session)
      var fromUid = "688784467878364";
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
              controller.transitionToRoute();
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

      var controller = this;
      $.ajax({
        url: 'http://localhost:3000/api/v1/messages',
        type: 'post',
        data: {
          message: {
            from_uid: fromUid,
            to_uid: toUid,
            body: body
          }
        },
        headers: {
          Authorization: 'Token token=688784467878364'
        },
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
