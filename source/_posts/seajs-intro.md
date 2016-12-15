title: SeaJS配置使用学习笔记
date: 2015-09-05 22:48:47
categories:
- 技术
- 开发手册
tags:
- SeaJS
---

SeaJS确实简单，看[官网][1]介绍只需要5分钟就可以基本了解其使用方法，但是中间也有坑，官方文档并没有介绍很详细，这坑可能在你用了SeaJS后才会遇到。
<!--more-->

SeaJS在使用之前必须要一段配置代码：
```javascript
     seajs.config({
                //遵循seajs的ID和路径原则：https://github.com/seajs/seajs/issues/930
                base: "./",
                //设置路径，方便跨目录调用
                paths:{
                    //应用模块
                    'app': 'app',
                    //类库
                    'module': 'sea-modules',
                    //通用模块
                    'common': 'common'
                },
                //别名配置，配置之后可在模块中使用require调用 require('jquery');
                alias: {
                    //此路径下的【module】映射是上边paths中的module，也就是
                    //翻译为sea-modules/jquery/jquery/1.10.1/jquery.js
                    "jquery": "module/jquery/jquery/1.10.1/jquery.js"
                }
     });

```
其中，`base`路径很重要，Sea.js 在解析顶级标识时，会相对 base 路径来解析，require加载模块时查找路径也和此相关。也就是你sea.js放置的位置要合适，使得路径简单些。

```javascript
      // 调用定义模块
    seajs.use(['jquery','js/test'], function($) {
        console.log('jquery', $)
        $('#hhhh').html('Hello SeaJS');
    });

```
**test.js文件代码**

```javascript
    define(function(require, exports, module) {
    //加载commonUtil模块（上班paths映射common为common。故目录为：common/commonUtil）
    window.c = require('common/commonUtil');
    console.log('c', c);
    });

```
其实中间是有坑的，`juery`就是一个坑，如果修改了`base`，路径的改变就要求你需要改变你定义的一些模块的id，不然会在`var a=require（'modulename');`的时候a为`null`。比如修改jquery模块下额id
![base路径改变后需要修改jquery的id][2]

![基本结构][3]
详情请看：https://github.com/seajs/seajs/issues/930
`很多坑前辈都是走过的，我们可以搜索参考他们的解决办法`

》》》》》》[demo下载][4]


  [1]: http://seajs.org
  [2]: http://giscafer.github.io/static/img/seajs-intro01.png
  [3]: http://giscafer.github.io/static/img/seajs-intro02.png
  [4]: http://giscafer.github.io/static/uploadfile/seajs-intro-demo.zip