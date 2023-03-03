'use strict';

var findIndex;
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
  findIndex = require('../../index.js');
} else {
  findIndex = returnExports;
}

describe('findIndex', function () {
  var list = [
    5,
    10,
    15,
    20
  ];

  it('should have a length of 2', function () {
    expect(findIndex.length).toBe(2);
  });

  it('should find item key by predicate', function () {
    var result = findIndex(list, function (item) {
      return item === 15;
    });
    expect(result).toBe(2);
  });

  it('should return -1 when nothing matched', function () {
    var result = findIndex(list, function (item) {
      return item === 'a';
    });
    expect(result).toBe(-1);
  });

  it('should throw TypeError when function was not passed', function () {
    expect(function () {
      list.findIndex();
    }).toThrow();
  });

  it('should receive all three parameters', function () {
    var index = findIndex(list, function (value, idx, arr) {
      expect(list[idx]).toBe(value);
      expect(list).toEqual(arr);
      return false;
    });
    expect(index).toBe(-1);
  });

  it('should work with the context argument', function () {
    var context = {};
    findIndex([1], function () {
      // eslint-disable-next-line no-invalid-this
      expect(this).toBe(context);
    }, context);
  });

  it('should work with an array-like object', function () {
    var obj = {
      0: 1, 1: 2, 2: 3, length: 3
    };
    var foundIndex = findIndex(obj, function (item) {
      return item === 2;
    });
    expect(foundIndex).toBe(1);
  });

  it('should work with an array-like object with negative length', function () {
    var obj = {
      0: 1, 1: 2, 2: 3, length: -3
    };
    var foundIndex = findIndex(obj, function (item) {
      throw new Error('should not reach here ' + item);
    });
    expect(foundIndex).toBe(-1);
  });

  it('should work with a sparse array', function () {
    // eslint-disable-next-line no-sparse-arrays
    var obj = [
      1, , undefined
    ];
    expect(1 in obj).toBe(false);
    var seen = [];
    var foundIndex = findIndex(obj, function (item, idx) {
      seen.push([idx, item]);
      return item === undefined && idx === 2;
    });
    expect(foundIndex).toBe(2);
    expect(seen).toEqual([
      [0, 1],
      [1, undefined],
      [2, undefined]
    ]);
  });

  it('should work with a sparse array-like object', function () {
    var obj = {
      0: 1, 2: undefined, length: 3.2
    };
    var seen = [];
    var foundIndex = findIndex(obj, function (item, idx) {
      seen.push([idx, item]);
      return false;
    });
    expect(foundIndex).toBe(-1);
    expect(seen).toEqual([
      [0, 1],
      [1, undefined],
      [2, undefined]
    ]);
  });
});
