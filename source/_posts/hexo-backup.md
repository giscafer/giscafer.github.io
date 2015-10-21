title: 关于Hexo博客备份
date: 2014-04-28 15:35:41
categories:
- Hexo
tags: 
- Hexo
---

博客搭建几天了，这个静态博客框架使用感觉不错，一开始还是觉得更新博文比较麻烦，但是了解了
markdown的编辑器使用后，排版简单，另外是静态博客不需要数据库，纯粹的页面托管，可以放到github等网站。

[markdown编辑器推荐](http://www.oschina.net/news/50322/markdown-editors-and-tools)

因为hexo博客是本地更新博文，所以我想，要是本地`_posts`文件被删除了，或者根目录下的`source`和`theme`这些文件都丢了，是不是玩完了？所以要做好备份
本质上，Hexo是将本地的md文件编译成静态文件上传到github上（或者其他），所以建议是将本地的整个Hexo项目（blog）原件同步提交到github或者其他代码托管的站点，或者网盘！

更好的办法是，使用[hexo-git-backup](https://github.com/coneycode/hexo-git-backup)插件备份
</br>

------

*To the world you may be one person but to one person you may be the world.*



