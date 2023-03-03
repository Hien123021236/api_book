/**
 * @file Creates an array of all properties (enumerable or not) found directly upon a given object.
 * @version 2.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module get-own-property-names-x
 */

'use strict';

var toObject = require('to-object-x');
var nativeGOPN = typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames;

var getOPN;
if (nativeGOPN) {
  var attempt = require('attempt-x');
  var isArray = require('is-array-x');
  var isCorrectRes = function _isCorrectRes(r, length) {
    return r.threw === false && isArray(r.value) && r.value.length === length;
  };

  var either = function _either(r, a, b) {
    var x = r.value[0];
    var y = r.value[1];
    return (x === a && y === b) || (x === b && y === a);
  };

  var res = attempt(nativeGOPN, 'fo');
  if (isCorrectRes(res, 3) && either(res, '0', '1') && res.value[2] === 'length') {
    getOPN = nativeGOPN;
  } else {
    res = attempt(nativeGOPN, { a: 1, b: 2 });
    if (isCorrectRes(res, 2) && either(res, 'a', 'b')) {
      var toStringTag = require('to-string-tag-x');
      var arraySlice = require('array-slice-x');
      var win = typeof window === 'object' && window;
      var cachedWindowNames = win ? nativeGOPN(win) : [];

      getOPN = function getOwnPropertyNames(obj) {
        var val = toObject(obj);
        // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
        if (win && win !== window && toStringTag(val) === '[object Window]') {
          var result = attempt(nativeGOPN, val);
          return result.threw ? arraySlice(cachedWindowNames) : result.value;
        }

        return nativeGOPN(val);
      };
    }
  }
}

if (typeof getOPN !== 'function') {
  var objectKeys = require('object-keys-x');
  getOPN = function getOwnPropertyNames(obj) {
    return objectKeys(obj);
  };
}

/**
 * This method creates an array of all properties (enumerable or not) found
 * directly upon a given object.
 *
 * @param {object} obj - The object whose enumerable and non-enumerable own
 *  properties are to be returned.
 * @throws {TypeError} If target is null or undefined.
 * @returns {array} An array of strings that correspond to the properties found
 *  directly upon the given object.
 * @example
 * var getOwnPropertyName = require('get-own-property-name-x');
 *
 * getOwnPropertyNames('foo'); // ["0", "1", "2", "length"]
 */
module.exports = getOPN;
