/*global PreLinked, Backbone*/

PreLinked.Models.UserModel = Backbone.Model.extend({
  urlRoot: '/user',

  defaults: {
    searchHistory: []
    // inPerson: {}
  },

  initialize: function(options) {
    this.jobQuery = options.jobQuery;
    this.fetchUser();
  },

  fetchUser: function(){
    var that = this;
    this.fetch()
      .done(function(data){
        console.log('user attributes: ', that.attributes);
        console.log('user fetch data: ', data);
        that.trigger('renderUser');
      })
      .fail(function(error){
        console.log('user session does not exist............');
      });
  },

  addSearchHistory: function(){
    var searchHistory = this.get('searchHistory');
    console.log('adding SearchHistory, current history obj: ', searchHistory);
    searchHistory.unshift(_.clone(this.jobQuery.attributes));
    // if(searchHistory.length > 10){
    //   searchHistory.pop();
    // }
    this.save();
  }
});
