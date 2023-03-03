/**
 * @file Determines whether two values are the same value.
 * @version 1.0.1
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module same-value-x
 */

'use strict';

var numberIsNaN = require('is-nan-x');

/**
 * This method is the comparison abstract operation SameValue(x, y), where x
 * and y are ECMAScript language values, produces true or false.
 *
 * @param {*} value1 - The first value to compare.
 * @param {*} value2 - The second value to compare.
 * @returns {boolean} A Boolean indicating whether or not the two arguments are
 *  the same value.
 * @example
 * var sameValue = require('same-value-x');
 *
 * sameValue(1, 1); // true
 * sameValue(true, true); // true
 * sameValue(NaN, NaN); // true
 * sameValue(true, false); // false
 * sameValue(0, -0); // false
 */
module.exports = function sameValue(value1, value2) {
  if (value1 === 0 && value2 === 0) {
    return 1 / value1 === 1 / value2;
  }

  if (value1 === value2) {
    return true;
  }

  return numberIsNaN(value1) && numberIsNaN(value2);
};
