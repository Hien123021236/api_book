'use strict';

var getOwnPropertyNames;
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
  getOwnPropertyNames = require('../../index.js');
} else {
  getOwnPropertyNames = returnExports;
}

describe('getOwnPropertyNames', function () {
  it('is a function', function () {
    expect(typeof getOwnPropertyNames).toBe('function');
  });

  it('should throw when target is null or undefined', function () {
    expect(function () {
      getOwnPropertyNames();
    }).toThrow();

    expect(function () {
      getOwnPropertyNames(void 0);
    }).toThrow();

    expect(function () {
      getOwnPropertyNames(null);
    }).toThrow();
  });

  it('should return an array matching that of an es-shimmed environment', function () {
    var values = [
      1,
      true,
      'abc',
      [],
      {},
      function () {},
      /abc/,
      new Date()
    ];

    var expected = values.map(Object.getOwnPropertyNames);

    var actual = values.map(getOwnPropertyNames);

    expect(actual).toEqual(expected);
  });
});
