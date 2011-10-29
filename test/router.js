$(document).ready(function() {

  module("Backbone.Router");

  var Router = Backbone.Router.extend({

    routes: {
      "search/:query":              "search",
      "search/:query/p:page":       "search",
      "splat/*args/end":            "splat",
      "*first/complex-:part/*rest": "complex",
      ":entity?*args":              "query",
      "*anything":                  "anything"
    },

    initialize : function(options) {
      this.testing = options.testing;
    },

    search : function(query, page) {
      this.query = query;
      this.page = page;
    },

    splat : function(args) {
      this.args = args;
    },

    complex : function(first, part, rest) {
      this.first = first;
      this.part = part;
      this.rest = rest;
    },

    query : function(entity, args) {
      this.entity    = entity;
      this.queryArgs = args;
    },

    anything : function(whatever) {
      this.anything = whatever;
    }

  });

  Backbone.history = null;
  var router = new Router({testing: 101});

  Backbone.history.interval = 9;
  Backbone.history.start({pushState: false});

  test("Router: initialize", function() {
    equals(router.testing, 101);
  });

  asyncTest("Router: routes (simple)", 4, function() {
    
    Backbone.history.bind('route', function(r, fragment, args) {
      equals(fragment, "search/news");
      ok(_.isEqual(r, router));
    });
    window.location.hash = 'search/news';

    setTimeout(function() {
      equals(router.query, 'news');
      equals(router.page, undefined);
      Backbone.history.unbind('route');
      start();
    }, 10);
  });

  asyncTest("Router: routes (two part)", 5, function() {
    Backbone.history.bind('route', function(r, fragment, args) {
      equals(fragment, 'search/nyc/p10');
      ok(_.isEqual(args, ["nyc", "10"]));
      ok(_.isEqual(r, router));
    });
    window.location.hash = 'search/nyc/p10';
    
    setTimeout(function() {
      equals(router.query, 'nyc', "Should be nyc is actually " + router.query);
      equals(router.page, '10', "Should be 10, is actually", router.page);
      Backbone.history.unbind('route');
      start();
    }, 10);
  });

  test("Router: routes via navigate", 5, function() {

    Backbone.history.bind('route', function(r, fragment, args) {
      equals(fragment, 'search/manhattan/p20');
      ok(_.isEqual(args, ["manhattan", "20"]));
      ok(_.isEqual(r, router));
    });

    Backbone.history.navigate('search/manhattan/p20', true);
    Backbone.history.unbind('route');
    equals(router.query, 'manhattan');
    equals(router.page, '20');
  });

  asyncTest("Router: routes (splats)", function() {

    Backbone.history.bind('route', function(r, fragment, args) {
      equals(fragment, 'splat/long-list/of/splatted_99args/end');
      ok(_.isEqual(args, ["long-list/of/splatted_99args"]));
      ok(_.isEqual(r, router));
    });

    window.location.hash = 'splat/long-list/of/splatted_99args/end';
    setTimeout(function() {
      equals(router.args, 'long-list/of/splatted_99args');
      Backbone.history.unbind('route');
      start();
    }, 10);
  });

  asyncTest("Router: routes (complex)", 3, function() {
    window.location.hash = 'one/two/three/complex-part/four/five/six/seven';
    setTimeout(function() {
      equals(router.first, 'one/two/three');
      equals(router.part, 'part');
      equals(router.rest, 'four/five/six/seven');
      start();
    }, 10);
  });

  asyncTest("Router: routes (query)", 2, function() {
    window.location.hash = 'mandel?a=b&c=d';
    setTimeout(function() {
      equals(router.entity, 'mandel');
      equals(router.queryArgs, 'a=b&c=d');
      start();
    }, 10);
  });

  asyncTest("Router: routes (anything)", 1, function() {
    window.location.hash = 'doesnt-match-a-route';
    setTimeout(function() {
      equals(router.anything, 'doesnt-match-a-route');
      start();
      window.location.hash = '';
    }, 10);
  });

});
