title: hexo博客中多说插件的配置使用
date: 2014-10-02 16:43:15
categories: Hexo
tags: [Hexo]
---
多说中的几个配置如下

 1.

	<div class="ds-thread" data-thread-key="请将此处替换成文
	章在你的站点中的ID" data-title="请替换成文章的标题" data-url="请替换成文章的网址"></div>
 
2.
   `{short_name:"二级域名（*.duoshuo.com）"}`，只需要填二级域名缩写，也就是*号部分！


<!--more-->

多说文章评论配置，hexo博客的都可以参考以下的配置

    <% if (theme.duoshuo.enable && page.comments){ %>

	<!-- 多说评论框 start -->
	<div class="ds-thread" data-thread-key="<%- config.root %><%- item.path%>" data-title="<%- item.title %>" data-url="<%- item.permalink %>"></div>
	<!-- 多说评论框 end -->
	<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
	<script type="text/javascript">
	var duoshuoQuery = {short_name:"giscafe"};
	(function() {
		var ds = document.createElement('script');
		ds.type = 'text/javascript';ds.async = true;
		ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
		ds.charset = 'UTF-8';
		(document.getElementsByTagName('head')[0] 
		 || document.getElementsByTagName('body')[0]).appendChild(ds);
	})();
	</script>
	<!-- 多说公共JS代码 end -->
	<% } %>

将修改好的代码放到theme\主题名称\layout\_partial\comment.ejs下即可。（有些主题可能位置不一样，其他位置找到即可。）

