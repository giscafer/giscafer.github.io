title: ionic3之自定义tabs菜单图标
date: 2017-06-27 22:08:02
categories:
- 技术
- Ionic
tags:
- Ionic
- tabs图标
---


ionic的tabs组件默认图标更换方式可以通过自定义图标样式来替换。自定义图标可以是图标字体库，也可以是png图标等。

在tabs.scss文件（组件作用域），或者全局app.scss覆盖都行。下边是菜单覆盖代码：

```scss

page-tabs {
    .ion-tab-icon-base {
        width: 32px !important;
        height: 32px !important;
        padding: 4px 4px 2px;
    }

    .ion-tab-icon-md-base {
        min-width: 0 !important;
        height: 32px;
    }
    $tabImageName: 'home' 'task' 'master' 'my';
    @for $i from 1 to 5 {
        //for ios
        .ion-ios-tab-#{nth($tabImageName, $i)} {
            @extend .ion-tab-icon-base;
            content: url("../../assets/ui/tabs/icon_#{nth($tabImageName, $i)}_on.png");
        }
        .ion-ios-tab-#{nth($tabImageName, $i)}-outline {
            @extend .ion-tab-icon-base;
            content: url("../../assets/ui/tabs/icon_#{nth($tabImageName, $i)}_off.png");
        }

        // for android
        .tabs-md .tab-button[aria-selected=true] {
            .ion-md-tab-#{nth($tabImageName, $i)} {
                @extend .ion-tab-icon-md-base;
                content: url("../../assets/ui/tabs/icon_#{nth($tabImageName, $i)}_on.png");
            }
        }
        .tabs-md .tab-button[aria-selected=false] {
            .ion-md-tab-#{nth($tabImageName, $i)} {
                @extend .ion-tab-icon-md-base;
                content: url("../../assets/ui/tabs/icon_#{nth($tabImageName, $i)}_off.png");
            }
        }
    }
    .ion-ios-tab-task,.ion-ios-tab-task-outline,.ion-ios-tab-master,.ion-ios-tab-master-outline{
        width: 30px !important;
        height: 32px !important;
    }

}


```

<!--more-->

使用了scss的语法，定义 ` $tabImageName: 'home' 'task' 'master' 'my';`数组，然后循环，通过`#{nth($tabImageName, $i)}`取出循环中的每个元素，定义每个图标的样式，这个就是scss预编译样式的好处，省去重复的工作和重复的代码。

从样式代码可以看出，定义了两份代码，一份是ios的`ion-ios-`前缀，一份是android版本的`ion-md-`与`.tabs-md`前缀，还有这个是ionic对不同平台有不同的样式，如果了解一看就明白了。`-outline`为ios未选中样式，`[aria-selected=false]`为android未选中样式。


然后在html里边，修改`tabIcon`为样式中定义的图标即可。（上边样式图标统一加了`tab-`前缀，为了和自带图标区分开来）

```html

<ion-tabs #mainTabs [selectedIndex]="mySelectedIndex">
  <ion-tab [root]="homeView" tabTitle="首页" tabIcon="tab-home"></ion-tab>
  <ion-tab [root]="taskView" tabTitle="任务" tabIcon="tab-task"></ion-tab>
  <ion-tab [root]="courseView" tabTitle="师傅学院" tabIcon="tab-master"></ion-tab>
  <ion-tab [root]="userCenterView" tabTitle="我的" tabIcon="tab-my"></ion-tab>
  <ion-tab [root]="demoView" tabTitle="DEMO" tabIcon="bug"></ion-tab>
</ion-tabs>


```

图标路径放在`src/assets/ui`下，如图


![图标路径](/static/img/ionic3-tabs-icon1.png)


更换前和更换后对比


![自带图标](/static/img/ionic3-tabs-icon3.png)

![自定义图标](/static/img/ionic3-tabs-icon2.png)