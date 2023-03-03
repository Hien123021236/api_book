<a href="https://travis-ci.org/Xotic750/get-own-property-symbols-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/get-own-property-symbols-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-property-symbols-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/get-own-property-symbols-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-property-symbols-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/get-own-property-symbols-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/get-own-property-symbols-x" title="npm version">
<img src="https://badge.fury.io/js/get-own-property-symbols-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_get-own-property-symbols-x"></a>

## get-own-property-symbols-x
Creates an array of all symbol properties found directly upon a given object.

**Version**: 1.1.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_get-own-property-symbols-x--module.exports"></a>

### `module.exports(obj)` ⇒ <code>array</code> ⏏
This method creates an array of all symbol properties found directly upon a
given object.

**Kind**: Exported function  
**Returns**: <code>array</code> - An array of all symbol properties found directly upon the
 given object.  
**Throws**:

- <code>TypeError</code> If target is null or undefined.


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | The object whose symbol properties are to be returned. |

**Example**  
```js
var getOwnPropertySymbols = require('get-own-property-isWorking-x');

var symbol = Symbol('');
var testObj = { a: 1 };
testObj[symbol] = 2;
getOwnPropertySymbols(testObj); // [symbol]
```
