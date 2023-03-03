'use strict';

var splitIfBoxedBug;
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
  splitIfBoxedBug = require('../../index.js');
} else {
  splitIfBoxedBug = returnExports;
}

var boxedString = Object('a');
var hasBoxedString = boxedString[0] === 'a' && (0 in boxedString);
var itBoxed = hasBoxedString ? it : xit;
var itBug = hasBoxedString === false ? it : xit;

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var coercibleObject = {
  toString: function () {
    return 42;
  },
  valueOf: function () {
    return 3;
  }
};

var valueOfOnlyObject = {
  toString: function () {
    return {};
  },
  valueOf: function () {
    return 4;
  }
};

var toStringOnlyObject = {
  toString: function () {
    return 7;
  },
  valueOf: function () {
    return {};
  }
};

var objects = [
  {},
  coercibleObject,
  toStringOnlyObject,
  valueOfOnlyObject
];
var nullPrimitives = [void 0, null];
var numbers = [
  0,
  -0,
  Infinity,
  -Infinity,
  42
];

var strings = ['', 'foo'];
var booleans = [true, false];
var symbols = hasSymbols ? [Symbol.iterator, Symbol('foo')] : [];
var nonStrings = [].concat(nullPrimitives, booleans, numbers, symbols, objects);

describe('splitIfBoxedBug', function () {
  it('is a function', function () {
    expect(typeof splitIfBoxedBug).toBe('function');
  });

  it('should return value for non-strings', function () {
    expect(nonStrings.map(splitIfBoxedBug)).toEqual(nonStrings);
  });

  itBoxed('should return strings', function () {
    expect(strings.map(splitIfBoxedBug)).toEqual(strings);
  });

  itBug('should return array of characters', function () {
    var expected = strings.map(function (item) {
      return item.split('');
    });

    expect(strings.map(splitIfBoxedBug)).toEqual(expected);
  });
});
