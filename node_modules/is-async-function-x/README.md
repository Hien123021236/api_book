<a href="https://travis-ci.org/Xotic750/is-async-function-x"
   title="Travis status">
<img
   src="https://travis-ci.org/Xotic750/is-async-function-x.svg?branch=master"
   alt="Travis status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-async-function-x"
   title="Dependency status">
<img src="https://david-dm.org/Xotic750/is-async-function-x.svg"
   alt="Dependency status" height="18"/>
</a>
<a href="https://david-dm.org/Xotic750/is-async-function-x#info=devDependencies"
   title="devDependency status">
<img src="https://david-dm.org/Xotic750/is-async-function-x/dev-status.svg"
   alt="devDependency status" height="18"/>
</a>
<a href="https://badge.fury.io/js/is-async-function-x" title="npm version">
<img src="https://badge.fury.io/js/is-async-function-x.svg"
   alt="npm version" height="18"/>
</a>
<a name="module_is-async-function-x"></a>

## is-async-function-x
Determine if a function is a native aync function.

**See**: [14.6 Async Function Definitions](https://tc39.github.io/ecma262/#sec-async-function-definitions)  
**Version**: 1.7.0  
**Author**: Xotic750 <Xotic750@gmail.com>  
**License**: [MIT](&lt;https://opensource.org/licenses/MIT&gt;)  
**Copyright**: Xotic750  
<a name="exp_module_is-async-function-x--module.exports"></a>

### `module.exports(fn)` ⇒ <code>boolean</code> ⏏
Checks if `value` is classified as an `Async Function` object.

**Kind**: Exported function  
**Returns**: <code>boolean</code> - Returns `true` if `value` is correctly classified,
else `false`.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>\*</code> | The value to check. |

**Example**  
```js
var isAsyncFunction = require('is--async-function-x');

isAsyncFunction(); // false
isAsyncFunction(Number.MIN_VALUE); // false
isAsyncFunction('abc'); // false
isAsyncFunction(true); // false
isAsyncFunction({ name: 'abc' }); // false
isAsyncFunction(function () {}); // false
isAsyncFunction(new Function ()); // false
isAsyncFunction(function* test1() {}); // false
isAsyncFunction(function test2(a, b) {}); // false
isAsyncFunction(class Test {}); // false
isAsyncFunction((x, y) => {return this;}); // false
isAsyncFunction(async functin() {}); // true
```
