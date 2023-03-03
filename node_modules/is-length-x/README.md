<a href="https://travis-ci.org/Xotic750/is-length-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-length-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-length-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-length-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-length-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-length-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-length-x" title="npm version">
<img src="https://badge.fury.io/js/is-length-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-length-x"></a>

## is-length-x
Checks if `value` is a valid array-like length.

**Version**: 2.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-length-x--module.exports"></a>

### `module.exports(value)` ⇒ <code>boolean</code> ⏏
This method checks if `value` is a valid array-like length.

**Kind**: Exported function  
**Returns**: <code>boolean</code> - Returns `true` if `value` is a valid length, else `false`.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to check. |

**Example**  
```js
var isLength = require('is-length-x');

isLength(3); // => true
isLength(Number.MIN_VALUE); // => false
isLength(Infinity); // => false
isLength('3'); // => false
```
