title: NodeJS 学习笔记
date: 2015/8/20 20:46:25
categories:
- NodeJS
tags:
- Node.js
- npm

---

### CommonJS、CMD、AMD、Node.js与JavaScript


CMD是国内玉伯大神在开发SeaJS的时候提出来的，属于CommonJS的一种规范，此外还有AMD，其对于的框架是RequireJS:
1、二者都是异步模块定义（Asynchronuous Module Definition）的一个实现；
2、CMD和AMD都是CommonJS的一种规范的实现定义，RequireJS和SeaJS是对应的实践；
3、CMD和AMD的区别:CMD相当于按需加载，定义一个模块的时候不需要立即制定依赖模块，在需要的时候require就可以了，比较方便；而AMD则相反，定义模块的时候需要制定依赖模块，并以形参的方式引入factory中。
<!-- more -->

    //AMD方式定义模块
    define(['dep1','dep2'],function(dep1,dep2){
         //内部只能使用制定的模块
          return function(){};
    });
    //CMD
    define(function(require,exports,module){
       //此处如果需要某XX模块，可以引入
       var xx=require('XX');
    });

4、JavaScript语言是弱结构性的，通过CommonJS定义一些规范，CMD和AMD得定义模块的方式对代码进行管理，使得更易维护；此外，NodeJS的诞生，对模块的规范定义，和包（npm）的概念的引入，让JS管理不再困难，一个字，爽爆了！


---

### 一、常用的Module

`node开发中用到的模块，记下`

**utility** [A collection of useful utilities.][1] 

**bcrypt** [A bcrypt library for NodeJS.][2] 

**node-uuid** [生成uuid的模块][3]

**eventproxy** [An implementation of task/event based asynchronous pattern.][4]

**nodemailer** [Easy as cake e-mail sending from your Node.js applications][5]
**nodemailer-smtp-transport** [（nodemailer1.0以上需要此辅助）https://github.com/andris9/nodemailer-smtp-transport][6]

**moment** [Parse, validate, manipulate, and display dates][7]

**node-inspector** [Web Inspector based nodeJS debugger][8]

**connect-mongodb** [mongodb session store for connect][9]

**cookie-parser** [cookie parsing with signatures][10]

**express-session**  [Simple session middleware for Express][11]

**body-parser** [Node.js body parsing middleware][12]

**lodash** [由Underscore.js演变成的好用工具][13]

**connect-multiparty** [multipart parsing middleware for connect using multiparty][14]

**grunt-mocha-test** [【单元测试】A grunt task for running server side mocha tests][15]

**mocha** JavaScript测试框架

**chai** should、expect等BDD测试

**sequelize** Sequelize is an easy-to-use multi sql dialect ORM for Node.js & io.js. It currently supports MySQL, MariaDB, SQLite, PostgreSQL and MSSQL.——[github](http://sequelizejs.com) 

**node-schedule** A cron-like and not-cron-like job scheduler for Node.——[github](https://github.com/node-schedule/node-schedule)

**superagent** Ajax with less suck - (and node.js HTTP client to match) ——[github](http://visionmedia.github.com/superagent/)

**morgan** HTTP request logger middleware for node.js ——[github](https://github.com/expressjs/morgan)

**serve-favicon** favicon serving middleware ——[github](https://github.com/expressjs/serve-favicon)

**cheerio** Fast, flexible, and lean implementation of core jQuery designed specifically for the server. ——[github](http://cheeriojs.github.io/cheerio/)

---


### 二、Grunt集成自动重启

1、安装grunt环境： `npm install grunt -g`和`npm install grunt-cli -g`
2、安装 `npm install grunt-contrib-watch --save-dev`
3、安装 `npm grunt-concurrent --save-dev`
4、安装 `npm grunt-contrib-watch --save-dev`
5、安装 `npm grunt-nodemon --save-dev`
(--save-dev会将该模块信息保存到package.json里边)
[Nodemon和Grunt-Contrib-Watch: 有什么不同?][16]


  [1]: https://www.npmjs.com/package/utility
  [2]: https://www.npmjs.com/package/bcrypt
  [3]: https://www.npmjs.com/package/node-uuid
  [4]: https://www.npmjs.com/package/eventproxy
  [5]: https://www.npmjs.com/package/nodemailer
  [6]: https://github.com/andris9/nodemailer-smtp-transport
  [7]: https://www.npmjs.com/package/moment
  [8]: https://www.npmjs.com/package/node-inspector
  [9]: https://www.npmjs.com/package/connect-mongodb
  [10]: https://www.npmjs.com/package/cookie-parser
  [11]: https://www.npmjs.com/package/express-session
  [12]: https://www.npmjs.com/package/body-parser
  [13]: https://lodash.com/
  [14]: https://www.npmjs.com/package/connect-multiparty
  [15]: https://www.npmjs.com/package/grunt-mocha-test
  [16]: http://blog.csdn.net/allgis/article/details/46572815