title: 前端网站性能优化14点
date: 2015-09-06 23:28:44
categories: 前端优化
tags: 前端优化
---

了解前端必备的优化内容，这作为开发的标准的话，会让我们养成好的编码风格，并做到后期优化内容更少。下边是在学习前端优化记录的笔记内容。**推荐书《高性能网站建设指南》**

### 1、尽可能的减少 HTTP 请求数

前端页面初始化的时候，会在服务器下载外部文件，比如图片、js、css文件等，Http请求次数越多，消耗的时间越长，有效的将图片和js\css文件合并，减少Http的请求可以提升性能优化

<!-- more -->

### 2、 使用CDN（内容分发网络）
CDN 意思是尽可能避免互联网上可能影响数据传输速度和稳定性的瓶颈和环节，使内容传输的更快、更稳定。

### 3、添加Expire/Cache-Control头

`expire头`的内容是一个时间值，值就是资源的本地的过期时间、存在本地。在本地缓存阶段，找到对应的资源值，当前时间还没超过资源的过期时间，就直接使用这个资源，不会发送http请求。

`Cache-Control`是http协议中常用的头部之一，顾名思义，他是负责控制页面缓存机制，如果该头部指示缓存，缓存的内容也会缓存在本地，操作流程和expire相似，但是也有不同的地方，cache-control有更多的选项，而且也有更多的处理方式。

### 4、启用Gzip压缩
HTML、php、js、css、xml、txt都可以使用Gzip压缩使得文件变小，提升文件传输速度。

### 5、把CSS放在页面最上面

为了提高浏览器的渲染性能，避免页面出现空白或者闪烁问题，应该将CSS放在页面顶部，或者head里边。

###6、 将script放在页面最下面

和DOM加载顺序有关，由于script标签的引入和加载消耗时间，而浏览器渲染的时候，CSS和script标签其实都是阻塞的，浏览器加载script的时候，下载完毕并执行，这个过程会阻塞进程。文件大的时候影响着页面的渲染速度和效果，所以将script标签放到页面底部，不影响页面的加载


### 7、避免在CSS中使用Expressions

CSS中使用Expressions，就是CSS表达式（CSS属性和JavaScript表达式）。在页面显示和缩放、页面滚动、移动的时候浏览器会计算CSS Expressions，移动鼠标的时候也会计算，这个网上可以搜到计算的方法，可以测试一下就发现很恐怖。

### 8、把JavaScript和CSS都放到外部文件中

**提出来的好处**：提高了js和css的复用性，减小页面体积，提高了js和css的可维护性，可作为文件被浏览器单独缓存；
**坏处**：文件多的时候回增加请求数量

**放到页面好处**：减少页面请求、加快页面渲染速度；
**坏处**：不利于维护，可复用性差

**写在页面内的情况：**
    > 1、只应用于一个页面
     > 2、不经常被访问到
     > 3、脚本和样式很少

### 9、减少DNS查询

当浏览器访问www.giscafer.com的时候，浏览器会将域名解析为IP地址，然后根据DNS查找网站服务器，这个期间会消耗时间，有些网站是将js和img等放在多域下，所以DNS查询多的时候就需要考虑减少dns查询或者缓存来解决

### 10、压缩JavaScript和CSS

通过网上一些在线或者其他根据来压缩js、css文件，已减少文件体积，提升网页下载文件速度；

### 11、避免重定向

http协议中重定向有301（页面被移动到了另外的位置）和302（被找到了）两种状态码。
另外301表示永久重定向，302表示临时重定向。对搜索引擎来说，爬虫会不定期的搜索站点，如果站点使用了301重定向，搜索引擎会将（a——>b）b记录下来，删除a不再去爬虫。
当然，简单的从重定向来看，在这个过程中会消耗时间，所以不使用的话就尽量避免；另外特别注意的细微差别是，比如http://giscafer.com这个地址，就暗藏了重定向了，正确的为http://giscafer.com/才是直接访问的。其他的地址类似，一般后边加上`/`

### 12、移除重复的脚本

这也是个编码习惯和质量的问题；当重复的脚本下有相同的全局变量时，这个会影响到其他代码，或者是被全局污染了。js前端代码如果使用模块化管理的方式的话就避免了污染的情况。

### 13、配置实体标签（ETag）

ETag——Entity Tag（实体标签），属于HTTP协议，受Web服务支持。使用特殊的字符串，来标识某个请求资源版本
![浏览器和服务器交流][1]
当每次Http请求的时候，服务器会判断该次请求的数据是否做过修改，如果没有修改过，则返回304状态码告诉浏览器，浏览器继续使用原来版本的资源，如果修改过了，则重新ETag标识，此时返回状态码是200。

### 14、使AJAX缓存

Ajax请求也是会消耗时间的，所以有时候也是需要缓存，但AJAX的POST请求的时候，是不被缓存的，而GET请求时可以被缓存的。
![POST和GET的区别][2]

### 15、Yslow网站性能优化工具

最后推荐Yslow工具，其实基于Firebug上使用的，如果是使用Firefox浏览器可以直接安装插件，Google chrome的话先安装FirebugLiteforChrome插件再安装Yslow

  [1]: http://giscafer.github.io/static/img/web-performance-optimization13.png
  [2]: http://giscafer.github.io/static/img/web-performance-optimization15.png