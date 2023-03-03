<a href="https://travis-ci.org/Xotic750/array-slice-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/array-slice-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-slice-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/array-slice-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/array-slice-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/array-slice-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/array-slice-x" title="npm version">
<img src="https://badge.fury.io/js/array-slice-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_array-slice-x"></a>

## array-slice-x
Cross-browser array slicer.

**Version**: 3.5.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_array-slice-x--module.exports"></a>

### `module.exports(array, [start], [end])` ⇒ <code>Array</code> ⏏
The slice() method returns a shallow copy of a portion of an array into a new
array object selected from begin to end (end not included). The original
array will not be modified.

**Kind**: Exported function  
**Returns**: <code>Array</code> - A new array containing the extracted elements.  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> \| <code>Object</code> | The array to slice. |
| [start] | <code>number</code> | Zero-based index at which to begin extraction.  A negative index can be used, indicating an offset from the end of the  sequence. slice(-2) extracts the last two elements in the sequence.  If begin is undefined, slice begins from index 0. |
| [end] | <code>number</code> | Zero-based index before which to end extraction.  Slice extracts up to but not including end. For example, slice(1,4)  extracts the second element through the fourth element (elements indexed  1, 2, and 3).  A negative index can be used, indicating an offset from the end of the  sequence. slice(2,-1) extracts the third element through the second-to-last  element in the sequence.  If end is omitted, slice extracts through the end of the  sequence (arr.length).  If end is greater than the length of the sequence, slice extracts through  the end of the sequence (arr.length). |

**Example**  
```js
var slice = require('array-slice-x');
var fruits = ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango'];
var citrus = slice(fruits, 1, 3);

// fruits contains ['Banana', 'Orange', 'Lemon', 'Apple', 'Mango']
// citrus contains ['Orange','Lemon']
```
