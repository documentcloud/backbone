$(document).ready(function() {

  module("Backbone.Router");

  var Router = Backbone.Router.extend({

    routes: {
      "noCallback":                 "noCallback",
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

    // do not provide a callback method for the noCallback route

  });

  Backbone.history = null;
  var router = new Router({testing: 101});

  Backbone.history.interval = 9;
  Backbone.history.start({pushState: false});

  test("Router: initialize", function() {
    equals(router.testing, 101);
  });

  asyncTest("Router: routes (simple)", 2, function() {
    window.location.hash = 'search/news';
    setTimeout(function() {
      equals(router.query, 'news');
      equals(router.page, undefined);
      start();
    }, 10);
  });

  asyncTest("Router: routes (two part)", 2, function() {
    window.location.hash = 'search/nyc/p10';
    setTimeout(function() {
      equals(router.query, 'nyc');
      equals(router.page, '10');
      start();
    }, 10);
  });

  test("Router: routes via navigate", 3, function() {
    router.navigate('search/manhattan/p20', true);
    equals(router.query, 'manhattan');
    equals(router.page, '20');
    equals(window.location.hash, '#search/manhattan/p20');
  });

  asyncTest("Router: routes (splats)", function() {
    window.location.hash = 'splat/long-list/of/splatted_99args/end';
    setTimeout(function() {
      equals(router.args, 'long-list/of/splatted_99args');
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

  asyncTest("Router: fires event when router doesn't have callback on it", 1, function() {
    try{
      var callbackFired = false;
      var myCallback = function(){ callbackFired = true; }
      router.bind("route:noCallback", myCallback);
      window.location.hash = "noCallback";
      setTimeout(function(){
        equals(callbackFired, true);
        window.location.hash = '';
        start(2);
      }, 10);
    } catch (err) {
      ok(false, "an exception was thrown trying to fire the router event with no router handler callback");
    }
  });

  // test Router's discreet mode

  var Router = Backbone.Router.extend({

    routes: {
      "find/:query":              "find",
    },

    find : function(query) {
      this.query = query;
    },

  });

  var discreetRouter = new Router({discreet: true});

  test("Router: discreet mode, routes via navigate", 2, function() {
    discreetRouter.navigate('find/paris', true);
    equals(discreetRouter.query, 'paris');
    equals(window.location.hash, '');
    delete discreetRouter.query;
  });

  asyncTest("Router: discreet mode, setting url hash", 1, function() {
    window.location.hash = 'find/amsterdam';
    setTimeout(function() {
      equals(discreetRouter.query, undefined);
      start();
    }, 10);
  });

});
