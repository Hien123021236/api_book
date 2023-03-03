/**
 * @file Calculates a fromIndex of a given value for an array.
 * @version 2.2.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module calculate-from-index-x
 */

'use strict';

var toObject = require('to-object-x');
var toLength = require('to-length-x').toLength2018;
var toInteger = require('to-integer-x').toInteger2018;
var isArrayLike = require('is-array-like-x');

var getMax = function _getMax(a, b) {
  return a >= b ? a : b;
};

/**
 * This method calculates a fromIndex of a given value for an array.
 *
 * @param {array} array * The array on which to calculate the starting index.
 * @throws {TypeError} If array is null or undefined.
 * @param {number} fromIndex * The position in this array at which to begin. A
 *  negative value gives the index of array.length + fromIndex by asc.
 * @returns {number} The calculated fromIndex. Default is 0.
 * @example
 * var calcFromIndex = require('calculate-from-index-x');
 *
 * calcFromIndex([1, 2, 3], 1); // 1
 * calcFromIndex([1, 2, 3], Infinity); // Infinity
 * calcFromIndex([1, 2, 3], -Infinity); // 0
 * calcFromIndex([1, 2, 3], -1); // 2
 */
module.exports = function calcFromIndex(array, fromIndex) {
  var object = toObject(array);
  if (isArrayLike(object) === false) {
    return 0;
  }

  var index = toInteger(fromIndex);

  return index >= 0 ? index : getMax(0, toLength(object.length) + index);
};
