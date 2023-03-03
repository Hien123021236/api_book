'use strict';

var hasBoxedString;
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
  hasBoxedString = require('../../index.js');
} else {
  hasBoxedString = returnExports;
}

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object('a');
var splitString = boxedString[0] !== 'a' || (0 in boxedString) === false;

describe('hasBoxedString', function () {
  it('is a boolean', function () {
    expect(typeof hasBoxedString).toBe('boolean');
  });

  it('should match original test', function () {
    expect(hasBoxedString).toBe(splitString === false);
  });
});
