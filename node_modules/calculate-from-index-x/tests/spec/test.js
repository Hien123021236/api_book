'use strict';

var calcFromIndex;
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
  calcFromIndex = require('../../index.js');
} else {
  calcFromIndex = returnExports;
}

describe('calcFromIndex', function () {
  it('is a function', function () {
    expect(typeof calcFromIndex).toBe('function');
  });

  it('should throw when target not undefined', function () {
    expect(function () {
      calcFromIndex();
    }).toThrow();

    expect(function () {
      calcFromIndex(void 0);
    }).toThrow();

    expect(function () {
      calcFromIndex(null);
    }).toThrow();
  });

  it('should return the correct values for array-like objects', function () {
    var subjects = [
      'abc',
      [
        1,
        2,
        3
      ],
      {
        0: 1, 1: 2, 2: 3, length: 3
      }
    ];

    var values = [
      -Infinity,
      -1,
      0,
      1,
      Infinity,
      NaN,
      void 0,
      null,
      '',
      '10',
      false,
      true
    ];

    var exs = [
      0,
      2,
      0,
      1,
      Infinity,
      0,
      0,
      0,
      0,
      10,
      0,
      1
    ];

    var expected = subjects.map(function (subject) {
      return values.map(function (value) {
        return calcFromIndex(subject, value);
      });
    });

    var actual = subjects.map(function () {
      return exs;
    });

    expect(actual).toEqual(expected);
  });

  it('should return the correct values non array-like objects', function () {
    var subjects = [
      1,
      true,
      function (a, b) {
        return b;
      },
      /abc/i,
      new Date()
    ];

    var values = [
      -Infinity,
      -1,
      0,
      1,
      Infinity,
      NaN,
      void 0,
      null,
      '',
      '10',
      false,
      true
    ];

    var expected = subjects.map(function () {
      return values.map(function () {
        return 0;
      });
    });

    var actual = subjects.map(function (subject) {
      return values.map(function (value) {
        return calcFromIndex(subject, value);
      });
    });

    expect(actual).toEqual(expected);
  });
});
