title: ionic3之组件封装篇
date: 2017-07-05 21:30:04
categories:
- 技术
- Ionic

tags:
- ionic

---


ionic3官方提供了较多好用的组件和API。但是有些时候，我们用到的交互方式，官方的组件不是全都满足的。比如类似网易新闻APP，菜单的滑动效果。或者一些和业务接口紧密联系的组件。

## 滑动菜单效果实现


 推荐使用插件[ionic2-super-tabs](https://github.com/zyra/ionic2-super-tabs)，功能强大。下边是`slides + slides`组合挖坑尝试

最终效果如下：


![slides+slides实现菜单滑动](/static/img/ionic3-custom-component1.gif)

<!-- more -->

简单的代码如下：（完善的话实际上需要填掉很多坑，这也可能是为什么官方没有提供这类的组件吧）

```html
<ion-header>

  <ion-navbar>
    <ion-title>slide-tab-demo</ion-title>
  </ion-navbar>
<div>
  <task-slide (slideClick)="slideClick($event)" [slides]="tabs" [selectedIndex]="navSelectedIndex"  [taskType]="segment" [pageNumber]="4"></task-slide>
</div>
</ion-header>

<div style="height: 100%;;background-color:#999">
  <ion-slides #slidesRef (ionSlideDidChange)="slideChanged($event)">
    <ion-slide *ngFor="let slide of slides; let i = index;">
      <div class="list has-header" id="{{i}}">
        <ion-label>{{slide.name}}</ion-label>
      </div>
    </ion-slide>
  </ion-slides>
</div>

```

ts代码

```javascript

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Tabs } from 'ionic-angular';

@Component({
  selector: 'page-slide-tab-demo',
  templateUrl: 'slide-tab-demo.html',
})
export class SlideTabDemoPage {

  @ViewChild("slidesRef")
  slidesRef: Slides;
  @ViewChild("tabsRef")
  tabsRef: Tabs;

  slides: any[] = [];
  currentTabId = "tab1";
  tabs: any[] = [];
  navSelectedIndex = 0;
  constructor(
    public navCtrl: NavController,
    public alert: Alert,
    public navParams: NavParams
  ) {
    this.slides = [{
      name: '头条新闻'
    }, {
      name: '娱乐新闻'
    },
    {
      name: '体育新闻'
    }];
    this.tabs = [{
      _name: "头条",
      num: 99
    }, {
      _name: "娱乐",
      num: 0
    }, {
      _name: "热点",
      num: 0
    }, {
      _name: "体育",
      num: 4
    }, {
      _name: "财经",
      num: 0
    }, {
      _name: "汽车",
      num: 0
    }, {
      _name: "时尚",
      num: 0
    }];
  }

  slideClick(slideIndex) {
    this.slidesRef.slideTo(slideIndex);
  }
  slideChanged($event) {
    let currentIndex = this.slidesRef.getActiveIndex();
    // this.alert.showAlert('sss');
    this.navSelectedIndex = currentIndex;
  }
}


```

## 抽屉效果

先看效果：

![ionic3-custom-component2.gif](/static/img/ionic3-custom-component2.gif)

抽屉效果，在做一些筛选选择条件的时候，交互首选的。这个官方没有提供组件实现，实现这个功能也必将简单，加上使用ng4的话，动画效果也很容易切换。下边是代码。

```html

<ion-content>
    <ion-backdrop *ngIf="toggleState==='in'" style="opacity:0.4"></ion-backdrop>
    <div class="panel" [@toggleState]="toggleState">
        <!--为了兼容android和ios，这里要留空16px,避免内容遮挡，所以加了margin-top-->
        <div margin-top>
            <button ion-button small outline (click)="togglePanel()"> 按钮1 </button>
            <button ion-button small outline (click)="togglePanel()"> 按钮2 </button>
            <button ion-button small outline (click)="togglePanel()"> 按钮3 </button>
        </div>
    </div>
    <div margin-top>
        <span>{{testData}}</span>
        <span>{{testText}}</span>
    </div>
    <div style="margin-top:240px;">
        <button ion-button small (click)="togglePanel()"> 这里是其他东西 </button>
    </div>
</ion-content>

```

```javascript

/**
 * 抽屉动画+loading api调用举例
 */
@Component({
    selector: 'page-api-test',
    templateUrl: 'api-test.html',
    animations: [ // 动画的内容+ html里边的div的panel样式
        trigger('toggleState', [
            state('in', style({
                top: '45px'
            })),
            state('out', style({
                top: '-200px'
            })),
            transition('out => in', animate('300ms ease-in')),
            transition('in => out', animate('800ms ease-out'))
        ])
    ]
})
export class ApiTestPage {

    toggleState = 'out';
    toggle: boolean = true;

    constructor( ) {
    }


    /**动画内容start */
    togglePanel() {
        this.toggle = !this.toggle;
        this.toggleState = this.toggle ? 'out' : 'in';
    }
    /**动画内容end */

}
```

重要的是要添加`ion-backdrop`组件，作为掩膜，禁止content内容可以点击。


## 图片下载

需要插件支持

- `npm install @ionic-native/transfer`

- `ionic cordova plugin add cordova-plugin-file-transfer`

```javascript


    /**
     * 下载文件 
     * @param url 
     * @param fileName 
     */
    download(url, fileName) {
        const fileTransfer: TransferObject = this.transfer.create();
        return fileTransfer.download(url, this.file.dataDirectory + 'download_' + fileName);
    }
    
    // 测试下载
   downloadImage() {
        let url = 'https://img.alicdn.com/tps/TB1WvtYSXXXXXX4XXXXwu0bFXXX.png';
        let fineName = 'tmail_' + new Date().getTime() + '.png';
        this.download(url, fineName).then((entry) => {
          console.log('下载后路径：'+entry.toURL())
        }, (error) => {
          // handle error
          // console.log('download error: ' + error)
        });
  }

```


## 本地图片读取上传

本地图片路径有两种格式，如下方代码注释，通过file插件中的readAsDataURL方法，将图片读取为Base64的格式，如果是后端接口是支持base64上传图片就可以直接上传，不然就如下使用`dataURItoBlob`方法转成Blob上传。

_下边方法都封装在nativeService.ts服务类里_

```javascript
  /**
     * Base64转File对象
     * @param dataURI 
     */
    dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
    
    /**
    * 根据原生图片路径获取图片dataUrl
    * 支持两种格式路径
    * "/data/data/yzt.jzt/files/download_tmail_1499051584861.png"
    * /storage/emulated/0/Pictures/IMG_20170626_104451.jpg
    */
    readAsDataURLByPath(path: string, callback: Function) {
        let that = this;
        function fail(err) {
            console.log('Cannot found requested file' + err);
        }
        function gotFile(dataURL) {
            let blob = that.dataURItoBlob(dataURL);
            callback(blob);
        }
        let time = new Date().getTime();
        if (path) {
            if (path.indexOf('file://') !== 0) {
                path = 'file://' + path;
            }
            let fileNames = path.split('/');
            let name = fileNames[fileNames.length - 1];
            let num = path.lastIndexOf('/');
            let dirPath = path.substring(0, num);
            this.file.readAsDataURL(dirPath, name).then(fileEnter => gotFile(fileEnter)).catch(err => fail(err));
        }
    }

```

**上传服务器**

将xhr FormData请求方式封装成Promise方法，方便调用

```JavaScript

 /**
   * 通过android和ios文件路径上传服务器
   *  Creates a new file in the specific path.
   * @param paths 文件路径数组 
   * ["/storage/emulated/0/Pictures/IMG_20170626_104451.jpg"]
   */
  uploadByFileSystem(paths): any {
    let fileBlobs = [];

    return new Promise((resolve, reject) => {
      this.nativeService.showLoading('图片上传中……');
      let formData = new FormData();
      for (let path of paths) {
        this.nativeService.readAsDataURLByPath(path, blob => {
          fileBlobs.push(blob);
          formData.append('file', blob, blob.name || 'jzt_tmall_' + fileBlobs.length + '.jpg');
          if (fileBlobs.length === paths.length) {
            this.settings.getValue('jwt').then(jwt => {
              let xhr = new XMLHttpRequest();
              xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                  this.nativeService.hideLoading();
                  if (xhr.status >= 200 && xhr.status < 300) {
                    resolve({ xhr: xhr, formData: formData });
                  } else {
                    reject({ xhr: xhr, formData: formData });
                  }
                }
              };

              xhr.open('POST', UPLOAD_URL, true);
              xhr.setRequestHeader("Authorization", "Bearer " + jwt);
              xhr.send(formData);
            });
          }
        });
      }

    });

  }

```

## 相册选择图片上传

使用插件 [Telerik-Verified-Plugins](https://github.com/Telerik-Verified-Plugins/)  ImagePicker即可选择图片，得到Base64格式或者url，上传代码和上边类似。





_参考文章_

http://ourcodeworld.com/articles/read/22/solve-native-path-of-android-content-if-resolvelocalfilesystemurl-doesn-t-work


## 微信公众号

![giscafer](http://blog.giscafer.com/static/images/qrcode_giscafer.jpg)


_未完待续……_