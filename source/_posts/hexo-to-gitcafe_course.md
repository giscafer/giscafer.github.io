title: Hexo静态博客搭建教程[2]
date: 2014-04-27 17:35:41
categories:
- Hexo
tags:
- Hexo
---

##将Hexo本地博客，托管到gitcafe教程

###（1）注册[gitcafe](http://gitcafe.com/signup?invited_by=giscafe)账号

首先注册gitcafe账号，然后登陆到gitcafe，在个人首页左下角处，新建一个项目
![](http://giscafer.github.io/static/img/hexo_course_08.jpg)

<!--more-->

###（2）填写好项目信息：

![](http://giscafer.github.io/static/img/hexo_course_09.jpg)

###（3）进入账户设置：

![](http://giscafer.github.io/static/img/hexo_course_11.jpg)

###（4）添加SSH公匙：

![](http://giscafer.github.io/static/img/hexo_course_12.jpg)

###（5）公匙获取方法：

> $ clip < ~/.ssh/id_rsa.pub

>   复制公匙到剪切板

第一次使用的朋友没有公匙请看官方创建官方教程[Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys)

将复制的公式粘贴到gitcafe账户设置处的SSH公匙里边，保存即可！

打开博客根目录下的_config.yml文件，设置
将最后的“# Deployment”设置选项设置为如下：
    
    deploy:
      type: github
      repository: git@gitcafe.com:giscafe/giscafe.git
      branch: master 


这里的repository改为自己的Git地址，获取方法见图：

![](http://giscafer.github.io/static/img/hexo_course_13.jpg)

保存，运行以下命令：

$hexo generate

$hexo deploy

这样即可将博客文件部署到gitcafe了，生成的静态文件会上传到gitcafe项目的master分支里边。
使用$ hexo doploy命令需要输入密码，就是上边[Generating SSH Keys](https://help.github.com/articles/generating-ssh-keys) 教程里边设置SSH时需要的密码。

###PS:

首次使用git的时候都需要提交一下自己的user_name和user_email

下面的命令将修改/home/[username]/.gitconfig文件，也就是说下面的配置只对每一个ssh的用户可见，所以每个人都需要做。

提交代码的log里面会显示提交者的信息:
    
    git config —global user.name [username]
    git config —global user.email [email]


**deploy完成后，在浏览器输入gitcafe送的二级域名即可进入了，比如我的是http://giscafer.github.io**

**就是“项目名.gitcafe.com”**


==========================


Author: [@勞黑炭要好好好学习](http://weibo.com/laohoubin)

2014 年 04月 29日