<a href="https://travis-ci.org/Xotic750/get-own-property-names-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/get-own-property-names-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-property-names-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/get-own-property-names-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/get-own-property-names-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/get-own-property-names-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/get-own-property-names-x" title="npm version">
<img src="https://badge.fury.io/js/get-own-property-names-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_get-own-property-names-x"></a>

## get-own-property-names-x
Creates an array of all properties (enumerable or not) found directly upon a given object.

**Version**: 1.0.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_get-own-property-names-x--module.exports"></a>

### `module.exports` ⇒ <code>array</code> ⏏
This method creates an array of all properties (enumerable or not) found
directly upon a given object.

**Kind**: Exported member  
**Returns**: <code>array</code> - An array of strings that correspond to the properties found
 directly upon the given object.  
**Throws**:

- <code>TypeError</code> If target is null or undefined.


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>object</code> | The object whose enumerable and non-enumerable own  properties are to be returned. |

**Example**  
```js
var getOwnPropertyName = require('get-own-property-name-x');

getOwnPropertyNames('foo'); // ["0", "1", "2", "length"]
```
