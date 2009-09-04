/*
* Xccessors Standard v0.0.5: Cross-browser ECMAScript 5 accessors
* http://code.eligrey.com/xccessors/standard/
* 
* 2009-09-04
* 
* By Elijah Grey, http://eligrey.com
* 
* A shim that partially implements Object.defineProperty, Object.getOwnPropertyDescriptor, and Object.defineProperties
* in browsers that have legacy __(define|lookup)[GS]etter__ support.
* 
* License: GNU GPL v3 and the X11/MIT license
*   See COPYING.md
*/

/*jslint white: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */

"use strict";

(function () {
	var ObjectProto = Object.prototype,
	hasOwnProp = function (obj, prop) {
		return ObjectProto.hasOwnProperty.call(obj, prop);
	},
	True = true,
	defineGetter = ObjectProto.__defineGetter__,
	defineSetter = ObjectProto.__defineSetter__,
	lookupGetter = ObjectProto.__lookupGetter__,
	lookupSetter = ObjectProto.__lookupGetter__;
	
	if (defineGetter && defineSetter && lookupGetter && lookupSetter) {

		if (!Object.defineProperty) {
			Object.defineProperty = function (obj, prop, descriptor) {
				if (arguments.length < 3) { // all arguments required
					throw new TypeError("Argument not optional");
				}
				prop += ""; // convert prop to string

				if (hasOwnProp(descriptor, "value")) {
					!lookupGetter.call(obj, prop) &&
					!lookupSetter.call(obj, prop) &&
					// data property defined and no pre-existing accessors
						(obj[prop] = descriptor.value);

					if ((hasOwnProp(descriptor, "get") || hasOwnProp(descriptor, "set"))) {
						// descriptor has a value prop but accessor already exists
						throw new TypeError("Object doesn't support this action");
					}
				}

				// can't implement these features so throw a RangeError if any are true
				if (descriptor.writable || descriptor.enumerable || descriptor.configurable) {
					throw new RangeError("This implementation of Object.defineProperty does not support configurable, enumerable, or writable.");
				}
			
				descriptor.get &&
					defineGetter.call(obj, prop, descriptor.get);
			
				descriptor.set &&
					defineSetter.call(obj, prop, descriptor.set);
			
				return obj;
			};
		}

		if (!Object.getOwnPropertyDescriptor) {
			Object.getOwnPropertyDescriptor = function (obj, prop) {
				if (arguments.length < 2) { // all arguments required
					throw new TypeError("Argument not optional");
				}
				prop += ""; // convert prop to string

				var descriptor = {
					configurable: True,
					enumerable  : True,
					writable    : True
				},
				getter = lookupGetter.call(obj, prop),
				setter = lookupSetter.call(obj, prop);

				if (!hasOwnProp(obj, prop)) { // property doesn't exist or is inherited
					return descriptor;
				}
				if (!getter && !setter) { // not an accessor so return prop
					descriptor.value = obj[prop];
					return descriptor;
				}

				// there is an accessor, remove descriptor.writable; populate descriptor.get and descriptor.set
				delete descriptor.writable;
				descriptor.get = descriptor.set = undefined;

				getter &&
					(descriptor.get = getter);
				
				setter &&
					(descriptor.set = setter);
				
				return descriptor;
			};
		}

		if (!Object.defineProperties) {
			Object.defineProperties = function (obj, props) {
				for (var prop in props) {
					if (hasOwnProp(props, prop)) {
						Object.defineProperty(obj, prop, props[prop]);
					}
				}
			};
		}

	}
}());
