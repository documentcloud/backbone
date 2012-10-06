//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org


// Save a reference to the global object (`window` in the browser, `global`
// on the server).
var root = this;

// Save the previous value of the `Backbone` variable, so that it can be
// restored later on, if `noConflict` is used.
var previousBackbone = root.Backbone;

// Create a local reference to array methods.
var ArrayProto = Array.prototype;
var push = ArrayProto.push;
var slice = ArrayProto.slice;
var splice = ArrayProto.splice;

// The top-level namespace. All public Backbone classes and modules will
// be attached to this. Exported for both CommonJS and the browser.
var Backbone;
if (typeof exports !== 'undefined') {
  Backbone = exports;
} else {
  Backbone = root.Backbone = {};
}

// Current version of the library. Keep in sync with `package.json`.
Backbone.VERSION = '0.9.2';

// Require Underscore, if we're on the server, and it's not already present.
var _ = root._;
if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

// For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
Backbone.$ = root.jQuery || root.Zepto || root.ender;

// Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
// to its previous owner. Returns a reference to this Backbone object.
Backbone.noConflict = function() {
  root.Backbone = previousBackbone;
  return this;
};

// Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
// will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
// set a `X-Http-Method-Override` header.
Backbone.emulateHTTP = false;

// Turn on `emulateJSON` to support legacy servers that can't deal with direct
// `application/json` requests ... will encode the body as
// `application/x-www-form-urlencoded` instead and will send the model in a
// form param named `model`.
Backbone.emulateJSON = false;
