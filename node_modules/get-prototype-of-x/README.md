<a href="https://travis-ci.org/Xotic750/get-prototype-of-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/get-prototype-of-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-prototype-of-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/get-prototype-of-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-prototype-of-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/get-prototype-of-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/get-prototype-of-x" title="npm version">
<img src="https://badge.fury.io/js/get-prototype-of-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_get-prototype-of-x"></a>

## get-prototype-of-x
Sham for Object.getPrototypeOf

**Version**: 1.4.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_get-prototype-of-x--module.exports"></a>

### `module.exports` ⇒ <code>Object</code> ⏏
This method returns the prototype (i.e. the value of the internal [[Prototype]] property)
of the specified object.

**Kind**: Exported member  
**Returns**: <code>Object</code> - The prototype of the given object. If there are no inherited properties, null is returned.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object whose prototype is to be returned. |

**Example**  
```js
var getPrototypeOf = require('get-prototype-of-x');
getPrototypeOf('foo'); // String.prototype
```
