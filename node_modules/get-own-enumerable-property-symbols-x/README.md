<a href="https://travis-ci.org/Xotic750/get-own-enumerable-property-symbols-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/get-own-enumerable-property-symbols-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-enumerable-property-symbols-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/get-own-enumerable-property-symbols-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-enumerable-property-symbols-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/get-own-enumerable-property-symbols-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/get-own-enumerable-property-symbols-x" title="npm version">
<img src="https://badge.fury.io/js/get-own-enumerable-property-symbols-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_get-own-enumerable-property-symbols-x"></a>

## get-own-enumerable-property-symbols-x
Like Object.getOwnPropertySymbols but gets only enumerable properties.

**Version**: 1.0.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_get-own-enumerable-property-symbols-x--module.exports"></a>

### `module.exports(target)` ⇒ <code>Array</code> ⏏
This method returns only the enumerable own property symbols of an object.

**Kind**: Exported function  
**Returns**: <code>Array</code> - The enumerable own property symbols.  
**Throws**:

- <code>typeError</code> - If target is null or undefined.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target. |

**Example**  
```js
var getOwnEnumerablePropertySymbols = require('get-own-enumerable-property-symbols-x');

var obj = { bar: 1, foo: 2 };

var symbol1 = Symbol('first');
Object.defineProperty(obj, symbo1l, {
  enumerable: false,
  value: 'first'
});

var symbol2 = Symbol('second');
Object.defineProperty(obj, symbol2, {
  enumerable: true,
  value: 'second'
});

getOwnEnumerablePropertySymbols(obj); // [symbol2]
```
