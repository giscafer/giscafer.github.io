title: AMD构建（gulp插件amd-optimize的使用）
date: 2015-12-02 20:11:16
categories: 
- 技术
- 开发手册
tags: [AMD,gulp,前端构建]
---

这里所说的`AMD`构建，是指`AMD`定义模块方式的代码构建。AMD=异步定义模块，具体查看官方[AMD][1]解释。

首先，所谓构建就是将多个文件合并压缩等，但是对于`AMD`定义的模块来说，模块之间存在这依赖关系，`AMD`构建主要就是解决这种模块之间的依赖关系，构建的方式很多种，下边是gulp 的`amd-optimize`插件构建笔记。
<!--more-->
### 使用gulp对AMD模块构建

需要三个插件 `gulp amd-optimize gulp-concat`

    npm install gulp amd-optimize gulp-concat --save-dev

创建gulpfile.js文件，内容如下：

    var gulp = require("gulp");
    var amdOptimize = require("amd-optimize");
    var concat = require('gulp-concat');
     
    gulp.task("default", function () {
      return gulp.src("app/**/*.js") //需要合并的代码
        .pipe(amdOptimize("app"))   //主入口文件
        .pipe(concat("result.js"))  //合并后文件
        .pipe(gulp.dest("dist"));  //输出目录
     
    });

工程中，app/index/a.js代码：

    define(function(require,exports,module) {
        function fn(){
            console.log("this is the module a");
        }
        exports.fn=fn;
    });
    
app/script/b.js代码：

    define(function(require,exports,module) {
        var a = require('../index/a');
        a.fn();
        console.log("i am module b");
    
        console.log("b has finished");
    });
    
根目录下app.js入口文件内容：

    define(['script/b'],function(require,exports,module){
        console.log(" module c");
    
        console.log("c finished");
    });

执行构建后，在dist下就会输出result.js文件代码如下
    
      define('index/a', [
        'require',
        'exports',
        'module'
    ], function (require, exports, module) {
        function fn() {
            console.log('this is the module a');
        }
        exports.fn = fn;
    });
    define('script/b', [
        'require',
        'exports',
        'module',
        'index/a'
    ], function (require, exports, module) {
        var a = require('../index/a');
        a.fn();
        console.log('i am module b');
        console.log('b has finished');
    });
    define('app', ['script/b'], function (require, exports, module) {
        console.log(' module c');
        console.log('c finished');
    });

可见，会解决package内部模块之间的项目依赖

  [1]: https://github.com/amdjs/amdjs-api

