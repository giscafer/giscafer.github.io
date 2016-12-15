title: bluebird(Promise/A+)介绍
date: 2016-02-04 14:58:29
categories: 
- 技术
- 开发手册
tags: 
- promise
- bluebird
---


## 一、Promises/A+规范

### Promise

是一个拥有`then`方法的对象或函数，起行为符合本规范；

### thenable

是一个定义了`then`方法的对象或函数，即`拥有then方法`；

详情介绍见文章[《Promises/A+规范》](http://www.ituring.com.cn/article/66566)

## 二、bluebird

之前做node.js项目的时候一直使用朴灵的`eventproxy`来处理异步或者回调，`eventproxy`采用的是事件机制，使用也挺方便。
现在也了解一下备受欢迎的`bluebird`——[官网](http://bluebirdjs.com/)，bb的API文档很全很详细。
<!--more-->
### .promisifyAll

官方API说明：
> Promisifies the entire object by going through the object's properties and creating an async equivalent of each function on the object and its prototype chain. The promisified method name will be the original method name suffixed with suffix (default is "Async"). Any class properties of the object (which is the case for the main export of many modules) are also promisified, both static and instance methods. Class property is a property with a function value that has a non-empty .prototype object. Returns the input object.

大概意思就是，` Promise.promisifyAll`方法接收一个对象，会遍历对象中的方法并克隆该方法并在其后加上`Async`字符。也就是说会多出一样的方法，只不过都带`Async`（异步）的后缀。如果想将对象原型链上的方法也加上的话，则传入对象的原型即可，例如 `Promise.promisifyAll(obj.prototype)`，返回的是该对象。

### .then

类似原生Promise/A+规范的then方法：
> .then(
    [function(any value) fulfilledHandler],
    [function(any error) rejectedHandler]
    ) -> Promise

**例子：**（then和promisifyAll的使用）
```javascript

var Promise=require('bluebird');
var fs=Promise.promisifyAll(require('fs'));
var onFulfilled=function(data){
       console.log(data)
}
var onRejected=function(e){
    console.log('报错啦--',e)
}
fs.readFileAsync('package.json', "utf8").then(onFulfilled,onRejected);
    
```

### .catch
更方便的是，`bluebird`提供了`.catch`方法，可以在"链式"的操作上捕获异常，如上边的例子可以改写为如下方式：
```javascript

fs.readFileAsync('package.json', "utf8").then(function(data){//只需要关注成功的时候
    console.log(data);
}).catch(function(err){//轻松处理所有出现的异常
    console.log(err);
});
    
```

此外，还可以区别捕获不同的异常，分别处理，只需要指定异常的类型（如`TypeError`,`ReferenceError`,`NetworkError`等）即可（和java的异常类型处理类似吧？）

例子1，区分不同错误类型捕捉：
```javascript
somePromise.then(function() {
    return a.b.c.d();
}).catch(TypeError, ReferenceError, function(e) {
    //程序异常捕获
}).catch(NetworkError, TimeoutError, function(e) {
    //网络异常捕获
}).catch(function(e) {
    //捕获所有其他异常
});
```

例子2，捕捉找不到文件报错：
```javascript
fs.readFileAsync('package.jsn', "utf8").then(function (data) {
    console.log(data);
}).catch({ code: 'ENOENT' }, function (e) {
    console.log("file not found: " + e.path);
});

```

### 集合相关的方法
`.all`方法可以处理一个数组内的所有方法，处理完毕返回信息，如例子异步创建10个文件后，返回成功信息：

```javascript
var files = [];
for (var i = 0; i < 10; ++i) {
    files.push(fs.writeFileAsync("file-" + i + ".txt", "", "utf-8"));
}
Promise.all(files).then(function() {
    console.log("all the files were created");
});
```

还有其他好用的方法，需要的时候去了解一下API文档，根据实际情况使用即可。