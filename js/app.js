(function() {
  var FoodSaver = {};
  window.FoodSaver = FoodSaver;

  var template = function(name) {
    return Mustache.compile($('#'+name+'-template').html());
  };

  FoodSaver.Food = Backbone.Model.extend({
  });

  FoodSaver.Foods = Backbone.Collection.extend({
    localStorage: new Store("foods")
  });

  FoodSaver.Index = Backbone.View.extend({
    template: template('index'),
    initialize: function() {
      this.foods = new FoodSaver.Foods();
      this.foods.on('all', this.render, this);
      this.foods.fetch();
    },
    render: function() {
      this.$el.html(this.template(this));
      this.foods.each(this.addFood, this);
      var form = new FoodSaver.Index.Form({collection: this.foods});
      this.$el.append(form.render().el);
      return this;
    },
    addFood: function(food) {
      var view = new FoodSaver.Index.Pantry({model: food});
      this.$('.food-list').append(view.render().el);
    },
    count: function() {
      return this.foods.length;
    }
  });

  FoodSaver.Index.Pantry = Backbone.View.extend({
    className: 'food-item',
    template: template('pantry'),
    events: {
      'click button': 'delete'
    },
    render: function() {
      this.$el.html(this.template(this));
      return this;
    },
    name: function() { return this.model.get('name'); },
    age: function() {
    	var bornOnDate = this.model.get('birth');
		var age =  Math.floor((+new Date() - (+bornOnDate))/86400000);
		return age + ' DAYS';
		
    },
    delete: function() {
      this.model.destroy();
    }
  });

  FoodSaver.Index.Form = Backbone.View.extend({
    tagName: 'form',
    className: 'form-horizontal',
    template: template('form'),
    events: {
      'submit': 'add'
    },
    render: function() {
      this.$el.html(this.template(this));
      return this;
    },
    add: function(event) {
      event.preventDefault();
      this.collection.create({
        name: this.$('#name').val(),
        birth: +new Date()
      });
      this.render();
    }
  });

  FoodSaver.Router = Backbone.Router.extend({
    initialize: function(options) {
      this.el = options.el
    },
    routes: {
      "": "index"
    },
    index: function() {
      var index = new FoodSaver.Index();
      this.el.empty();
      this.el.append(index.render().el);
    }
  });

  FoodSaver.boot = function(container) {
    container = $(container);
    var router = new FoodSaver.Router({el: container})
    Backbone.history.start();
  }


  



})()


