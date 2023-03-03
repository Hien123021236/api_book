/**
 * @file Checks if `value` is a valid array-like length.
 * @version 2.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-length-x
 */

'use strict';

var isSafeInteger = require('is-safe-integer-x');

/**
 * This method checks if `value` is a valid array-like length.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 * var isLength = require('is-length-x');
 *
 * isLength(3); // => true
 * isLength(Number.MIN_VALUE); // => false
 * isLength(Infinity); // => false
 * isLength('3'); // => false
 */
module.exports = function isLength(value) {
  return isSafeInteger(value) && value >= 0;
};
