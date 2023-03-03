'use strict';

var defineProperties;
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
  defineProperties = require('../../index.js');
} else {
  defineProperties = returnExports;
}

describe('defineProperties', function () {
  it('should define the constructor property', function () {
    var target = {};
    var newProperties = { constructor: { value: 'new constructor' } };
    defineProperties(target, newProperties);
    expect(target.constructor).toBe('new constructor');
  });
});
