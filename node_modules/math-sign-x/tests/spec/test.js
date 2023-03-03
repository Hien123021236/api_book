'use strict';

var mathSign;
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
  mathSign = require('../../index.js');
} else {
  mathSign = returnExports;
}

var ifFunctionsHaveNamesIt = function foo() {}.name === 'foo' ? it : xit;

var isPositiveZero = function (zero) {
  return zero === 0 && 1 / zero === Infinity;
};

var isNegativeZero = function (zero) {
  return zero === 0 && 1 / zero === -Infinity;
};

var numberIsNaN = function (value) {
  return value !== value;
};

describe('mathSign', function () {
  ifFunctionsHaveNamesIt('has the right name', function () {
    expect(mathSign.name).toBe('sign');
  });

  it('has the right arity', function () {
    expect(mathSign.length).toBe(1);
  });

  it('should be correct', function () {
    // we also verify that [[ToNumber]] is being called
    [Infinity, 1].forEach(function (value) {
      expect(mathSign(value)).toBe(1);
      expect(mathSign(String(value))).toBe(1);
    });
    expect(mathSign(true)).toBe(1);

    [-Infinity, -1].forEach(function (value) {
      expect(mathSign(value)).toBe(-1);
      expect(mathSign(String(value))).toBe(-1);
    });

    expect(isPositiveZero(mathSign(+0))).toBe(true);
    expect(isPositiveZero(mathSign('0'))).toBe(true);
    expect(isPositiveZero(mathSign('+0'))).toBe(true);
    expect(isPositiveZero(mathSign(''))).toBe(true);
    expect(isPositiveZero(mathSign(' '))).toBe(true);
    expect(isPositiveZero(mathSign(null))).toBe(true);
    expect(isPositiveZero(mathSign(false))).toBe(true);
    expect(isNegativeZero(mathSign(-0))).toBe(true);
    expect(isNegativeZero(mathSign('-0'))).toBe(true);
    expect(numberIsNaN(mathSign(NaN))).toBe(true);
    expect(numberIsNaN(mathSign('NaN'))).toBe(true);
    expect(numberIsNaN(mathSign(undefined))).toBe(true);
  });
});
