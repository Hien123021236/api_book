/**
 * @file Pads a string with another string (repeated, if needed).
 * @version 1.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module string-pad-start-x
 */

'use strict';

var requireObjectCoercible = require('require-object-coercible-x');
var toStr = require('to-string-x');
var toLength = require('to-length-x').toLength2018;
var isUndefined = require('validate.io-undefined');
var strSlice = String.prototype.slice;

/**
 * This method pads the current string with another string (repeated, if needed)
 * so that the resulting string reaches the given length. The padding is applied
 * from the start (left) of the current string.
 *
 * @param {string} string - The string to pad.
 * @throws {TypeError} If target is null or undefined.
 * @param {number} targetLength - The length of the resulting string once the
 *  current string has been padded. If the value is lower than the current
 *  string's length, the current string will be returned as is.
 * @param {string} [padString] - The string to pad the current string with. If
 *  this string is too long to stay within the target length, it will be
 *  truncated and the left-most part will be applied. The default value for this
 *  parameter is " " (U+0020).
 * @returns {string} A String of the specified length with the pad string
 *  applied from the start.
 * @example
 * var padStart = require('string-pad-start-x');
 *
 * padStart('a', 3, 'b'); // 'bba'
 * padStart('a', 3); // '  a'
 * padStart('a', 2, 'bc'); // 'ba'
 */
module.exports = function padStart(string, targetLength) {
  var str = toStr(requireObjectCoercible(string));
  var stringLength = toLength(str.length);
  var fillString;
  if (arguments.length > 2) {
    fillString = arguments[2];
  }

  var filler = isUndefined(fillString) ? '' : toStr(fillString);
  if (filler === '') {
    filler = ' ';
  }

  var intMaxLength = toLength(targetLength);
  if (intMaxLength <= stringLength) {
    return str;
  }

  var fillLen = intMaxLength - stringLength;
  while (filler.length < fillLen) {
    var fLen = filler.length;
    var remainingCodeUnits = fillLen - fLen;
    filler += fLen > remainingCodeUnits ? strSlice.call(filler, 0, remainingCodeUnits) : filler;
  }

  var truncatedStringFiller = filler.length > fillLen ? strSlice.call(filler, 0, fillLen) : filler;

  return truncatedStringFiller + str;
};
