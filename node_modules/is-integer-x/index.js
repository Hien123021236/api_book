/**
 * @file Determine whether the passed value is an integer.
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module is-integer-x
 */

'use strict';

var numberIsFinite = require('is-finite-x');
var toInteger = require('to-integer-x').toInteger2018;

/**
 * This method determines whether the passed value is an integer.
 *
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean} A Boolean indicating whether or not the given value is an integer.
 * @example
 * var isInteger = require('is-integer-x');
 *
 * isInteger(0);         // true
 * isInteger(1);         // true
 * isInteger(-100000);   // true
 *
 * isInteger(0.1);       // false
 * isInteger(Math.PI);   // false
 *
 * isInteger(NaN);       // false
 * isInteger(Infinity);  // false
 * isInteger(-Infinity); // false
 * isInteger('10');      // false
 * isInteger(true);      // false
 * isInteger(false);     // false
 * isInteger([1]);       // false
 */
module.exports = function isInteger(value) {
  return numberIsFinite(value) && toInteger(value) === value;
};
