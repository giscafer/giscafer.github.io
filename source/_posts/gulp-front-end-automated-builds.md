title: 什么，你还不懂前端自动化构建？
date: 2015-11-30 22:29:09
categories:
- 技术
- 开发手册
tags: [gulp,前端构建,AMD]
---

如果你是搞前端开发的，或者你每天都在写CSS、JavaScript等前端编程语言代码，如果你不知道什么叫前端自动化构建，那一般只有两种情况：

 1. 你在传统软件行业，用着4、5年前网页开发方式工作;
 2. 你并不是一个真正的Front End Software Engineer；

### 什么是前端构建工具？

前端构建工具——实现前端代码的编译（sass、less）、压缩、测试；图片的压缩以及浏览器自动刷新等等功能。

目前流行的三大前端构建工具`grunt`、`gulp`、`fis3`，他们都是基于Node.js的插件工具。前两个是国外出品，fis3是百度国产。fis3听说还不错，但是还没使用过，之前学习NodeJS使用的是grunt,感觉这东西挺牛。智能、前端自动化。听说`gulp`比`grunt`好用些，所以就研究一下吧。

<!--more-->
以下是学习笔记，官方gulp工具介绍见[github][9]

### 一、安装gulp工具到全局环境
`（前提安装了NodeJS和NPM）`

    $  npm install --global gulp

### 二、接着进入项目根目录下，安装gulp开发依赖环境
`如果项目下没有package.json文件，请阅读下边步骤再继续此步骤`

    $  npm install --save-dev gulp
    
### （二）生成package.json
    
        npm init

输入`npm init`，回车回车即可生成

### 三、安装必要的Gulp插件

 - 压缩css（gulp-minify-css）
 - js代码校验（gulp-jshint）
 - 合并js文件（gulp-concat）
 - 压缩js代码（gulp-uglify）
 - 压缩图片（gulp-imagemin）
 - 文件重命名 （gulp-rename）
 - 自动刷新页面（gulp-livereload）
 - 更改提醒（gulp-notify）
 - 合并js顺序（gulp-order）（https://github.com/sirlantis/gulp-order）

```
    $  npm install gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-livereload gulp-rename --save-dev
```
安装完后 package.json文件内容如下：

        {
      "name": "goodgis",
      "version": "1.0.0",
      "description": "",
      "main": "main.js",
      "directories": {
        "test": "test"
      },
      "dependencies": {
        "gulp": "^3.9.0"
      },
      "devDependencies": {
        "gulp": "^3.9.0",
        "gulp-concat": "^2.6.0",
        "gulp-imagemin": "^2.4.0",
        "gulp-jshint": "^2.0.0",
        "gulp-livereload": "^3.8.1",
        "gulp-minify-css": "^1.2.1",
        "gulp-notify": "^2.2.0",
        "gulp-rename": "^1.2.2",
        "gulp-uglify": "^1.5.1",
        "jshint": "^2.8.0"
      },
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "license": "ISC"
        }

### 四、根目录下创建gulpfile.js文件

代码如下，作用看注释

     //引入插件
        var gulp = require('gulp'),
            // minifycss = require('gulp-minify-css'),
            jshint = require('gulp-jshint'), //代码验证检查
            uglify = require('gulp-uglify'), //压缩js代码
            rename = require('gulp-rename'), //文件重命名
            concat = require('gulp-concat'), //合并js文件
            notify = require('gulp-notify'), //更改提醒
            livereload = require('gulp-livereload'); //自动刷新页面
        
        //js代码校验、合并和压缩（类似jquery的链式操作，牛）
        gulp.task('scripts', function() {
            return gulp.src('src/**/*.js') //源文件
                .pipe(jshint('.jshintrc')) //1、校验JS文件，jshint校验规则
                .pipe(jshint.reporter('default')) 
                .pipe(concat('goodgis.js'))  //2、合并js文件，goodgis.js为合并的文件名称
                .pipe(gulp.dest('dist'))  //合并后文件存放位置
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(uglify())         //3、执行压缩任务
                .pipe(gulp.dest('dist'))  //压缩后文件存放位置
                .pipe(notify({    //4、操作结束后提示
                    message: 'Scripts task complete'
                }));
        });
        // 默认任务，这里完全可以是多个任务，比如压缩CSS，压缩图片，压缩js等
        gulp.task('default',['watch'], function() {
            gulp.start('scripts');
        });
        // 监听（前端自动化的情怀）
        gulp.task('watch', function() {
            // 监听 .js文件改动，一旦改动就会自动压缩合并
            gulp.watch('src/**/*.js', ['scripts']);
            // Create LiveReload server（用来自动刷新浏览器）
            livereload.listen();
            // Watch any files in dist/, reload on change
            gulp.watch(['dist/**']).on('change', livereload.changed);
        });
    
### 五、执行gulp

    $ gulp
    
只需要gulp一下，之后一切都如此自动化，可以自动压缩CSS，JavaScript，图片，自动刷新浏览器等等。并且，能做的并不只有这些，另外，你还可以自己写插件。

![新增了dist文件夹][1]

![里边就是合并压缩的文件][7]

原src下很多文件夹，文件夹下很多js文件，如图：

![src文件夹][8]

不管怎么修改，会自动将整个src文件夹中的js文件（`src/**/*.js`）压缩合并到dist目录下的`goodgis.js`(合并未压缩)和`goodgis.mini.js`(合并且压缩)。


### 六、总结

个人觉得，确实gulp会比grunt好用一点，方便；看使用场景和个人爱好吧，了解NodeJS的话就不会觉得有任何难度了。

----

`Unauthorized use tool that lets you work more efficiently`

 - 构建工具官网：[grunt][2]  、  [gulp][3]   、 [fis3][4]
 - livereload(浏览器自动刷新):[http://feedback.livereload.com/][5]    或参考[方法二][6]

 
----


  [1]: http://giscafer.com/static/img/gulp-intro1.png
  [2]: http://gruntjs.com/
  [3]: http://gulpjs.com/
  [4]: http://fis.baidu.com/
  [5]: http://feedback.livereload.com/
  [6]: http://feedback.livereload.com/knowledgebase/articles/86180-how-do-i-add-the-script-tag-manually-
  [9]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
  [7]: http://giscafer.com/static/img/gulp-intro2.png
  [8]: http://giscafer.com/static/img/gulp-intro0.png