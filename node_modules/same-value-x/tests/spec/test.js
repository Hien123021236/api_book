'use strict';

var sameValue;
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
  sameValue = require('../../index.js');
} else {
  sameValue = returnExports;
}

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('') === 'symbol';
var itHasSymbols = hasSymbols ? it : xit;

describe('sameValue', function () {
  it('sameValue a function', function () {
    expect(typeof sameValue).toBe('function');
  });

  it('works with primitives', function () {
    expect(sameValue()).toBe(true, 'two absent args are the same');
    expect(sameValue(undefined)).toBe(true, 'undefined & one absent arg are the same');
    expect(sameValue(undefined, undefined)).toBe(true, 'undefined sameValue undefined');
    expect(sameValue(null, null)).toBe(true, 'null sameValue null');
    expect(sameValue(true, true)).toBe(true, 'true sameValue true');
    expect(sameValue(false, false)).toBe(true, 'false sameValue false');
    expect(sameValue(true, false)).toBe(false, 'true sameValue not false');
  });

  it('works with NaN', function () {
    expect(sameValue(NaN, NaN)).toBe(true, 'NaN sameValue NaN');
  });

  it('differentiates zeroes', function () {
    expect(sameValue(0, 0)).toBe(true, '+0 sameValue +0');
    expect(sameValue(-0, -0)).toBe(true, '-0 sameValue -0');
    expect(sameValue(0, -0)).toBe(false, '+0 sameValue not -0');
  });

  it('nonzero numbers', function () {
    expect(sameValue(Infinity, Infinity)).toBe(true, 'infinity sameValue infinity');
    expect(sameValue(-Infinity, -Infinity)).toBe(true, 'infinity sameValue infinity');
    expect(sameValue(42, 42)).toBe(true, '42 sameValue 42');
    expect(sameValue(42, -42)).toBe(false, '42 sameValue not -42');
  });

  it('strings', function () {
    expect(sameValue('', '')).toBe(true, 'empty string sameValue empty string');
    expect(sameValue('foo', 'foo')).toBe(true, 'string sameValue string');
    expect(sameValue('foo', 'bar')).toBe(false, 'string sameValue not different string');
  });

  it('objects', function () {
    var obj = {};
    expect(sameValue(obj, obj)).toBe(true, 'object sameValue same object');
    expect(sameValue(obj, {})).toBe(false, 'object sameValue not different object');
  });

  itHasSymbols('Symbols', function () {
    expect(sameValue(Symbol.iterator, Symbol.iterator)).toBe(true, 'Symbol.iterator sameValue itself');
    expect(sameValue(Symbol(''), Symbol(''))).toBe(false, 'different Symbols are not equal');
    expect(sameValue(Symbol.iterator, Object(Symbol.iterator))).toBe(false, 'Symbol.iterator sameValue not boxed form of itself');
  });
});
