/*
 * Xccessors Legacy: Cross-browser legacy non-standard accessors
 * http://github.com/eligrey/Xccessors
 * 
 * 2010-03-21
 * 
 * By Elijah Grey, http://eligrey.com
 *
 * A shim that implements __defineGetter__, __defineSetter__, __lookupGetter__,
 * and __lookupSetter__
 * in browsers that have ECMAScript 5 accessor support but not the legacy methods.
 * 
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/*global Element, Window, HTMLDocument */

/*jslint white: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true,
  strict: true, newcap: true, immed: true, maxlen: 90 */

"use strict";

(function () {
	var
	defineProp = Object.defineProperty,
	getProp    = Object.getOwnPropertyDescriptor,

	// methods being implemented
	methods    = [
		"__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"
	],

	// objects to implement legacy methods onto their prototypes
	// Object.prototype[method] doesn't work on everything for IE
	extend     = [Object, String, Array, Function, Boolean, Number,
	             RegExp, Date, Error, Element, Window, HTMLDocument],
	len        = extend.length,
	proto      = "prototype",
	extendMethod = function (method, fun) {
		var i = len;
		if (!(method in {})) {
			while (i--) {
				extend[i][proto][method] = fun;
			}
		}
	};

	if (defineProp) {
		extendMethod(methods[0], function (prop, fun) { // __defineGetter__
			defineProp(this, prop, { get: fun });
		});
		
		extendMethod(methods[1], function (prop, fun) { // __defineSetter__
			defineProp(this, prop, { set: fun });
		});
	}
	
	if (getProp) {
		extendMethod(methods[2], function (prop) { // __lookupGetter__
			return getProp(this, prop).get ||
				getProp(this.constructor[proto], prop).get; // look in prototype too
		});
		extendMethod(methods[3], function (prop) { // __lookupSetter__
			return getProp(this, prop).set ||
				getProp(this.constructor[proto], prop).set; // look in prototype too
		});
	}
}());
