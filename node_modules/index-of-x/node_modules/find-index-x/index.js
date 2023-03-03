/**
 * @file This method returns the index of the first element in the array that satisfies the provided testing function.
 * @version 2.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module find-index-x
 */

'use strict';

var pFindIndex = typeof Array.prototype.findIndex === 'function' && Array.prototype.findIndex;

var isWorking;
if (pFindIndex) {
  var attempt = require('attempt-x');
  var testArr = [];
  testArr.length = 2;
  testArr[1] = 1;
  var res = attempt.call(testArr, pFindIndex, function (item, idx) {
    return idx === 0;
  });

  isWorking = res.threw === false && res.value === 0;

  if (isWorking) {
    res = attempt.call(1, pFindIndex, function (item, idx) {
      return idx === 0;
    });

    isWorking = res.threw === false && res.value === -1;
  }

  if (isWorking) {
    isWorking = attempt.call([], pFindIndex).threw;
  }

  if (isWorking) {
    res = attempt.call('abc', pFindIndex, function (item) {
      return item === 'c';
    });

    isWorking = res.threw === false && res.value === 2;
  }

  if (isWorking) {
    res = attempt.call((function () {
      return arguments;
    }('a', 'b', 'c')), pFindIndex, function (item) {
      return item === 'c';
    });

    isWorking = res.threw === false && res.value === 2;
  }
}

var findIdx;
if (isWorking) {
  findIdx = function findIndex(array, callback) {
    var args = [callback];
    if (arguments.length > 2) {
      args[1] = arguments[2];
    }

    return pFindIndex.apply(array, args);
  };
} else {
  var toLength = require('to-length-x');
  var toObject = require('to-object-x');
  var assertIsFunction = require('assert-is-function-x');
  var splitIfBoxedBug = require('split-if-boxed-bug-x');

  findIdx = function findIndex(array, callback) {
    var object = toObject(array);
    assertIsFunction(callback);
    var iterable = splitIfBoxedBug(object);
    var length = toLength(iterable.length);
    if (length < 1) {
      return -1;
    }

    var thisArg;
    if (arguments.length > 2) {
      thisArg = arguments[2];
    }

    var index = 0;
    while (index < length) {
      if (callback.call(thisArg, iterable[index], index, object)) {
        return index;
      }

      index += 1;
    }

    return -1;
  };
}

/**
 * Like `findIndex`, this method returns an index in the array, if an element
 * in the array satisfies the provided testing function. Otherwise -1 is returned.
 *
 * @param {Array} array - The array to search.
 * @throws {TypeError} If array is `null` or `undefined`-
 * @param {Function} callback - Function to execute on each value in the array,
 *  taking three arguments: `element`, `index` and `array`.
 * @throws {TypeError} If `callback` is not a function.
 * @param {*} [thisArg] - Object to use as `this` when executing `callback`.
 * @returns {number} Returns index of positively tested element, otherwise -1.
 * @example
 * var findIndex = require('find-index-x');
 *
 * function isPrime(element, index, array) {
 *   var start = 2;
 *   while (start <= Math.sqrt(element)) {
 *     if (element % start++ < 1) {
 *       return false;
 *     }
 *   }
 *   return element > 1;
 * }
 *
 * console.log(findIndex([4, 6, 8, 12, 14], isPrime)); // -1, not found
 * console.log(findIndex([4, 6, 7, 12, 13], isPrime)); // 2
 */
module.exports = findIdx;
