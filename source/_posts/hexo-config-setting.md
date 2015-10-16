title: hexo博客配置文件
date: 2014-04-27 15:35:41
categories:
- Hexo
tags:
- Hexo
---

hexo博客配置文件位置：根目录下的`_config.yml`文件。

hexo博客安装完成后所有都是默认的，更改需要纯手工修改配置文件，包括修改博客名称等内容，下边是我的配置文件

<!--more-->

```css
# Hexo Configuration
## Docs: http://hexo.io/docs/configuration.html
## Source: https://github.com/tommy351/hexo/

# Site 站点信息配置
title: Giscafe's blog #站点名 
subtitle:  A cafe about GIS #副标题，站点左上角
description: 博客取名为giscafe，意为一个学习gis的咖啡馆，在这里分享一些有关Web开发或者是GIS学习相关的文章 #描述站点，SEO用
author: giscafe #在站点左下角作者显示
email: #你的联系邮箱
language: zh-CN #中文

# URL域名绑定设置
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://gisren.com
root: /
permalink: :year/:month/:day/:title/
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code

# Directory
source_dir: source
public_dir: public

# Writing 文章配置
new_post_name: :title.md # File name of new posts
default_layout: post
auto_spacing: false # Add spaces between asian characters and western characters
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
max_open_file: 100
multi_thread: true
filename_case: 0
render_drafts: false
post_asset_folder: false
highlight:
  enable: true
  line_number: true
  tab_replace:

# Category & Tag 默认分类
default_category: uncategorized
category_map:
tag_map:

# Archives 归档设置
## 2: Enable pagination 可分页，全文显示
## 1: Disable pagination 无分页，表示只有标题
## 0: Fully Disable
archive: 1
category: 1
tag: 1

# Server 服务配置
## Hexo uses Connect as a server
## You can customize the logger format as defined in
## http://www.senchalabs.org/connect/logger.html
port: 4000	
server_ip: 0.0.0.0
logger: false
logger_format:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: MMM D YYYY
time_format: H:mm:ss

# Pagination每页显示文章数
## Set per_page to 0 to disable pagination
per_page: 10 #默认是10
pagination_dir: page

# Disqus 插件
disqus_shortname:

# Extensions 主题和插件
## Plugins: https://github.com/tommy351/hexo/wiki/Plugins
## Themes: https://github.com/tommy351/hexo/wiki/Themes
theme: pacman
exclude_generator:
plugins:
- hexo-generator-feed
- hexo-generator-sitemap


# Markdown
## https://github.com/chjj/marked
markdown:
  gfm: true
  pedantic: false
  sanitize: false
  tables: true
  breaks: true
  smartLists: true
  smartypants: true

# Stylus
stylus:
  compress: true

# Deployment 部署配置 从下边可以看出部署在了gifcafe
## Docs: http://hexo.io/docs/deployment.html
deploy:
  type: github
  repository: git@gitcafe.com:giscafe/giscafe.git
  branch: gitcafe-pages #master 

```
==========================

这些在[Hexo documentation](http://hexo.io/docs)里边都有详细介绍。

设置好后，
hexo g和hexo d后就可以看到效果了。
