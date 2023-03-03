/**
 * @file Determines whether the passed value is an Array.
 * @version 1.2.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-array-x
 */

'use strict';

var nativeIsArray = typeof Array.isArray === 'function' && Array.isArray;

var testRes = nativeIsArray && require('attempt-x')(function () {
  return nativeIsArray([]) === true && nativeIsArray({ length: 0 }) === false;
});

var $isArray;
if (testRes && testRes.threw === false && testRes.value === true) {
  $isArray = nativeIsArray;
} else {
  var toStringTag = require('to-string-tag-x');
  $isArray = function isArray(obj) {
    return toStringTag(obj) === '[object Array]';
  };
}

/**
 * The isArray() function determines whether the passed value is an Array.
 *
 * @param {*} obj - The object to be checked..
 * @returns {boolean} `true` if the object is an Array; otherwise, `false`.
 * @example
 * var isArray = require('is-array-x');
 *
 * isArray([]); // true
 * isArray({}); // false
 */
module.exports = $isArray;
