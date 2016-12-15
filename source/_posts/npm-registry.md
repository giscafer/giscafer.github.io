title: npm设置淘宝镜像
date: 2016-03-08 23:36:18
categories:
- 技术
- 开发手册
tags:
- npm
---

今晚使用npm下载`webpack`和其他插件时巨慢，这是以前从未遇到过的，所以就换了淘宝镜像，快了很多

更换镜像方式很多种，参考官方[文档说明](http://npm.taobao.org/)

更方便的方式是，在c盘用户目录下，找到`.npmrc`文件，加入如下代码即可。

```
registry = http://registry.npm.taobao.org
```

或者手动设置

	npm config set registry http://registry.npm.taobao.org/




但是这样做有个问题，发布npm插件的时候需要`npm adduser`，如果`.npmrc`文件填了这个的话，是登录不上的，
所以记得发布插件的时候删除了，或者是通过上边`文档说明`提供的其他方式解决。