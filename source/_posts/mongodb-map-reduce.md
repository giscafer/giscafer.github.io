title: mongoDB查询统计之Map-Reduce方法
date: 2016-02-05 16:44:56
categories:
- mongoDB
tags:
- mongoDB
- mapReduce
- mongoDB统计
---

### 0、说明

官方给的Map-Reduce的流程如下图：

![此处输入图片的描述][1]
<!-- more -->
该函数接收三个参数：`map`,`reduce`,{`query`,`output`}；其中`map`,`reduce`是方法，最后一个参数是对象，
该对象可以使用`query`作为查询过滤条件，`output`的意思是将结果保存在临时的集合里边，最后用来查询。

首先，数据库我存的订餐数据如下所示：

```
{
        "_id" : ObjectId("56b45c45ad1434e863ea1406"),
        "user_id" : ObjectId("568bbaa0e78f752802a65a7b"),
        "dish_name" : "韭菜鸡蛋",
        "deleted" : false,
        "update_at" : ISODate("2016-02-05T08:24:37.761Z"),
        "create_at" : ISODate("2016-02-05T08:24:37.761Z"),
        "ispack" : false,
        "dish_price" : 12,
        "__v" : 0
}
{
        "_id" : ObjectId("56b45c5fad1434e863ea1407"),
        "user_id" : ObjectId("568bbaa0e78f752802a65a7b"),
        "dish_name" : "红烧鸡块",
        "deleted" : false,
        "update_at" : ISODate("2016-02-05T08:25:03.070Z"),
        "create_at" : ISODate("2016-02-05T08:25:03.070Z"),
        "ispack" : false,
        "dish_price" : 15,
        "__v" : 0
}
{
        "_id" : ObjectId("56b45c66ad1434e863ea1408"),
        "user_id" : ObjectId("568bbaa0e78f752802a65a7b"),
        "dish_name" : "耗油生菜",
        "deleted" : false,
        "update_at" : ISODate("2016-02-05T08:25:10.002Z"),
        "create_at" : ISODate("2016-02-05T08:25:10.002Z"),
        "ispack" : false,
        "dish_price" : 13,
        "__v" : 0
}
```

下边会介绍对这些数据进行查询统计！

### 1、map方法

先看代码：

```javascript
var map=function(){
    var cate=this.dish_name;//以菜名进行统计
    emit(cate,{price:this.dish_price});
}

```
map方法里面会调用`emit(key, value)`，mongodb集合会按照指定的`key`进行映射分组, 类似关系型数据库的`group by`,
目的是`group by`上面map后的结果，最终为：按照cate分组, 分组结果是{name: this.name}的list。

### 2、reduce方法

（遍历map的结果，统计订单中每种盖饭的总数和总价格）

```javascript
var reduce=function(key,values){
    var sum=0;
    var totalCost=0;
    values.forEach(function(order){
        sum+=1
        totalCost+=order.price;
    });
    return {count:sum,cost:totalCost};
}

```
### 3、执行mapReduce方法

```javascript
db.orders.mapReduce(map,reduce,{out:"order_results"});//执行查询统计（这里没加query查询条件）
db.order_results.find();//查看结果，order_results就是out参数的写的临时集合
```

查询结果如下，最终的集合里边，`_id`就是`cate`,`value`就是统计的值了。

> { "_id" : "红烧鸡块", "value" : { "count" : 2, "cost" : 30 } }
{ "_id" : "耗油生菜", "value" : { "count" : 2, "cost" : 26 } }


统计示例见：[订餐统计][2]
  


  [1]: https://docs.mongodb.org/manual/_images/map-reduce.png
  [2]: http://vueorder.duapp.com/charts