/**
 * @file Creates an array of all properties (enumerable or not) found directly upon a given object.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module get-own-property-names-x
 */

'use strict';

var toObject = require('to-object-x');
var nativeGOPN = Object.getOwnPropertyNames;

var $gopn;
if (typeof nativeGOPN === 'function') {
  // eslint-disable-next-line id-length
  var objectGOPNAcceptsPrimitives;
  try {
    nativeGOPN('foo');
    objectGOPNAcceptsPrimitives = true;
  } catch (ignore) {}

  if (objectGOPNAcceptsPrimitives) {
    $gopn = nativeGOPN;
  } else {
    var toStringTag = require('to-string-tag-x');
    var concat = Array.prototype.concat;
    var cachedWindowNames = typeof window === 'object' ? nativeGOPN(window) : [];

    $gopn = function getOwnPropertyNames(obj) {
      var val = toObject(obj);
      if (toStringTag(val) === '[object Window]') {
        try {
          return nativeGOPN(val);
        } catch (ignore) {
          // IE bug where layout engine calls userland gOPN for cross-domain `window` objects
          return concat.call([], cachedWindowNames);
        }
      }

      return nativeGOPN(val);
    };
  }
} else {
  var objectKeys = require('object-keys-x');
  $gopn = function getOwnPropertyNames(obj) {
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
module.exports = $gopn;
