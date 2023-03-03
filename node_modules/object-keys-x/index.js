/**
 * @file An ES6 Object.keys shim.
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-keys-x
 */

'use strict';

var isArguments = require('is-arguments');
var toObject = require('to-object-x');
var originalKeys = Object.keys;

try {
  var arr = originalKeys({ a: 1, b: 2 });
  if (arr.length !== 2 || arr[0] !== 'a' || arr[1] !== 'b') {
    throw new Error('failed keys');
  }
} catch (ignore) {
  originalKeys = require('object-keys');
}

var keysWorksWithArguments = (function () {
  // Safari 5.0 bug
  return originalKeys(arguments).length === 2;
}(1, 2));

var keysHasArgumentsLengthBug = (function () {
  var argKeys = originalKeys(arguments);
  return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
}(1));

var objectKeys;
if (!keysWorksWithArguments || keysHasArgumentsLengthBug) {
  var arraySlice = Array.prototype.slice;
  objectKeys = function keys(object) {
    var obj = toObject(object);
    if (isArguments(object)) {
      return originalKeys(arraySlice.call(obj));
    }

    return originalKeys(obj);
  };
} else {
  objectKeys = function keys(object) {
    return originalKeys(toObject(object));
  };
}

/**
 * This method returns an array of a given object's own enumerable properties,
 * in the same order as that provided by a for...in loop (the difference being
 * that a for-in loop enumerates properties in the prototype chain as well).
 *
 * @param {*} obj The object of which the enumerable own properties are to be returned.
 * @return {Array} An array of strings that represent all the enumerable properties of the given object.
 * @example
 * var objectKeys = require('object-keys-x');
 *
 * var obj = {
 *   arr: [],
 *   bool: true,
 *   'null': null,
 *   num: 42,
 *   obj: { },
 *   str: 'boz',
 *   undefined: void 0
 * };
 *
 * objectKeys(obj); // ['arr', 'bool', 'null', 'num', 'obj', 'str', 'undefined']
 */
module.exports = objectKeys;
