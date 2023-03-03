<a href="https://travis-ci.org/Xotic750/array-includes-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/array-includes-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-includes-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-includes-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-includes-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-includes-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/array-includes-x" title="npm version">
<img src="https://badge.fury.io/js/array-includes-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_array-includes-x"></a>

## array-includes-x
Determines whether an array includes a certain element.

**Version**: 1.0.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_array-includes-x--module.exports"></a>

### `module.exports` ⇒ <code>boolean</code> ⏏
This method determines whether an array includes a certain element,
returning true or false as appropriate.

**Kind**: Exported member  
**Returns**: <code>boolean</code> - `true` if searched element is included; otherwise `false`.  
**Throws**:

- <code>TypeError</code> If `array` is `null` or `undefined`.


| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | The array to search. |
| searchElement | <code>\*</code> | Element to locate in the `array`. |
| [fromIndex] | <code>number</code> | The position in this array at which to begin  searching for searchElement. A negative value searches from the index of  array.length + fromIndex by asc. Defaults to 0. |

**Example**  
```js
var includes = require('array-includes-x');

var subject = [2, 3, undefined, true, 'hej', null, 2, false, 0, -0, NaN];
includes(subject, undefined); // true
includes(subject, undefined, 3); // false
includes(subject, NaN); // true
includes(subject, 10); // false
```
