/*global Ember*/
Front.Message = DS.Model.extend({
  body: DS.attr('string'),
  pn_value: DS.attr('number'),
  sent_at: DS.attr('date'),
  opened_at: DS.attr('date'),

  sentTime: function() {
    var date = this.get('sent_at');
    return moment(date).format('HH:mm');
  }.property('sent_at'),

  elementId: function() {
    return "message" + this.get('id');
  }.property('id'),

  pnColorId: function() {
    return "pn_color" + this.get('id');
  }.property('id'),

  unread: function() {
    if (this.get('opened_at') === null) {
      return "1";
    } else {
      return "0";
    }
  }.property('opened_at')
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
