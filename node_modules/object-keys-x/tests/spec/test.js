'use strict';

var objectKeys;
if (typeof module === 'object' && module.exports) {
  require('es5-shim');
  require('es5-shim/es5-sham');
  if (typeof JSON === 'undefined') {
    JSON = {};
  }
  require('json3').runInContext(null, JSON);
  require('es6-shim');
  var es7 = require('es7-shim');
  Object.keys(es7).forEach(function (key) {
    var obj = es7[key];
    if (typeof obj.shim === 'function') {
      obj.shim();
    }
  });
  objectKeys = require('../../index.js');
} else {
  objectKeys = returnExports;
}

var has = Object.prototype.hasOwnProperty;
var supportsDescriptors = Object.defineProperty && (function () {
  try {
    var obj = {};
    Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
    // eslint-disable-next-line no-restricted-syntax
    for (var _ in obj) {
      return false;
    }

    return obj.x === obj;
  } catch (e) { /* this is ES3 */
    return false;
  }
}());

var ifWindowIt = typeof window === 'undefined' ? xit : it;

describe('objectKeys', function () {
  var obj = {
    arr: [],
    bool: true,
    'null': null,
    num: 42,
    obj: { },
    str: 'boz',
    undefined: void 0
  };

  var loopedValues = [];
  // eslint-disable-next-line no-restricted-syntax
  for (var key in obj) {
    loopedValues.push(key);
  }

  var keys = objectKeys(obj);
  it('should not throw for null or undefined', function () {
    expect(function () {
      objectKeys();
    }).toThrow();

    expect(function () {
      objectKeys(void 0);
    }).toThrow();

    expect(function () {
      objectKeys(null);
    }).toThrow();
  });

  it('should not throw for non-objects', function () {
    expect(objectKeys(1)).toEqual([]);
    expect(objectKeys(true)).toEqual([]);
    expect(objectKeys('')).toEqual([]);
  });

  it('should have correct length', function () {
    expect(keys.length).toBe(7);
  });

  describe('arguments objects', function () {
    it('works with an arguments object', function () {
      (function () {
        expect(arguments.length).toBe(3);
        expect(objectKeys(arguments).length).toBe(arguments.length);
        expect(objectKeys(arguments)).toEqual([
          '0',
          '1',
          '2'
        ]);
      }(1, 2, 3));
    });

    it('works with a legacy arguments object', function () {
      var FakeArguments = function (args) {
        args.forEach(function (arg, i) {
          this[i] = arg;
        }.bind(this));
      };
      FakeArguments.prototype.length = 3;
      FakeArguments.prototype.callee = function () {};

      var fakeOldArguments = new FakeArguments([
        'a',
        'b',
        'c'
      ]);
      expect(objectKeys(fakeOldArguments)).toEqual([
        '0',
        '1',
        '2'
      ]);
    });
  });

  it('should return an Array', function () {
    expect(Array.isArray(keys)).toBe(true);
  });

  it('should return names which are own properties', function () {
    keys.forEach(function (name) {
      expect(has.call(obj, name)).toBe(true);
    });
  });

  it('should return names which are enumerable', function () {
    keys.forEach(function (name) {
      expect(loopedValues.indexOf(name)).toNotBe(-1);
    });
  });

  // ES6 objectKeys does not require this throw
  xit('should throw error for non object', function () {
    var e = {};
    expect(function () {
      try {
        objectKeys(42);
      } catch (err) {
        throw e;
      }
    }).toThrow(e);
  });

  describe('enumerating over non-enumerable properties', function () {
    it('has no enumerable keys on a Function', function () {
      var Foo = function () {};
      expect(objectKeys(Foo.prototype)).toEqual([]);
    });

    it('has no enumerable keys on a boolean', function () {
      expect(objectKeys(Boolean.prototype)).toEqual([]);
    });

    it('has no enumerable keys on an object', function () {
      expect(objectKeys(Object.prototype)).toEqual([]);
    });
  });

  it('works with boxed primitives', function () {
    expect(objectKeys(Object('hello'))).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4'
    ]);
  });

  it('works with boxed primitives with extra properties', function () {
    var x = Object('x');
    x.y = 1;
    var actual = objectKeys(x);
    var expected = ['0', 'y'];
    actual.sort();
    expected.sort();
    expect(actual).toEqual(expected);
  });

  ifWindowIt('can serialize all objects on the `window`', function () {
    var windowItemKeys, exception;
    var excludedKeys = [
      'window',
      'console',
      'parent',
      'self',
      'frame',
      'frames',
      'frameElement',
      'external',
      'height',
      'width'
    ];
    if (supportsDescriptors) {
      Object.defineProperty(window, 'thrower', {
        configurable: true,
        get: function () { throw new RangeError('thrower!'); }
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (var k in window) {
      exception = void 0;
      windowItemKeys = exception;
      if (excludedKeys.indexOf(k) === -1 && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
        try {
          windowItemKeys = objectKeys(window[k]);
        } catch (e) {
          exception = e;
        }
        expect(Array.isArray(windowItemKeys)).toBe(true);
        expect(exception).toBeUndefined();
      }
    }
    if (supportsDescriptors) {
      delete window.thrower;
    }
  });
});
