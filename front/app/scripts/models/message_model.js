/*global Ember*/
Front.Message = DS.Model.extend({
  body: DS.attr('string'),
  pn_value: DS.attr('number'),
  sent_at: DS.attr('date'),

  sentTime: function() {
    var date = this.get('sent_at');
    return moment(date).format('HH:mm');
  }.property('sent_at'),

  elementId: function() {
    return "message" + this.get('id');
  }.property('id'),

  pnValueId: function() {
    return "pn_value" + this.get('id');
  }.property('id'),

  timeId: function() {
    return "time" + this.get('id')
  }.property('id')
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
