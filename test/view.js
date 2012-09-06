$(document).ready(function() {

  var view;

  module("Backbone.View", _.extend(new Environment, {

    setup: function() {
      Environment.prototype.setup.apply(this, arguments);
      view = new Backbone.View({
        id        : 'test-view',
        className : 'test-view'
      });
    }

  }));

  test("constructor", 4, function() {
    equal(view.el.id, 'test-view');
    equal(view.el.className, 'test-view');
    equal(view.options.id, 'test-view');
    equal(view.options.className, 'test-view');
  });

  test("jQuery", 2, function() {
    view.setElement(document.body);

    ok(view.$('#qunit-header a').get(0).innerHTML.match(/Backbone Test Suite/));
    ok(view.$('#qunit-header a').get(1).innerHTML.match(/Backbone Speed Suite/));
  });

  test("make", 3, function() {
    var div = view.make('div', {id: 'test-div'}, "one two three");

    equal(div.tagName.toLowerCase(), 'div');
    equal(div.id, 'test-div');
    equal($(div).text(), 'one two three');
  });

  test("make can take falsy values for content", 2, function() {
    var div = view.make('div', {id: 'test-div'}, 0);
    equal($(div).text(), '0');

    var div = view.make('div', {id: 'test-div'}, '');
    equal($(div).text(), '');
  });

  test("initialize", 1, function() {
    var View = Backbone.View.extend({
      initialize: function() {
        this.one = 1;
      }
    });

    var view = new View;
    equal(view.one, 1);
  });

  test("delegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;

    view.setElement(document.body);
    view.increment = function() { counter1++; };
    view.$el.bind('click', function() { counter2++; });

    var events = {'click #qunit-banner': 'increment'};

    view.delegateEvents(events);
    $('#qunit-banner').trigger('click');
    equal(counter1, 1);
    equal(counter2, 1);

    $('#qunit-banner').trigger('click');
    equal(counter1, 2);
    equal(counter2, 2);

    view.delegateEvents(events);
    $('#qunit-banner').trigger('click');
    equal(counter1, 3);
    equal(counter2, 3);
  });

  test("delegateEvents allows functions for callbacks", 3, function() {
    view.counter = 0;
    view.setElement("#qunit-banner");

    var events = {
      click: function() { 
        this.counter++; 
      }
    };

    view.delegateEvents(events);
    $('#qunit-banner').trigger('click');
    equal(view.counter, 1);

    $('#qunit-banner').trigger('click');
    equal(view.counter, 2);

    view.delegateEvents(events);
    $('#qunit-banner').trigger('click');
    equal(view.counter, 3);
  });

  test("undelegateEvents", 6, function() {
    var counter1 = 0, counter2 = 0;

    view.setElement(document.body);
    view.increment = function() { counter1++; };

    $(view.el).unbind('click');
    $(view.el).bind('click', function() { counter2++; });

    var events = {"click #qunit-userAgent": "increment"};

    view.delegateEvents(events);
    $('#qunit-userAgent').trigger('click');
    equal(counter1, 1);
    equal(counter2, 1);

    view.undelegateEvents();
    $('#qunit-userAgent').trigger('click');
    equal(counter1, 1);
    equal(counter2, 2);

    view.delegateEvents(events);
    $('#qunit-userAgent').trigger('click');
    equal(counter1, 2);
    equal(counter2, 3);
  });

  test("_ensureElement with DOM node el", 1, function() {
    var View = Backbone.View.extend({
      el: document.body
    });

    equal(new View().el, document.body);
  });

  test("_ensureElement with string el", 3, function() {
    var View = Backbone.View.extend({
      el: "body"
    });
    strictEqual(new View().el, document.body);

    View = Backbone.View.extend({
      el: "#testElement > h1"
    });
    strictEqual(new View().el, $("#testElement > h1").get(0));

    View = Backbone.View.extend({
      el: "#nonexistent"
    });
    ok(!new View().el);
  });

  test("with className and id functions", 2, function() {
    var View = Backbone.View.extend({
      className: function() {
        return 'className';
      },
      id: function() {
        return 'id';
      }
    });

    strictEqual(new View().el.className, 'className');
    strictEqual(new View().el.id, 'id');
  });

  test("with attributes", 2, function() {
    var View = Backbone.View.extend({
      attributes : {'class': 'one', id: 'two'}
    });

    strictEqual(new View().el.className, 'one');
    strictEqual(new View().el.id, 'two');
  });

  test("with attributes as a function", 1, function() {
    var View = Backbone.View.extend({
      attributes: function() {
        return {'class': 'dynamic'};
      }
    });

    strictEqual(new View().el.className, 'dynamic');
  });

  test("multiple views per element", 3, function() {
    var count = 0;

    var View = Backbone.View.extend({
      el: $("body"),
      events: {
        "click": "click"
      },
      click: function() {
        count++;
      }
    });

    var view1 = new View;
    $("body").trigger("click");
    equal(1, count);

    var view2 = new View;
    $("body").trigger("click");
    equal(3, count);

    view1.delegateEvents();
    $("body").trigger("click");
    equal(5, count);
  });

  test("custom events, with namespaces", 2, function() {
    var count = 0;

    var View = Backbone.View.extend({
      el: $('body'),
      events: function() {
        return {"fake$event.namespaced": "run"};
      },
      run: function() {
        count++;
      }
    });

    var view = new View;
    $('body').trigger('fake$event').trigger('fake$event');
    equal(count, 2);

    $('body').unbind('.namespaced');
    $('body').trigger('fake$event');
    equal(count, 2);
  });

  test("#1048 - setElement uses provided object.", 2, function() {
    var $el = $('body');

    var view = new Backbone.View({el: $el});
    ok(view.$el === $el);

    view.setElement($el = $($el));
    ok(view.$el === $el);
  });

  test("#986 - Undelegate before changing element.", 1, function() {
    var button1 = $('<button></button>');
    var button2 = $('<button></button>');

    var View = Backbone.View.extend({
      events: {
        click: function(e) {
          ok(view.el === e.target);
        }
      }
    });

    var view = new View({el: button1});
    view.setElement(button2);

    button1.trigger('click');
    button2.trigger('click');
  });

  test("#1172 - Clone attributes object", 2, function() {
    var View = Backbone.View.extend({
      attributes: {foo: 'bar'}
    });

    var view1 = new View({id: 'foo'});
    strictEqual(view1.el.id, 'foo');

    var view2 = new View();
    ok(!view2.el.id);
  });

  test("#1228 - tagName can be provided as a function", 1, function() {
    var View = Backbone.View.extend({
      tagName: function() {
        return 'p';
      }
    });

    ok(new View().$el.is('p'));
  });

  test("dispose", 0, function() {
    var View = Backbone.View.extend({
      events: {
        click: function() { ok(false); }
      },
      initialize: function() {
        this.model.on('all x', function() { ok(false); }, this);
        this.collection.on('all x', function() { ok(false); }, this);
      }
    });

    var view = new View({
      model: new Backbone.Model,
      collection: new Backbone.Collection
    });

    view.dispose();
    view.model.trigger('x');
    view.collection.trigger('x');
    view.$el.click();
  });

  test("view#remove calls dispose.", 1, function() {
    var view = new Backbone.View();

    view.dispose = function() { ok(true); };
    view.remove();
  });

});