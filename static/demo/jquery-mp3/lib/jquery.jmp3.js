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
        var mp3html = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';="" mp3html="" +="width="" options.width="" '"="" height="20" playerpath="" 'swflash.cab"="">';
        mp3html += '<param name="movie" value="' + playerpath + 'singlemp3player.swf?';
        mp3html += 'showDownload=' + options.showdownload + '&file=' + filename + '&autoStart=' + options.autoplay;
        mp3html += '&backColor=' + options.backcolor + '&frontColor=' + options.forecolor;
        mp3html += '&repeatPlay=' + options.repeat + '&songVolume=' + options.volume + '">';
        mp3html += '<param name="wmode" value="transparent">';
        mp3html += '<embed wmode="transparent" width="' + options.width + '" height="20" ';="" mp3html="" +="src="" playerpath="" 'singlemp3player.swf?';="" options.showdownload="" '&file=" + filename + " &autostart=" + options.autoplay;
        mp3html += " &backcolor=" + options.backcolor + " &frontcolor=" + options.forecolor;
        mp3html += " &repeatplay=" + options.repeat + " &songvolume=" + options.volume + " "="" ;="" if="" (options.showfilename="=" "false")="" {="" jquery(this).html("")="" };="" (_container.is('.container'))="" _container.prepend(mp3html="" "&nbsp;");="" }="" })="" **="" *="" 初始化="" @param="" {[type]}="" classid="" [description]="" @return="" function="" mp3playerinit(classid)="" (classid="==" undefined)="" $('#'="" classid).mouseover(function()="" $(this).prepend('<div="" class="container">');
        var _this = $(this);
        if (!_this.find('a.audio-player').children().is('object')) {
            if (_this.find('a.audio-player object')) {
                _this.find('a.audio-player').show().jmp3({
                    "playerpath": 'music/',
                    "filepath": _this.attr('thumb'),
                    "backcolor": '',
                    "forecolor": "ffffff",
                    "width": "25",
                    "repeat": "false",
                    "volume": "100",
                    "autoplay": "true",
                    "showdownload": "false",
                    "showfilename": "false"
                });
            }
        };
    });
    $('#' + classId).mouseout(function(event) {
        $(this).find('div.container').remove();
    });
}
</object>