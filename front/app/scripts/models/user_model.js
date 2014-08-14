/*global Ember*/
Front.User = DS.Model.extend({
  name: DS.attr('string'),
  uid: DS.attr('string')
});

// probably should be mixed-in...
Front.User.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Em.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});
