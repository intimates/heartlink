require('insert-css')(require('./style.css'))

var $ = require('jquery-browserify')

module.exports = {
  template: require('./template.html'),
  replace: true,

  data: function () {
    return {
      message: {
        from_uid: '',
        to_uid: '',
        body: ''
      },
      recipientCandidates: [],
      recipient: null,
      userQuery: ''
    }
  },

  ready: function() {
    var self = this;
    var parent = self.$parent;
    var global = parent.$data.appGlobals;

    this.$data.message.from_uid = parent.user.uid;

    var jqxhr = $.ajax({
      url: global.apiUrlBase + '/users',
      headers: parent.user.ajaxHeaders
    });

    jqxhr.done(function(data) {
      self.$data.recipientCandidates = data.users;
      // create empty recipient
      self.$data.recipientCandidates.push({ name: '', uid: '' });
    });

    $('#user-query').on('focus', self.showRecipientCandidates);
  },

  methods: {
    selectUser: function(user) {
      this.$data.recipient = user;
      $('#user-query').val(user.name);
      this.hideRecipientCandidates();
    },

    sendMessage: function() {
      var parent = this.$parent;
      var global = this.$parent.$data.appGlobals;

      this.$data.message.to_uid = this.$data.recipient.uid;

      var jqxhr = $.ajax({
        type: 'POST',
        url: global.apiUrlBase + '/messages',
        headers: parent.user.ajaxHeaders,
        data: { message: this.$data.message }
      });
    },

    closeForm: function() {
      var parent = this.$parent;
      parent.changeView('messages');
    },

    showRecipientCandidates: function() {
      $('#recipient-select-box').show();
    },

    hideRecipientCandidates: function() {
      $('#recipient-select-box').hide();
    },
  }
}
