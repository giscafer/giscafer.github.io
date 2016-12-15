title: 利用swiftype为hexo博客添加站内搜索
date: 2015-10-18 15:42:47
categories:
- 技术
- Hexo
tags:
- Hexo
- swiftype
---

之前使用百度站内搜索，本质其实是跳转到百度页面搜索站点内容，效果也不好，今天更换闻名已久的swiftype。

<!-- more -->

### 下边看效果图：
![自动搜索效果](/static/img/swiftype-for-hexo1.png)
![回车搜索结果弹窗](/static/img/swiftype-for-hexo2.png)

### 实现过程

**1、注册swiftype账号，创建search engine，创建步骤简单详细；**

**2、添加search.ejs widget文件**
```javascript

	<form class="search" action="" method="get" accept-charset="utf-8">
			<input type="text" class="st-default-search-input" maxlength="20" style="height:40px" placeholder="Search" />
	</form>
	<script type="text/javascript">
	  (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
	  (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
	  e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
	  })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');

	  _st('install','ZfmnF1vBkUFHkfhgCvjA','2.0.0');
	</script>

```

其中：以上的`ZfmnF1vBkUFHkfhgCvjA`是swiftype搜索engine key，在注册创建search engine的最后脚本代码会给出，拷贝使用即可。然后再主题下的`_config.yml`内引入
	
	widgets:
	- search ##swiftype
