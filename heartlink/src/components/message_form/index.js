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
      self.$data.recipientCandidates.push({ name: '', to_uid: '' });
    });
  },

  methods: {
    sendMessage: function() {
      var parent = this.$parent;
      var global = this.$parent.$data.appGlobals;

      // FIXME: not cool
      this.$data.message.to_uid = $('#recipient-select option:selected').val();

      var jqxhr = $.ajax({
        type: 'POST',
        url: global.apiUrlBase + '/messages',
        headers: parent.user.ajaxHeaders,
        data: { message: this.$data.message }
      });
    }
  }
}