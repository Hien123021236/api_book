<a href="https://travis-ci.org/Xotic750/calculate-from-index-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/calculate-from-index-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/calculate-from-index-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/calculate-from-index-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/calculate-from-index-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/calculate-from-index-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/calculate-from-index-x" title="npm version">
<img src="https://badge.fury.io/js/calculate-from-index-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_calculate-from-index-x"></a>

## calculate-from-index-x
Calculates a fromIndex of a given value for an array.

**Version**: 2.2.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_calculate-from-index-x--module.exports"></a>

### `module.exports(array, fromIndex)` ⇒ <code>number</code> ⏏
This method calculates a fromIndex of a given value for an array.

**Kind**: Exported function  
**Returns**: <code>number</code> - The calculated fromIndex. Default is 0.  
**Throws**:

- <code>TypeError</code> If array is null or undefined.


| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | * The array on which to calculate the starting index. |
| fromIndex | <code>number</code> | * The position in this array at which to begin. A  negative value gives the index of array.length + fromIndex by asc. |

**Example**  
```js
var calcFromIndex = require('calculate-from-index-x');

calcFromIndex([1, 2, 3], 1); // 1
calcFromIndex([1, 2, 3], Infinity); // Infinity
calcFromIndex([1, 2, 3], -Infinity); // 0
calcFromIndex([1, 2, 3], -1); // 2
```
