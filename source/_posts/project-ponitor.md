title: Ponitor价格监测
date: 2016-03-31 13:21:01
categories:
- 技术
- 项目&Demo
tags: 
- Project
- vue
- webpack
- node.js

---

开发这个项目的初衷是学习`vue.js+webpack`构建应用，加上学习`ES6`之后没有正式在项目里边练习，然后偶然看到一个demo是做app爬虫的，加上本人又有计划入手个单反的想法，于是就有了[Ponitor](https://github.com/giscafer/Ponitor)。

项目支持对天猫、淘宝、和京东进行爬虫，关注一些商品，降价或涨价的时候都推送消息；（话说如果每天都监测商品价格，在双11和双12，会发现有些商家提前提升价格再故意降价的情况，哈哈哈……，只是猜测，不过这情况是会有的吧。），他们的恶劣行为会被`Ponitor`记录。

<!-- more -->

## 关于商品信息获取

1、爬虫Apple App是最方便的，一切信息都在html里边，只需要请求，解析出来即可。

2、爬虫京东和阿里的就不一样了，价格或者图片是被隐藏的，得通过其他方式；找到他们ajax请求的接口等。当接口如果发生变化，还需要调整修改。当然，只要页面能显示的数据，我们通过爬虫都能获取到；不过阿里是有很强的反爬虫机制的，当你请求数过多的时候，会强制跳转登录页面，要想记录爬信息，得通过这个关卡。。。。有时间研究一下吧。

3、补充：阿里反的是频繁爬虫，只要模拟好爬虫行为接近浏览器，或者是项目只对个人来使用（请求不会频繁），是没有任何问题的。

## 项目截图

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/index_preview.png)

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/goodlist_preview.png)

关注的商品价格发生变化（涨价or降价）的时候发生邮件通知，如测试截图：

![index](https://raw.githubusercontent.com/giscafer/Ponitor/master/wiki/email-sample.png)

## 使用

详情见README.md


## 源码

https://github.com/giscafer/Ponitor

欢迎交流学习！！！
