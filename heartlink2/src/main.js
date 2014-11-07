require('insert-css')(require('./app.css'));

var Vue = require('vue');
var user = require('./lib/user');

new Vue({
  el: '#main',
  components: {
    messages: require('./components/messages'),
  },

  // require html enabled by the partialify transform
  template: require('./app.html'),
  data: {
    user: user,
    global: {
      apiUrlBase: 'http://localhost:3000/api/v1'
    }
  }
})