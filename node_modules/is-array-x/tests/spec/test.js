'use strict';

var isArray;
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
  isArray = require('../../index.js');
} else {
  isArray = returnExports;
}

var hasSymbol = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
var ifSymbolIt = hasSymbol ? it : xit;

var itDocument = typeof document === 'undefined' ? xit : it;

describe('isArray', function () {
  it('is a function', function () {
    expect(typeof isArray).toBe('function');
  });

  it('should be true for Array', function () {
    expect(isArray([])).toBe(true);
  });

  it('should be false for primitives', function () {
    var primitives = [
      'foo',
      true,
      false,
      42,
      0,
      -0,
      NaN,
      Infinity,
      -Infinity,
      null,
      undefined
    ];

    var expected = primitives.map(function () {
      return false;
    });

    var actual = primitives.map(function (primitive) {
      return isArray(primitive);
    });

    expect(actual).toEqual(expected);
  });

  it('should fail for other objects', function () {
    var objects = [
      {},
      /foo/,
      arguments,
      Object.create(null),
      new Date(),
      function () {},
      { length: 0 }
    ];

    var expected = objects.map(function () {
      return false;
    });

    var actual = objects.map(function (object) {
      return isArray(object);
    });

    expect(actual).toEqual(expected);
  });

  itDocument('should be false for an HTML element', function () {
    expect(isArray(document.getElementsByTagName('div'))).toBe(false);
  });

  ifSymbolIt('should be false for Symbol', function () {
    var sym = Symbol('foo');
    expect(isArray(sym)).toBe(false);
    expect(isArray(Object(sym))).toBe(false);
  });
});
