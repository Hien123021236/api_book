<a href="https://travis-ci.org/Xotic750/object-keys-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/object-keys-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/object-keys-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/object-keys-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/object-keys-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/object-keys-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/object-keys-x" title="npm version">
<img src="https://badge.fury.io/js/object-keys-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_object-keys-x"></a>

## object-keys-x
An ES6 Object.keys shim.

**Version**: 2.5.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_object-keys-x--module.exports"></a>

### `module.exports` ⇒ <code>Array</code> ⏏
This method returns an array of a given object's own enumerable properties,
in the same order as that provided by a for...in loop (the difference being
that a for-in loop enumerates properties in the prototype chain as well).

**Kind**: Exported member  
**Returns**: <code>Array</code> - An array of strings that represent all the enumerable properties of the given object.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object of which the enumerable own properties are to be returned. |

**Example**  
```js
var objectKeys = require('object-keys-x');

var obj = {
  arr: [],
  bool: true,
  'null': null,
  num: 42,
  obj: { },
  str: 'boz',
  undefined: void 0
};

objectKeys(obj); // ['arr', 'bool', 'null', 'num', 'obj', 'str', 'undefined']
```
