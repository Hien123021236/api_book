<a href="https://travis-ci.org/Xotic750/is-safe-integer-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-safe-integer-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-safe-integer-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-safe-integer-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-safe-integer-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-safe-integer-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-safe-integer-x" title="npm version">
<img src="https://badge.fury.io/js/is-safe-integer-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-safe-integer-x"></a>

## is-safe-integer-x
Determine whether the passed value is a safe integer.

**Version**: 1.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-safe-integer-x--module.exports"></a>

### `module.exports(value)` ⇒ <code>boolean</code> ⏏
This method determines whether the passed value is a safe integer.

Can be exactly represented as an IEEE-754 double precision number, and
whose IEEE-754 representation cannot be the result of rounding any other
integer to fit the IEEE-754 representation.

**Kind**: Exported function  
**Returns**: <code>boolean</code> - A Boolean indicating whether or not the given value is a
 safe integer.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be tested for being a safe integer. |

**Example**  
```js
var isSafeInteger = require('is-safe-integer-x');

isSafeInteger(0);                    // true
isSafeInteger(1);                    // true
isSafeInteger(-100000);              // true

isSafeInteger(Math.pow(2, 53));      // false
isSafeInteger(0.1);                  // false
isSafeInteger(Math.PI);              // false

isSafeInteger(NaN);                  // false
isSafeInteger(Infinity);             // false
isSafeInteger(-Infinity);            // false
isSafeInteger('10');                 // false
isSafeInteger(true);                 // false
isSafeInteger(false);                // false
isSafeInteger([1]);                  // false
```
