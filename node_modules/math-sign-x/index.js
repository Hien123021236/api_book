/**
 * @file ES6-compliant shim for Math.sign.
 * @see {@link http://www.ecma-international.org/ecma-262/6.0/#sec-math.sign|20.2.2.29 Math.sign(x)}
 * @version 1.3.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module math-sign-x
 */

'use strict';

var $isNaN = require('is-nan');

var $sign;
if (typeof Math.sign === 'function') {
  try {
    if (Math.sign(10) === 1 && Math.sign(-10) === -1 && Math.sign(0) === 0) {
      $sign = Math.sign;
    }
  } catch (ignore) {}
}

/**
 * This method returns the sign of a number, indicating whether the number is positive,
 * negative or zero.
 *
 * @param {*} x - A number.
 * @returns {number} A number representing the sign of the given argument. If the argument
 * is a positive number, negative number, positive zero or negative zero, the function will
 * return 1, -1, 0 or -0 respectively. Otherwise, NaN is returned.
 * @example
 * var mathSign = require('math-sign-x');
 *
 * mathSign(3);     //  1
 * mathSign(-3);    // -1
 * mathSign('-3');  // -1
 * mathSign(0);     //  0
 * mathSign(-0);    // -0
 * mathSign(NaN);   // NaN
 * mathSign('foo'); // NaN
 * mathSign();      // NaN
 */
module.exports = $sign || function sign(x) {
  var n = Number(x);
  if (n === 0 || $isNaN(n)) {
    return n;
  }

  return n > 0 ? 1 : -1;
};
