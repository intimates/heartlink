/*global Ember*/
Front.Message = DS.Model.extend({
  body: DS.attr('string'),
  sent_at: DS.attr('date')
});

// probably should be mixed-in...
Front.Message.reopen({
  attributes: function(){
    var model = this;
    return Ember.keys(this.get('data')).map(function(key){
      return Em.Object.create({ model: model, key: key, valueBinding: 'model.' + key });
    });
  }.property()
});

// delete below here if you do not want fixtures
Front.Message.FIXTURES = [
  {
    id: 0,
    body: "Hello",
    sent_at: new Date()
  },

  {
    id: 1,
    body: "Nice to meet you.",
    sent_at: new Date()
  }
];
