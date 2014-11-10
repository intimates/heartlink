require('insert-css')(require('./style.css'))

module.exports = {
  template: require('./template.html'),
  replace: true,

  methods: {
    login: function() {
      var self = this;
      var parent = self.$parent;
      parent.user.login(function() {
        parent.changeView('messages');
      });
    }
  }
}
