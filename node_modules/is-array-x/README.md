<a href="https://travis-ci.org/Xotic750/is-array-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-array-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-array-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-array-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-array-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-array-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-array-x" title="npm version">
<img src="https://badge.fury.io/js/is-array-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-array-x"></a>

## is-array-x
Determines whether the passed value is an Array.

**Version**: 1.2.1  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-array-x--module.exports"></a>

### `module.exports` ⇒ <code>boolean</code> ⏏
The isArray() function determines whether the passed value is an Array.

**Kind**: Exported member  
**Returns**: <code>boolean</code> - `true` if the object is an Array; otherwise, `false`.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object to be checked.. |

**Example**  
```js
var isArray = require('is-array-x');

isArray([]); // true
isArray({}); // false
```
