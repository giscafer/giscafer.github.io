title: Hexo静态博客搭建教程[1]
date: 2014-04-27 15:35:41
categories:
- 技术
- Hexo
tags: 
- Hexo
- Hexo教程

---

###Hexo的介绍用一句话即可：

**A fast, simple & powerful blog framework,powered by Node.js**

Hexo是一个基于Node.js快而轻的强大博客框架，Hexo所生成的网页都是静态的，所以说他轻而快那是必然的，目前可以将其托管到`gitcafe`(国内）,`github`和`heroku`（国外）。giscafe's bolg托管在`gitcafe`，理由简单，两个名称很像，O(∩_∩)O哈哈哈~
Hexo作者来自台湾：[@tommy351](https://github.com/tommy351/hexo)

Hexo搭建教程官方的帮助文档很详细，查看官方版版主文档请移步：[Hexo Documentation](http://hexo.io/docs/)

<!--more-->

下边介绍一下如何在gitcafe上搭建Hexo博客：
首先整体步骤有几个：
> * **下载Git和Nodejs安装到电脑上**，我使用的是[Git](http://pan.baidu.com/s/1o6LQINK)（版本为1.9.2）和[Node.js](http://pan.baidu.com/s/1o6LQINK)（版本为Win7 32位），建议到[Git](http://git-scm.com/)和[Nodejs](http://nodejs.org/)官网下载适合自己的版本
> * **注册[gitcafe](http://gitcafe.com/signup?invited_by=giscafe)账号**
> * **安装Hexo程序**
> * **博客配置托管到gitcafe**


###（1）下载Git和Nodejs安装到电脑上

到[Git](http://git-scm.com/)和[Nodejs](http://nodejs.org/)官网下载适合自己电脑的版本后安装，更改自己想要安装的位置，其他设置默认即可，安装很简单。这里不介绍，安装成功会多这两个：
![](/static/img/hexo_course_01.jpg)

###（2）新建目录

在自己喜欢的一个目录下新建一个目录，命名自定义，这里我命名为`hexo`,在这个文件夹内右键》选择`Git Bash`命令，会打开如图窗口
![](/static/img/hexo_course_02.jpg)

这就是传说中的Git命令窗口，更多关于Git的命令使用和教程可以网上搜索或者到官网学习。

###（3）下载安装Hexo

    $ npm install hexo -g

使用上面的命令来下载安装Hexo程序

###（4）创建博客文件夹

    $ hexo init blog && cd blog
或

    $ hexo init
来创建博客目录，`$ hexo init blog && cd blog`是在根目录下创建一个blog文件夹再创建博客，`$ hexo init`则为直接在根目录创建博客文件夹：
![](/static/img/hexo_course_04.jpg)
最后文件夹如图：
![](/static/img/hexo_course_03.jpg)

`PS:`下边是Hexo在Git里搭建的几个日后常用命令
```javascript
$ hexo generate      //可以简写为$hexo g,本地文件更改后都需要执行一次，相当于提交更改

$ hexo server        //可以简写为$hexo s，本地服务启动，启动后可以在浏览器地址输入"localhost:4000"来访问博客，用于本地调试，满意了再提交

$ hexo deploy        //可以简写为$hexo d，提交代码到空间（托管处）
```
###（5）本地博客搭建完成
在git命令窗口中使用以下两个命令：
```python
$hexo generate或hexo g
$hexo server或hexo s
```
![hexo generate](/static/img/hexo_course_05.jpg)
![hexo server](/static/img/hexo_course_06.jpg)
`[info] Hexo is running at http://localhost:4000/. Press Ctrl+C to stop`
浏览器输入http://localhost:4000 即可打开刚建好的Hexo博客了。
![Hello World](/static/img/hexo_course_07.jpg)
**按`Ctrl+C `可以停止程序**



*通过以上几个步骤即可完成Hexo博客的本地搭建，托管gitcafe教程见下一篇*


作者 [@勞黑炭要好好好学习](http://weibo.com/laohoubin)  
2014 年 04月 28日    