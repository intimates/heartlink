Front.MessagesCreateController = Ember.ArrayController.extend({
  filteredUsers: function() {
    var searchTerm = this.get('searchTerm');
    var regExp = new RegExp(searchTerm, 'i');

    var filteredResults = this.filter(function(user) {
      return regExp.test(user.get('name'));
    });
    return filteredResults;
  }.property('@each.name', 'searchTerm')
});
