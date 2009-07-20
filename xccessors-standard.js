/*
* Xccessors Standard v0.0.4: Cross-browser ECMAScript 5 accessors
* http://code.eligrey.com/xccessors/standard/
*
* 2009-06-16
*
* By Elijah Grey, http://eligrey.com
*
* A shim that partially implements Object.defineProperty, Object.getOwnPropertyDescriptor, and Object.defineProperties
* in browsers that have legacy __(define|lookup)[GS]etter__ support.
*
* License: GNU GPL v3 and the X11/MIT license
*   See http://eligrey.com/blog/about/license
*/


(function() {
	var ObjectProto = Object.prototype,
	hasOwnProp = function (obj, prop) {
		return ObjectProto.hasOwnProperty.call(obj, prop);
	};
	
	if (ObjectProto.__defineGetter__ && ObjectProto.__defineSetter__ && ObjectProto.__lookupGetter__ && ObjectProto.__lookupSetter__) {

		if (!Object.defineProperty) Object.defineProperty = function (obj, prop, descriptor) {
			if (arguments.length < 3) // all arguments required
				throw new TypeError("Argument not optional");

			prop += ""; // convert prop to string

			if (typeof descriptor == "object") { // check for descriptor object
				if (hasOwnProp(descriptor, "value")) {
					if (!ObjectProto.__lookupGetter__.call(obj, prop) && !ObjectProto.__lookupSetter__.call(obj, prop))
						obj[prop] = descriptor.value; // data property defined and no pre-existing accessors

					if((hasOwnProp(descriptor, "get") || hasOwnProp(descriptor, "set"))) // descriptor has a value prop but accessor already exists
						throw new TypeError("Object doesn't support this action");
				}

				// can't implement these features so throw a RangeError if any are true
				if (descriptor.writable === true || descriptor.enumerable === true || descriptor.configurable === true)
					throw new RangeError("This implementation of Object.defineProperty does not support configurable, enumerable, or writable.");

				else if (typeof descriptor.get == "function")
					ObjectProto.__defineGetter__.call(obj, prop, descriptor.get);

				if (typeof descriptor.set == "function")
					ObjectProto.__defineSetter__.call(obj, prop, descriptor.set);
			}
			return obj;
		};


		if (!Object.getOwnPropertyDescriptor) Object.getOwnPropertyDescriptor = function (obj, prop) {
			if (arguments.length < 2) // all arguments required
				throw new TypeError("Argument not optional")

			prop += ""; // convert prop to string

			var descriptor = {configurable: true, enumerable: true, writable: true, value: undefined},
			getter = ObjectProto.__lookupGetter__.call(obj, prop),
			setter = ObjectProto.__lookupSetter__.call(obj, prop);

			if (!hasOwnProp(obj, prop)) // property doesn't exist or is inherited
				return descriptor;

			if (!getter && !setter) { // not an accessor so return prop
				descriptor.value = obj[prop];
				return descriptor;
			}

			// there is an accessor, remove descriptor.writable; populate descriptor.get and descriptor.set
			delete descriptor.writable;
			delete descriptor.value;
			descriptor.get = descriptor.set = undefined;

			if (getter)
				descriptor.get = getter;

			if (setter)
				descriptor.set = setter;

			return descriptor;
		};

		if (!Object.defineProperties) Object.defineProperties = function (obj, props) {
			for (var prop in props)
				if (hasOwnProp(props, prop))
					Object.defineProperty(obj, prop, props[prop]);
		}

	}
})();
