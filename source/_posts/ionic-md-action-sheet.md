title: ionic3 之Android的actionsheet渲染和ios一致
date: 2017-06-19 22:01:58
categories:
- 技术
- Ionic
tags:
- ionic
- actionsheet
---



Android的action-sheet是比较丑，默认几乎不带样式，如果不给图标的话。如图：


![](/static/img/ionic-md-action-sheet1.jpg)


<!--more-->

首先对比一下ios和android样式的区别，然后在ionic.css文件中，将ios的action-sheet样式拷贝出来，独立为`actionsheet.scss`，这样就可以覆盖了。

```css

/**
* 覆盖action-sheet样式
*
**/
.action-sheet-md {
    text-align: center;
}

.action-sheet-md .action-sheet-container {
    padding: 0 10px;
    background: none;
}

.action-sheet-md .action-sheet-group {
    overflow: hidden;
    margin-bottom: 8px;
    border-radius: 13px;
    background: #f9f9f9;
}

.action-sheet-md .action-sheet-group:last-child {
    margin-bottom: 10px;
}

.action-sheet-md .action-sheet-title {
    text-align: center;
    padding: 1.5rem;
    border-bottom: 0.55px solid #d6d6da;
    border-radius: 0;
    font-size: 1.3rem;
    font-weight: 400;
    color: #8f8f8f;
}

.action-sheet-md .action-sheet-button {
    margin: 0;
    padding: 18px;
    min-height: 5.6rem;
    border-bottom: 0.55px solid #d6d6da;
    font-size: 2rem;
    color: #007aff;
    background: transparent;
    .button-inner {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-flow: row nowrap;
        -ms-flex-flow: row nowrap;
        flex-flow: row nowrap;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }
}

.action-sheet-md .action-sheet-button:last-child {
    border-bottom-color: transparent;
}

.action-sheet-md .action-sheet-button.activated {
    margin-top: -0.55px;
    border-top: 0.55px solid #ebebeb;
    border-bottom-color: #ebebeb;
    background: #ebebeb;
}

.action-sheet-md .action-sheet-selected {
    font-weight: bold;
    background: #fff;
}

.action-sheet-md .action-sheet-destructive {
    color: #f53d3d;
}

.action-sheet-md .action-sheet-cancel {
    font-weight: 600;
    background: #fff;
}


```

最终效果如图：


![](/static/img/ionic-md-action-sheet2.jpg)

其实ionic支持指定UI渲染模式，config设置`mode`为`ios`即可