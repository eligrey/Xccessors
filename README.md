Xccessors (cross-browser accessors) is an open source JavaScript shim that implements the legacy or standard methods for defining and looking up accessors (getters and setters) of objects.

**Please note**: Internet Explorer 8 only supports getters and setters on the DOM and it’s prototypes (document, Element.prototype, etc.) and the window object. As long as you are setting an accessor on the window object, a DOM element, or a DOM prototype, Xccessors should work fine on every browser.

Xccessors Standard
------------------

Xcessors Standard implements ECMAScript 5’s (formerly 3.1) accessors standard (Object.defineProperty and Object.getOwnPropertyDescriptor) in browsers that support the legacy non-standard accessor methods. Everything behaves according to the ECMAScript 5 standard except the configurable, enumerable, and writable options. It is impossible to implement these options without native support for Object.defineProperty. The good news is that you are never going to use them if you are changing a JavaScript program from the legacy to standard methods.

Xccessors Legacy
----------------

Xccessors Legacy implements the legacy accessor methods (object.__define[GS]etter__ and object.__lookup[GS]etter__) in browsers that support the standard ECMAScript 5 accessor methods.
