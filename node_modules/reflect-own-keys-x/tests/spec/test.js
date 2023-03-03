'use strict';

var reflectOwnKeys;
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
  reflectOwnKeys = require('../../index.js');
} else {
  reflectOwnKeys = returnExports;
}

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
var ifSymbolsIt = hasSymbols ? it : xit;

describe('reflectOwnKeys', function () {
  it('is a function', function () {
    expect(typeof Reflect.ownKeys).toBe('function');
  });

  it('throws if the target isn’t an object', function () {
    expect(function () {
      reflectOwnKeys();
    }).toThrow();

    expect(function () {
      reflectOwnKeys(void 0);
    }).toThrow();

    expect(function () {
      reflectOwnKeys(null);
    }).toThrow();

    expect(function () {
      reflectOwnKeys(1);
    }).toThrow();

    expect(function () {
      reflectOwnKeys(true);
    }).toThrow();

    expect(function () {
      reflectOwnKeys('');
    }).toThrow();
  });

  it('should return the same result as Object.getOwnPropertyNames if there are no Symbols', function () {
    var obj = { bar: 1, foo: 2 };
    obj[1] = 'first';
    var result = Object.getOwnPropertyNames(obj);
    // Reflect.ownKeys depends on the implementation of
    // Object.getOwnPropertyNames, at least for non-symbol keys.
    expect(reflectOwnKeys(obj)).toEqual(result);
    // We can only be sure of which keys should exist.
    expect(result.sort()).toEqual([
      '1',
      'bar',
      'foo'
    ]);
  });

  ifSymbolsIt('symbols come last', function () {
    var s = Symbol('');
    var o = { 'non-symbol': true };
    o[s] = true;
    expect(reflectOwnKeys(o)).toEqual(['non-symbol', s]);
  });
});
