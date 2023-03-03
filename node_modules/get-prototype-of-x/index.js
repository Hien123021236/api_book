/**
 * @file Sham for Object.getPrototypeOf
 * @version 1.4.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <https://opensource.org/licenses/MIT> MIT}
 * @module get-prototype-of-x
 */

'use strict';

var isFunction = require('is-function-x');
var isNull = require('lodash.isnull');
var toObject = require('to-object-x');
var gpo = require('cached-constructors-x').Object.getPrototypeOf;

if (gpo) {
  try {
    gpo = gpo(Object) === Object.prototype && gpo;
  } catch (ignore) {
    gpo = null;
  }
}

if (gpo) {
  try {
    gpo(1);
  } catch (ignore) {
    var $getPrototypeOf = gpo;
    gpo = function getPrototypeOf(obj) {
      return $getPrototypeOf(toObject(obj));
    };
  }
} else {
  gpo = function getPrototypeOf(obj) {
    var object = toObject(obj);
    // eslint-disable-next-line no-proto
    var proto = object.__proto__;
    if (proto || isNull(proto)) {
      return proto;
    }

    if (isFunction(object.constructor)) {
      return object.constructor.prototype;
    }

    if (object instanceof Object) {
      return Object.prototype;
    }

    return null;
  };
}

/**
 * This method returns the prototype (i.e. the value of the internal [[Prototype]] property)
 * of the specified object.
 *
 * @param {*} obj - The object whose prototype is to be returned.
 * @returns {Object} The prototype of the given object. If there are no inherited properties, null is returned.
 * @example
 * var getPrototypeOf = require('get-prototype-of-x');
 * getPrototypeOf('foo'); // String.prototype
 */
module.exports = gpo;
