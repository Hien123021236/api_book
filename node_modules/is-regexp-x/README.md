<a href="https://travis-ci.org/Xotic750/is-regexp-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-regexp-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-regexp-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-regexp-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-regexp-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-regexp-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-regexp-x" title="npm version">
<img src="https://badge.fury.io/js/is-regexp-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-regexp-x"></a>

## is-regexp-x
Is this value a JS regex?

**Version**: 2.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-regexp-x--module.exports"></a>

### `module.exports(value)` ⇒ <code>boolean</code> ⏏
This method tests if a value is a regex.

**Kind**: Exported function  
**Returns**: <code>boolean</code> - `true` if value is a regex; otherwise `false`.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to test. |

**Example**  
```js
var isRegex = require('is-regexp-x');

isRegex(undefined); // false
isRegex(null); // false
isRegex(false); // false
isRegex(true); // false
isRegex(42); // false
isRegex('foo'); // false
isRegex(function () {}); // false
isRegex([]); // false
isRegex({})); // false

isRegex(/a/g); // true
isRegex(new RegExp('a', 'g')); // true
```
