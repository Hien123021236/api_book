/**
 * @file Determine whether the passed value is a safe integer.
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-safe-integer-x
 */

'use strict';

var isInteger = require('is-integer-x');
var MAX_SAFE_INTEGER = require('max-safe-integer');
var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;

/**
 * This method determines whether the passed value is a safe integer.
 *
 * Can be exactly represented as an IEEE-754 double precision number, and
 * whose IEEE-754 representation cannot be the result of rounding any other
 * integer to fit the IEEE-754 representation.
 *
 * @param {*} value - The value to be tested for being a safe integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is a
 *  safe integer.
 * @example
 * var isSafeInteger = require('is-safe-integer-x');
 *
 * isSafeInteger(0);                    // true
 * isSafeInteger(1);                    // true
 * isSafeInteger(-100000);              // true
 *
 * isSafeInteger(Math.pow(2, 53));      // false
 * isSafeInteger(0.1);                  // false
 * isSafeInteger(Math.PI);              // false
 *
 * isSafeInteger(NaN);                  // false
 * isSafeInteger(Infinity);             // false
 * isSafeInteger(-Infinity);            // false
 * isSafeInteger('10');                 // false
 * isSafeInteger(true);                 // false
 * isSafeInteger(false);                // false
 * isSafeInteger([1]);                  // false
 */
module.exports = function isSafeInteger(value) {
  return isInteger(value) && value >= MIN_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
};
