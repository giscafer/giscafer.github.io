title: 基于fullCalendar二次开发的排班管理和考勤签到功能
date: 2015-10-15 00:59:48
categories:
- 技术
- 项目
tags:
- JavaScript
- fullCalendar
- 排班管理
- 考勤签到
- 项目
---

最近做个GIS的巡护系统需要开发一个排班管理功能和一个考勤签到统计功能，在查找实现方式和插件后，决定使用`fullCalendar`进行二次开发来实现；`fullCalendar`是一个jQuery日历插件，使用它主要是为了借助其日期功能的实现。（另外，有个和fullCalendar类型的日历插件是`dhtmlxScheduler`，都能达到大致一样的效果）

<!-- more -->

**eg:fullCalendar可以使用简单的几句代码就可以实现一个中文日历了：**

    $('#calenderDemo').fullCalendar({
     buttonText: {
      today: '今天',
      month: '月',
      week: '周',
      day: '天'
     },
     allDayText: '全天',
     monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
     monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
     dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
     dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
    });

`fullCalendar`目前是2.4版本，在对比源码看的时候，发现1.5和1.6的版本的源码写的相对简单易懂，所以旧使用了版本1.6.4进行修改。下边就是二次开发成果展示了！！！

## 一、排班管理开发截图


![排班的添加][1]
![排班的班次控制：不能添加相同班次][2]
![排班的班次控制：一天不能添加超过3个班次][3]
![额外的功能：班次的维护，班次颜色设定和顺序修改][4]

![设定的排班保存数据库后结果展示][5]

## 二、考勤签到开发截图

![考勤签到9月份][6]

![考勤签到10月份][7]

## 三、开发总结

纯粹的JS编写和样式CSS编写，麻烦的只是数据的组装；弄清楚fullCalendar实现的原理和渲染的方式后，按照自己的业务逻辑组织好数据就可以了。

## 四、源码分享

写过一个排班管理系统：[FinalScheduler][8]

 

  [1]: http://giscafer.github.io/static/img/fullcalendar_paiban_add.png
  [2]: http://giscafer.github.io/static/img/fullcalendar_paiban_ctrol1.png
  [3]: http://giscafer.github.io/static/img/fullcalendar_paiban_ctrol2.png
  [4]: http://giscafer.github.io/static/img/fullcalendar_plan_setting.png
  [5]: http://giscafer.github.io/static/img/fullcalendar_paiban_view.png
  [6]: http://giscafer.github.io/static/img/fullcalendar_check_1.png
  [7]: http://giscafer.github.io/static/img/fullcalendar_check_2.png
  [8]: https://github.com/giscafer/FinalScheduler
  