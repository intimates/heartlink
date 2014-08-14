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

// delete below here if you do not want fixtures
Front.User.FIXTURES = [

  {
    id: 0,
    name: "Ken Leonard Orihara",
    uid: "1"
  },

  {
    id: 1,
    name: "Genki Sugimoto",
    uid: "2"
  }

];
