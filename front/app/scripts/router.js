Front.Router.map(function () {
  this.route('loading');
  this.route('login');

  this.resource('messages', function(){
    this.resource('message', { path: '/:message_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

  this.resource('users', function(){
    this.resource('user', { path: '/:user_id' }, function(){
      this.route('edit');
    });
    this.route('create');
  });

});
