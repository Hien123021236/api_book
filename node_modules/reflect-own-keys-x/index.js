/**
 * @file Sham for Reflect.ownKeys
 * @version 1.5.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module reflect-own-keys-x
 */

'use strict';

var hasReflect = require('has-reflect-support-x');
var reflectOwnKeys = hasReflect && Reflect.ownKeys;

if (reflectOwnKeys) {
  try {
    var k = reflectOwnKeys({ a: 1, b: 2 }).sort();
    if (k.length !== 2 || k[0] !== 'a' || k[1] !== 'b') {
      throw new Error('failed');
    }
  } catch (ignore) {
    reflectOwnKeys = null;
  }
}

if (Boolean(reflectOwnKeys) === false) {
  var assertIsObject = require('assert-is-object-x');
  var getOwnPropertyNames = require('get-own-property-names-x');
  var getOwnPropertySymbols = require('get-own-property-symbols-x');
  var concat = Array.prototype.concat;

  reflectOwnKeys = function ownKeys(target) {
    assertIsObject(target);
    return concat.call(getOwnPropertyNames(target), getOwnPropertySymbols(target));
  };
}

/**
 * This method returns an array of the target object's own property keys.
 * Its return value is equivalent to
 * Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)).
 *
 * @param {*} target - The target object from which to get the own keys.
 * @throws {TypeError} If target is not an Object.
 * @returns {Object} An Array of the target object's own property keys.
 * @example
 * var reflectOwnKeys = require('reflect-own-keys-x');
 * reflectOwnKeys({ a: 1, b: 2 }); // ['a', 'b']
 */
module.exports = reflectOwnKeys;
