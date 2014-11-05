(function($, Vue) {
  'use strict';

  Vue.component('login-form', {
    el: '#login-form',

    methods: {
      login: function() {
        user.login();
      },

      logout: function() {
        user.logout();
      }
    }
  });
})(jQuery, Vue);
