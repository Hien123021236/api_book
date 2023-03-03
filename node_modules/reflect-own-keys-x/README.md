<a href="https://travis-ci.org/Xotic750/reflect-own-keys-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/reflect-own-keys-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/reflect-own-keys-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/reflect-own-keys-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/reflect-own-keys-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/reflect-own-keys-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/reflect-own-keys-x" title="npm version">
<img src="https://badge.fury.io/js/reflect-own-keys-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_reflect-own-keys-x"></a>

## reflect-own-keys-x
Sham for Reflect.ownKeys

**Version**: 1.5.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_reflect-own-keys-x--module.exports"></a>

### `module.exports` ⇒ <code>Object</code> ⏏
This method returns an array of the target object's own property keys.
Its return value is equivalent to
Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target)).

**Kind**: Exported member  
**Returns**: <code>Object</code> - An Array of the target object's own property keys.  
**Throws**:

- <code>TypeError</code> If target is not an Object.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>\*</code> | The target object from which to get the own keys. |

**Example**  
```js
var reflectOwnKeys = require('reflect-own-keys-x');
reflectOwnKeys({ a: 1, b: 2 }); // ['a', 'b']
```
