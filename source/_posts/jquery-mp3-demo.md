title:  jquery-mp3.js模仿站长之家的音乐播放效果
date: 2015-09-15 23:52:42
categories:
- JavaScript
tags:
- JavaScript
- Jquery
- jmp3
---

`jquery-mp3.js`简称jmp3，是一个采用jQuery开发的JavaScript MP3插放器，提供一种可以在页面上直接播放MP3的简便方式。
详情：http://www.sean-o.com/jquery/jmp3/

其源代码也很简洁和简单：
```javascript
    jQuery.fn.jmp3 = function(passedOptions) {
    var options = {
        "playerpath": "music/",//mp3播放器singlemp3player.swf的路径(mp3文件是用这个swf文件播放的)
        "filepath": "", //mp3文件路径
        "backcolor": "",//播放整体按钮的背景颜色
        "forecolor": "ffffff",//播放按钮【中间那个三角形】的颜色
        "width": "25",//播放器长度
        "repeat": "no",//是否重复播放mp3
        "volume": "50",//mp3音量 (0-100)
        "autoplay": "false",//当播放器初始化好后是否自动播放，默认false
        "showdownload": "true",//是否显示下载mp3按钮
        "showfilename": "true"//是否显示mp3的文件名称
    };
    if (passedOptions) {
        jQuery.extend(options, passedOptions);
        playerpath = options.playerpath
    };
    var playerpath = options.playerpath;
    return this.each(function() {
        var _container = jQuery(this).prev();
        if (!_container.is('.container')) return false;
        var filename = options.filepath + jQuery(this).html();
        var mp3html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
        mp3html += 'width="' + options.width + '" height="20" ';
        mp3html += 'codebase="' + playerpath + 'swflash.cab">';
        mp3html += '<param name="movie" value="' + playerpath + 'singlemp3player.swf?';
        mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
        mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
        mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" />';
        mp3html += '<param name="wmode" value="transparent" />';
        mp3html += '<embed wmode="transparent" width="' + options.width + '" height="20" ';
        mp3html += 'src="' + playerpath + 'singlemp3player.swf?';
        mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
        mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
        mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '" ';
        mp3html += 'type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
        mp3html += '</object>';
        if (options.showfilename == "false") {
            jQuery(this).html("")
        };
        if (_container.is('.container')) {
            _container.prepend(mp3html + "&nbsp;");
        }
    })
};


```

使用jmp3模拟站长之家的音乐播放效果如图：

![demo效果][1]


》》》![【在线演示】][1]》》》》》【源码下载】

  [1]: http://giscafer.github.io/static/img/jquery-mp3-demo.png
  [2]: http://giscafer.github.io/static/demo/jquery-mp3/index.html