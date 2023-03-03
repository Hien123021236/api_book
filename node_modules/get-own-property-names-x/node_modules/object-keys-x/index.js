/**
 * @file An ES6 Object.keys shim.
 * @version 2.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module object-keys-x
 */

'use strict';

var toObject = require('to-object-x');
var nativeKeys = typeof Object.keys === 'function' && Object.keys;

var isWorking;
var throwsWithNull;
var worksWithPrim;
var worksWithRegex;
var worksWithArgs;
var worksWithStr;
if (nativeKeys) {
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

  var testObj = { a: 1, b: 2 };
  var res = attempt(nativeKeys, testObj);
  isWorking = isCorrectRes(res, 2) && either(res, 'a', 'b');

  if (isWorking) {
    testObj = Object('a');
    testObj.y = 1;
    res = attempt(nativeKeys, testObj);
    isWorking = isCorrectRes(res, 2) && either(res, '0', 'y');
  }

  if (isWorking) {
    throwsWithNull = attempt(nativeKeys, null).threw;
    worksWithPrim = isCorrectRes(attempt(nativeKeys, 42), 0);
    worksWithRegex = attempt(nativeKeys, /a/g).threw === false;

    res = attempt(nativeKeys, (function () {
      return arguments;
    }(1, 2)));

    worksWithArgs = isCorrectRes(res, 2) && either(res, '0', '1');

    res = attempt(nativeKeys, Object('ab'));
    worksWithStr = isCorrectRes(res, 2) && either(res, '0', '1');
  }
}

var objectKeys;
if (isWorking) {
  if (throwsWithNull && worksWithPrim && worksWithRegex && worksWithArgs && worksWithStr) {
    objectKeys = nativeKeys;
  } else {
    var isArguments = worksWithArgs !== true && require('is-arguments');
    var arraySlice = isArguments && require('array-like-slice-x');
    var splitIfBoxed = worksWithStr !== true && require('split-if-boxed-bug-x');
    var isString = splitIfBoxed && require('is-string');
    var isRegexp = worksWithRegex !== true && require('is-regexp-x');
    var has = isRegexp && require('has-own-property-x');

    objectKeys = function keys(object) {
      var obj = toObject ? toObject(object) : object;
      if (isArguments && isArguments(obj)) {
        obj = arraySlice(obj);
      } else if (isString && isString(obj)) {
        obj = splitIfBoxed(obj);
      } else if (isRegexp && isRegexp(obj)) {
        var regexKeys = [];
        // eslint-disable-next-line no-restricted-syntax
        for (var k in obj) {
          if (has(obj, k)) {
            regexKeys[regexKeys.length] = k;
          }
        }

        return regexKeys;
      }

      return nativeKeys(obj);
    };
  }
} else {
  var objKeys = require('object-keys');
  objectKeys = function keys(object) {
    return objKeys(toObject(object));
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
