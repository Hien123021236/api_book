/**
 * @file Determines whether an array includes a certain element.
 * @version 1.0.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module array-includes-x
 */

'use strict';

var toObject = require('to-object-x');
var nativeIncludes = Array.prototype.includes;
var $includes;

if (nativeIncludes) {
  var arr = {
    1: 'a',
    2: NaN,
    3: -0,
    length: 5
  };

  try {
    if (nativeIncludes.call(arr, void 0, -1) && nativeIncludes.call(arr, NaN) && nativeIncludes.call('abc', 'c')) {
      $includes = function includes(array, searchElement) {
        var object = toObject(array);
        var args = [searchElement];
        if (arguments.length > 2) {
          args[1] = arguments[2];
        }

        return nativeIncludes.apply(object, args);
      };
    }
  } catch (ignore) {}
}

if (Boolean($includes) === false) {
  var isString = require('is-string');
  var isUndefined = require('validate.io-undefined');
  var toLength = require('to-length-x');
  var sameValueZero = require('same-value-zero-x');
  var findIndex = require('find-index-x');
  var splitString = require('has-boxed-string-x') === false;
  var indexOf = require('index-of-x');
  var calcFromIndex = require('calculate-from-index-x');

  /*
   * This method returns an index in the array, if an element in the array
   * satisfies the provided testing function. Otherwise -1 is returned.
   *
   * @private
   * @param {Array} object - The array to search.
   * @param {*} searchElement - Element to locate in the array.
   * @param {number} fromIndex - The index to start the search at.
   * @returns {number} Returns index of found element, otherwise -1.
   */
  var findIdxFrom = function findIndexFrom(object, searchElement, fromIndex) {
    var fIdx = fromIndex;
    var length = toLength(object.length);
    while (fIdx < length) {
      if (sameValueZero(object[fIdx], searchElement)) {
        return fIdx;
      }

      fIdx += 1;
    }

    return -1;
  };

  $includes = function includes(array, searchElement) {
    var object = toObject(array);
    var iterable = splitString && isString(object) ? object.split('') : object;
    var length = toLength(iterable.length);
    if (length < 1) {
      return -1;
    }

    if (isUndefined(searchElement)) {
      var fromIndex = calcFromIndex(iterable, arguments[2]);
      if (fromIndex >= length) {
        return -1;
      }

      if (fromIndex < 0) {
        fromIndex = 0;
      }

      if (fromIndex > 0) {
        return findIdxFrom(iterable, searchElement, fromIndex) > -1;
      }

      return findIndex(iterable, function (element) {
        return sameValueZero(searchElement, element);
      }) > -1;
    }

    return indexOf(iterable, searchElement, arguments[2], 'samevaluezero') > -1;
  };
}

/**
 * This method determines whether an array includes a certain element,
 * returning true or false as appropriate.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If `array` is `null` or `undefined`.
 * @param {*} searchElement - Element to locate in the `array`.
 * @param {number} [fromIndex] - The position in this array at which to begin
 *  searching for searchElement. A negative value searches from the index of
 *  array.length + fromIndex by asc. Defaults to 0.
 * @returns {boolean} `true` if searched element is included; otherwise `false`.
 * @example
 * var includes = require('array-includes-x');
 *
 * var subject = [2, 3, undefined, true, 'hej', null, 2, false, 0, -0, NaN];
 * includes(subject, undefined); // true
 * includes(subject, undefined, 3); // false
 * includes(subject, NaN); // true
 * includes(subject, 10); // false
 *
 */
module.exports = $includes;
