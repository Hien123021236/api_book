<a href="https://travis-ci.org/Xotic750/is-integer-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-integer-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-integer-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-integer-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-integer-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-integer-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-integer-x" title="npm version">
<img src="https://badge.fury.io/js/is-integer-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-integer-x"></a>

## is-integer-x
Determine whether the passed value is an integer.

**Version**: 1.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-integer-x--module.exports"></a>

### `module.exports(value)` ⇒ <code>boolean</code> ⏏
This method determines whether the passed value is an integer.

**Kind**: Exported function  
**Returns**: <code>boolean</code> - A Boolean indicating whether or not the given value is an integer.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be tested for being an integer. |

**Example**  
```js
var isInteger = require('is-integer-x');

isInteger(0);         // true
isInteger(1);         // true
isInteger(-100000);   // true

isInteger(0.1);       // false
isInteger(Math.PI);   // false

isInteger(NaN);       // false
isInteger(Infinity);  // false
isInteger(-Infinity); // false
isInteger('10');      // false
isInteger(true);      // false
isInteger(false);     // false
isInteger([1]);       // false
```
