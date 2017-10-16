title: ionic3之图片选择插件com.synconset.imagepicker
date: 2017-07-04 23:48:04
categories:
- 技术
- Ionic

tags:
- ionic
- imagepicker

---

`com.synconset.imagepicker`插件是telerik团队开发提供。

- 官网：http://plugins.telerik.com/cordova/plugin/imagepicker
- github:https://github.com/Telerik-Verified-Plugins/ImagePicker


使用命令安装 `ionic cordova plugin add cordova-plugin-image-picker`

安装后需要修改中文支持。

<!--more-->

## Android

### multiimagechooser_strings_en.xml文件修改


```xml

<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="multi_app_name">图片选择器</string>
    <string name="free_version_label">还可以选择 %d 张图片</string>
    <string name="error_database">打开图像数据库时出错,请反馈问题.</string>
    <string name="requesting_thumbnails">请求缩略图，请耐心等待</string>
    <string name="multi_image_picker_processing_images_title">正在处理...</string>
    <string name="multi_image_picker_processing_images_message">请稍等...</string>
    <string name="discard" translatable="false">取消</string>
    <string name="done" translatable="false">确定</string>
 </resources>

```

直接用上边代码覆盖`xx_project\plugins\com.synconset.imagepicker\src\android\Library\res\values\multiimagechooser_strings_en.xml`文件中的东西。


### MultiImageChooserActivity.java 弹窗汉化修改

`工程\plugins\com.synconset.imagepicker\src\android\Library\src\MultiImageChooserActivity.java`

用下边代码覆盖方法`onItemClick`中的对应代码（Line 199）：

```java

    new AlertDialog.Builder(this)
                    .setTitle("提示")
                    .setMessage("您只能选择" + maxImageCount + " 张图片")
                    .setPositiveButton("知道了", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.cancel();
                        }
                    })
                    .create()
                    .show();
                    
```

## IOS

新增文件`ImagePicker/src/ios/GMImagePicker/zh-Hans.lproj/GMImagePicker.strings`

```xml
/* Cancel */
"picker.navigation.cancel-button" = "取消";

/* Done */
"picker.navigation.done-button" = "完成";

/* Navigation bar default title */
"picker.navigation.title" = "我的相册";

/* %@ Items Selected */
"picker.selection.multiple-items" = "已选中 %@ 项";

/* %@ Photos Selected */
"picker.selection.multiple-photos" = "已选中 %@ 张照片";

/* %@ Videos Selected */
"picker.selection.multiple-videos" = "已选中 %@ 个视频";

/* 1 Photo Selected */
"picker.selection.single-photo" = "已选中 1 张照片";

/* 1 Video Selected */
"picker.selection.single-video" = "已选中 1 个视频";

/* All photos */
"picker.table.all-photos-label" = "相机胶卷";

/* Smart Albums */
"picker.table.smart-albums-header" = "智能相册";

/* Albums */
"picker.table.user-albums-header" = "相册";

```

`./plugin.xml`文件中添加上边文件引入

```xml
         <resource-file src="src/ios/GMImagePicker/fr.lproj" />
          <resource-file src="src/ios/GMImagePicker/it.lproj" />
          <resource-file src="src/ios/GMImagePicker/pt.lproj" />

 +        <resource-file src="src/ios/GMImagePicker/zh-Hans.lproj" />
  
          <framework src="Accelerate.framework" />
          <framework src="Security.framework" />
          <framework src="Photos.framework" />
```


新版本IOS不支持图片张数限制，具体见官方说明。http://plugins.telerik.com/cordova/plugin/imagepicker


## 总结


注意的是每次移除plugins重新安装插件的话都要修改一次。比较麻烦。其实可以将插件源码修改自己发布插件，这样就不用每次修改了。

github可以搜到别人汉化重新发布的插件，但是是两年前的，一直未更新，质量不敢保证，不怕麻烦就自己动手了。