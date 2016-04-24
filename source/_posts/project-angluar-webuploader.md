title: 图片上传控件angluar-webuploader
date: 2016-04-23 22:47:13
categories:
- Project
tags:
- webuploader
- angluar
---

## 简述

最近公司做个项目需要使用AngularJS重新封装图片上传控件，支持IE低版本等，之间看过`JQuery-File-Upload`，尝试使用了一些，觉得文件太多，不好修改；最后使用[webuploader](http://fex.baidu.com/webuploader)时因为其简洁的界面和使用方便；

`angluar-webuploader`是使用angular指令封装的webuploader demo，弹窗上传图片，缩略图展示列表，翻页效果；支持点击缩略图查看大图详情；

<!-- more -->
## 截图

![screenshot0](https://raw.githubusercontent.com/giscafer/angular-webuploader/master/images/screenshot.png)

![screenshot1](https://raw.githubusercontent.com/giscafer/angular-webuploader/master/images/screenshot2.png)

![screenshot2](https://raw.githubusercontent.com/giscafer/angular-webuploader/master/images/screenshot1.png)

## 使用

本demo没有给出java后台代码，后台代码也简单，一个文件读写+图片压缩，返回结果参考以下`json`格式；
然后将图片上传接口请求地址在`app.js`配置后即可。

```javascript
	
	{
		"status":true,//上传成功状态
		"newName":"/test/temp/upload/picture/20160422/c0c0b8f7bc574ec88f891ff834b79bab.jpg",//原图片路径
		"thumbName":"/test/temp/upload/picture/20160422/thumb/c0c0b8f7bc574ec88f891ff834b79bab.jpg"//缩略图路径
	}


```

---

源码地址，欢迎学习交流
https://github.com/giscafer/angular-webuploader

