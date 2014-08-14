Front.MessageEditController = Ember.ObjectController.extend({
  needs: 'message',
  actions: {
    save: function(){
      self = this
      this.get('buffer').forEach(function(attr){
        self.get('controllers.message.model').set(attr.key, attr.value);
      });
      this.transitionToRoute('message',this.get('model'));
    }
  }
});

