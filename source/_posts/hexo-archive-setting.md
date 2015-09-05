title: Hexo添加归档widget并扩展展开和收起功能
date: 2015-09-03 14:15:05
categories:
- Hexo
tags:
- Hexo

---

### 1、以下是添加archvie（归档）模块代码：
   
```html
     <% if (site.posts.length){ %>
      <div id="archive_side" class="widget tag">
        <p class="title"><a href="<%- config.root %>archives"><%= __('archive_a') %></a></p>
       	 <%- list_archives({'display_count':2}) %><!--此处的代码是扩展-->
        <% if (site.posts.length>3){ %>
        <%} %>
      </div>
    <% } %>
```
`list_archives({'display_count':2}`这句话中传的参数是扩展的，下边会介绍

<!--more-->

### 2、修改list_archives.js接口文件

找到目录下`\node_modules\hexo\lib\plugins\helper\list_archives.js`文件，用下边代码替换：

```JavaScript
    'use strict';
    
    function listArchivesHelper(options){
      /* jshint validthis: true */
      options = options || {};
    
      var config = this.config;
      var archiveDir = config.archive_dir;
      var timezone = config.timezone;
      var lang = this.page.lang || this.page.language || config.language;
      var format = options.format;
      var type = options.type || 'monthly';
      var style = options.hasOwnProperty('style') ? options.style : 'list';
      var showCount = options.hasOwnProperty('show_count') ? options.show_count : true;
      //下边这句是扩展的代码，用来通过传参控制归档时间显示数量
      var displayCount = options.hasOwnProperty('display_count') ? options.display_count : null;
      var transform = options.transform;
      var separator = options.hasOwnProperty('separator') ? options.separator : ', ';
      var className = options.class || 'archive';
      var order = options.order || -1;
      var result = '';
      var self = this;
    
      if (!format){
        format = type === 'monthly' ? 'MMMM YYYY' : 'YYYY';
      }
    
      var posts = this.site.posts.sort('date', order);
      if (!posts.length) return result;
    
      var data = [];
      var length = 0;
    
      posts.forEach(function(post){
        // Clone the date object to avoid pollution
        var date = post.date.clone();
    
        if (timezone) date = date.tz(timezone);
        if (lang) date = date.locale(lang);
    
        var year = date.year();
        var month = date.month() + 1;
        var name = date.format(format);
        var lastData = data[length - 1];
    
        if (!lastData || lastData.name !== name){
          length = data.push({
            name: name,
            year: year,
            month: month,
            count: 1
          });
        } else {
          lastData.count++;
        }
      });
    
      function link(item){
        var url = archiveDir + '/' + item.year + '/';
    
        if (type === 'monthly'){
          if (item.month < 10) url += '0';
          url += item.month + '/';
        }
    
        return self.url_for(url);
      }
    
      var item, i, len;
      //下边这句是新增代码
      var divStr='<div id="archivelist_display" style="display:none;">';
      if (style === 'list'){
        result += '<ul class="' + className + '-list">';
    
        for (i = 0, len = data.length; i < len; i++){
        //>>>修改部分，如果数量大于设置的数值，就添加展示按钮
          if(displayCount && len>(displayCount+1)){
            item = data[i];
    
            divStr += '<li class="' + className + '-list-item">';
    
            divStr += '<a class="' + className + '-list-link" href="' + link(item) + '">';
            divStr += transform ? transform(item.name) : item.name;
            divStr += '</a>';
    
            if (showCount){
              divStr += '<span class="' + className + '-list-count">' + item.count + '</span>';
            }
    
            divStr += '</li>';
          }else{
            item = data[i];
    
            result += '<li class="' + className + '-list-item">';
    
            result += '<a class="' + className + '-list-link" href="' + link(item) + '">';
            result += transform ? transform(item.name) : item.name;
            result += '</a>';
    
            if (showCount){
              result += '<span class="' + className + '-list-count">' + item.count + '</span>';
            }
    
            result += '</li>';
          }
          
        }
        if(displayCount && len>displayCount){
             divStr += '</div><div id="archive_list_button" class="list_closed">展开</div>';
             result += divStr;
        }
        //<<<<修改部分
        result += '</ul>';
      } else {
        for (i = 0, len = data.length; i < len; i++){
          item = data[i];
    
          if (i) result += separator;
    
          result += '<a class="' + className + '-link" href="' + link(item) + '">';
          result += transform ? transform(item.name) : item.name;
    
          if (showCount){
            result += '<span class="' + className + '-count">' + item.count + '</span>';
          }
    
          result += '</a>';
        }
      }
    
      return result;
    }
    
    module.exports = listArchivesHelper;
```
扩展简单，就是根据传入的数值来控制默认只显示多少行归档li

### 3、添加图片和样式
在`blog\\source\static\css`下新增自己的样式文件custom.css
**样式代码：**
```css
    #archive_side .archive-list .list_closed,
    #archive_side .archive-list .list_opended {
      display: inline-block;
      color: #666;
      padding-right: 20px;
      /**图片文件**/
      background: url("../img/icon-arrow.png") no-repeat right bottom;
      cursor: pointer;
    }
    #archive_side .archive-list .list_opended {
      background-position: right top;
    }

```
然后在`blog\themes\{自己的主题}\layout\_partial\head.ejs`下引入样式文件

     <link rel="stylesheet" href="<%- config.root %>static/css/custom.css" media="screen" type="text/css">

### 4、添加js代码

 在`blog\source\static\js\`下新增common.js文件，功能：点击展开和收起的事件处理逻辑
 
**代码如下：**
```javascript
    (function($){
	$('#archive_list_button').click(function(){
		if($(this).hasClass("list_closed")){
			$("#archivelist_display").show();
			$("#archive_list_button").html('收起');
			$(this).removeClass("list_closed").addClass("list_opended");
			
		}else{
			$("#archivelist_display").hide();
			$("#archive_list_button").html('展开');
			$(this).removeClass("list_opended").addClass("list_closed");
		}
	});
    })(jQuery);

```
    
    
### 5、结束

`hexo s`启动项目，本地localhost:4000就可以看到效果了。如图：

![展开][1]
![收起][2]

具体效果见[博客站点][3]右侧归档


  [1]: https://giscafer.github.io/static/img/hexo-archive-setting01.png
  [2]: https://giscafer.github.io/static/img/hexo-archive-setting02.png
  [3]: http://giscafer.com
  
  
总结：了解NodeJS和EJS模板引擎，以及Hexo的工作原理，就会发现简单的多了。