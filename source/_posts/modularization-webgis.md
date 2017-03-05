title: 如何组件化开发WebGIS系统
date: 2017-01-10 23:09:31
categories:
- 技术
- WebGIS

tags:
- WebGIS
- gis
 
---

### 啰嗦两句

前面聊过[《探讨如何使用流行的前端技术开发WebGIS系统》](https://zhuanlan.zhihu.com/p/24780835?refer=viseye)，本篇基于此继续介绍。

*不用再讨论兼容IE6，7了，2017年，没人再用了。。。。哈哈哈*

本人目前正业余开发一套框架，后端Java+前端Angular+个人封装的UI+个人封装的地图组件，东西很多，一个人搞，这是一个漫长的过程。这也是为什么最近再Github上如此活跃的原因，也因为最近一段时间没加过班。。。除了玩游戏就只能写代码了。。

=>[giscafer (Nickbing Lao)](https://github.com/giscafer)

### 一、后端完善的Restful接口设计有利前端组件封装

比如知乎的文章链接

```
https://zhuanlan.zhihu.com/p/24780835
```

可以看作一个GET请求，接口p，参数为24780835。这个接口可以查所有文章。

做WebGIS系统，后端框架，接口设计好用，能提升前端开发的效率，并且可以针对接口封装一些增删改查的组件，在angular里边，你可以封装成指令或者是controller，然后其他业务controller集成此类，就继承了该类的所有方法了。比如应用里边我封装了增删改查的操作，只要是单表的CRUD（增查改删），完全不需要写多余的CRUD代码，只需要修改一下HTML和传参。如下代码可以改为一个通用的父类Controller。


<!--more-->

```javascript

/**
 * Test controller
 */

import popFormCtrl from './popForm.ctrl.js';
import popFormTemp from './popForm.html';
export default class TestCtrl {

    // dataServiceSrv, uiNotification为依赖注入服务，其中uiNotification为laoui封装ui控件
    constructor($scope, dataServiceSrv, uiNotification, $uiModal) {
        "ngInject";//ES6写angularjs指定写法；作用是依赖注入上边的$scope, dataServiceSrv, uiNotification模块
        this._$scope = $scope;
        this._$uiModal = $uiModal;
        this._dataServiceSrv = dataServiceSrv;
        this._uiNotification = uiNotification;
        this.tableName = 'student';
        this.title = "测试页";
        //查询标志位
        this.loading = false;
        this.deleting = false;
        this.isAllChecked = false;
        this.table = [];
        this.query();
        //过滤器自定义方法 | filter:方法名称
        this.filterData=(item)=>{
           return item._deleted!=true;
        }
    }
    //测试查询
    query() {
        let params = {
            "tableName": this.tableName
        }
        this.loading = true;
        this._dataServiceSrv.query(params).then(data => {
            if (data['result'].length) {
                this.table = data['result'];
            } else {
                this._uiNotification.info('无数据')
            }
        }).finally(() => {
            this.loading = false;
        })
    }
    //新增
    add() {
        let params = {
            title: '新增'
        }
        this.openPopForm(params);
    }
    //修改
    update() {
        let selectedRows = this.getSelectedRows();
        if (selectedRows.length !== 1) {
            let options = {
                message: '请选中一条记录！', positionX: 'center', positionY: 'top', delay: 2000
            }
            return this._uiNotification.warning(options);
        }
        let params = {
            title: '修改',
            data: selectedRows[0]
        }
        this.openPopForm(params);

    }
    delete() {
        let selectedRows = this.getSelectedRows();
        console.log(selectedRows)
        if (!selectedRows.length) {
            let options = {
                message: '请选中需要删除的记录！', positionX: 'center', positionY: 'top', delay: 2000
            }
            return this._uiNotification.warning(options);
        }
        let idArr = _.map(selectedRows, 'id');
        let idValues = idArr.join(",");
        let params = {
            idValues: idValues,
            tableName: this.tableName
        }
        this.deleting = true;
        this._dataServiceSrv.deleteByKey(params).then((res) => {
            if (res['result']) {
                this._uiNotification.success('删除成功!');
                for(let item of selectedRows){
                    item._deleted=true;
                }
            }else{
                 this._uiNotification.error('删除失败!');
            }

        }).finally(() => {
            this.deleting = false;
        })
    }
    //通用弹窗
    openPopForm(params = {}) {
        let modalInstance = this._$uiModal.open({
            templateUrl: popFormTemp,
            controller: popFormCtrl,
            controllerAs: 'popForm',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                items: () => {
                    return params;
                }
            }
        });
    }
    selectedAll() {
        this.table.forEach((item) => {
            item.checked = this.isAllChecked;
        })
    }
    check() {
        this.isAllChecked = !_.some(this.table, (item) => {
            return !item.checked;
        });
    }
    selectByClick($event, item) {
        if ($event.target.type !== 'checkbox') {
            item.checked = !item.checked;
        }
    }
    getSelectedRows() {
        return _.filter(this.table, (item) => {
            return item.checked === true;
        })
    }
}
```


![](/static/img/modularization-webgis1.png)

![](/static/img/modularization-webgis2.png)


可以封装的内容出CRUD外，还包括一些限制控制，通知提示，表单验证等。

因为是angular框架，双向数据绑定，比传统的jqueryUI，easyUI这堆好用的多，这么一来简单的表单页面开发起来就不费任何力气，简单复制模板修改一下就OK。

### 二、地图工具组件化

同理，地图工具组件化是必须的。（防转载标记，个人微信公众号：giscafer）

每个WebGIS系统都有这些一模一样的工具：**全屏、放大、缩小、距离测量、面积测量、i键查询、坐标定位** 等等，这些工具可以封装为无平台相关，也就是兼容所有地图js库，不管是ArcGIS API For JavaScript，还是OpenLayers 等，就比如我封装了一个叫 DMap 的地图库，里边大致结构如图：

![DMap库结构图](/static/img/modularization-webgis-dmap.png)

在开发系统时，我选择了`Mapbox`作为地图js库，我在`dmap_config.js`文件中配置

```javascript

DMAP_JS_TYPE:"MAPBOX"

```
这时候我可以自动构建打包一套Mapbox的js库（当然和原生库不一样，我封装了一些组件类，下边介绍）。同理我配置`DMAP_JS_TYPE:"OL3"`，就表示构建OL3组件库。

构建方式用`nodejs` + `webpack`等工具开发，类似 [Echarts的构建方式](http://echarts.baidu.com/builder.html) 

然后我把组件库引入我开发的webgis系统。通过无平台相关（这表示和地图 js库无关）接口 Map 创建地图

```javascript

 map = new Map("map", {
       //配置
        projection: "EPSG:900913",
        center: [118.665397, 47.6569168],
        zoom: 5
    });

```

另外，地图类型加载也可以封装成，通过配置地图类型比如，天地图OGC_WMTS，还是高德地图AMAP，demo《[《探讨如何使用流行的前端技术开发WebGIS系统》](https://zhuanlan.zhihu.com/p/24780835?refer=viseye) 就是配置的高德地图。这些地图加载同样封装成无平台相关。

以下是组件封装后使用demo截图：

![](/static/img/modularization-webgis3.png)

![](/static/img/modularization-webgis4.png)

最终，封装好后，以后做项目不用任何代码就可以构建一个webgis系统雏形出来，这个雏形系统带有基本的表单增删改查组件、全屏、放大、缩小、距离测量、面积测量、i键查询、坐标定位 等直接可用的地图组件。


### 三、总结

在WebGIS系统开发里边，有较多的表单业务，封装成组件开发是最方便的，也可以找网上的一些开源库做修改，定制成自己通用的才是最好用的。

已不从事gis行业，业余有外包机会或者兼职机会希望可以接一下，所以自己定制一个前端后端一整套框架，一方面学习，一方面积累技术。工作量很大，有时间一步一步慢慢来，并且业余还得学前端技术，React Native是下一个学习目标。

此外，框架设计的时候，考虑到不加载dmap地图库的时候，就是一个完全纯净的业务系统，可以用来做其他网站，比如企业站点、博客等。