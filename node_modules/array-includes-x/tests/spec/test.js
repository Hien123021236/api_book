'use strict';

var includes;
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
  includes = require('../../index.js');
} else {
  includes = returnExports;
}

describe('includes', function () {
  it('is a function', function () {
    expect(typeof includes).toBe('function');
  });

  it('should throw when target is null or undefined', function () {
    expect(function () {
      includes();
    }).toThrow();

    expect(function () {
      includes(void 0);
    }).toThrow();

    expect(function () {
      includes(null);
    }).toThrow();
  });

  var sparseish = {
    0: 'a',
    1: 'b',
    length: 5
  };

  var overfullarrayish = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 2
  };

  var numberish = {
    valueOf: function () {
      return 2;
    }
  };

  it('simple examples', function () {
    expect(includes([
      1,
      2,
      3
    ], 1)).toBe(true, '[1, 2, 3] includes 1');
    expect(includes([
      1,
      2,
      3
    ], 4)).toBe(false, '[1, 2, 3] does not include 4');
    expect(includes([NaN], NaN)).toBe(true, '[NaN] includes NaN');
  });

  it('does not skip holes', function () {
    expect(includes(Array(1))).toBe(true, 'Array(1) includes undefined');
  });

  it('arraylike', function () {
    expect(includes(sparseish, 'a')).toBe(true, 'sparse array-like object includes "a"');
    expect(includes(sparseish, 'c')).toBe(false, 'sparse array-like object does not include "c"');

    expect(includes(overfullarrayish, 'b')).toBe(true, 'sparse array-like object includes "b"');
    expect(includes(overfullarrayish, 'c')).toBe(false, 'sparse array-like object does not include "c"');

    expect(includes('abc', 'c')).toBe(true, 'string includes "c"');
  });

  describe('fromIndex', function () {
    expect(includes([1], 1, NaN)).toBe(true, 'NaN fromIndex -> 0 fromIndex');

    it('number coercion', function () {
      expect(includes([
        'a',
        'b',
        'c'
      ], 'a', numberish)).toBe(false, 'does not find "a" with object fromIndex coercing to 2');
      expect(includes([
        'a',
        'b',
        'c'
      ], 'a', '2')).toBe(false, 'does not find "a" with string fromIndex coercing to 2');
      expect(includes([
        'a',
        'b',
        'c'
      ], 'c', numberish)).toBe(true, 'finds "c" with object fromIndex coercing to 2');
      expect(includes([
        'a',
        'b',
        'c'
      ], 'c', '2')).toBe(true, 'finds "c" with string fromIndex coercing to 2');
    });

    it('fromIndex greater than length', function () {
      expect(includes([1], 1, 2)).toBe(false, 'array of length 1 is not searched if fromIndex is > 1');
      expect(includes([1], 1, 1)).toBe(false, 'array of length 1 is not searched if fromIndex is >= 1');
      expect(includes([1], 1, 1.1)).toBe(false, 'array of length 1 is not searched if fromIndex is 1.1');
      expect(includes([1], 1, Infinity)).toBe(false, 'array of length 1 is not searched if fromIndex is Infinity');
    });

    it('negative fromIndex', function () {
      expect(includes([1, 3], 1, -4)).toBe(true, 'computed length would be negative; fromIndex is thus 0');
      expect(includes([1, 3], 3, -4)).toBe(true, 'computed length would be negative; fromIndex is thus 0');
      expect(includes([1, 3], 1, -Infinity)).toBe(true, 'computed length would be negative; fromIndex is thus 0');

      expect(includes([12, 13], 13, -1)).toBe(true, 'finds -1st item with -1 fromIndex');
      expect(includes([12, 13], 12, -1)).toBe(false, 'does not find -2nd item with -1 fromIndex');
      expect(includes([12, 13], 13, -2)).toBe(true, 'finds -2nd item with -2 fromIndex');

      expect(includes(sparseish, 'b', -4)).toBe(true, 'finds -4th item with -4 fromIndex');
      expect(includes(sparseish, 'a', -4)).toBe(false, 'does not find -5th item with -4 fromIndex');
      expect(includes(sparseish, 'a', -5)).toBe(true, 'finds -5th item with -5 fromIndex');
    });
  });
});
