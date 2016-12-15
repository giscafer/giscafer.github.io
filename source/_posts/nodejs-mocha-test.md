title: 在Nodejs项目里写测试
date: 2016-02-12 19:57:46
categories:
- 技术
- 开发手册
tags:
- mocha
- should
- BDD
---

> 不写测试的项目都是耍流氓

`BDD`和`TDD`的差别： [The Difference Between TDD and BDD][1]

<!-- more -->
### 测试框架：
`mocha`

> Mocha是一个基于node.js和浏览器的集合各种特性的Javascript测试框架，并且可以让异步测试也变的简单和> 有趣。Mocha的测试是连续的，在正确的测试条件中遇到未捕获的异常时，会给出灵活且准确的报告。

### 辅助工具
 - should.js (BDD)
 - chai（支持assert,should,expect）
 - supertest (接口测试，代替浏览器地址请求，十分方便)


一个典型的mocha例子：

```javascript
var assert = require('chai').assert;
var expect = require('chai').expect;
var should=require('chai').should();


describe('Test', function(){
    before(function() {
    // runs before all tests in this block
    });
  after(function(){
    // runs after all tests in this block
  });
  beforeEach(function(){
    // runs before each test in this block
  });
  afterEach(function(){
    // runs after each test in this block
  });
    
  describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
})

```

 - `beforeEach`会对当前`describe`下的所有子`case`生效。
 - `before`和`after`的代码没有特殊顺序要求。
 - 同一个`describe`下可以有多个`before`，执行顺序与代码顺序相同。
 - 同一个`describe`下的执行顺序为`before`, `beforeEach`, `afterEach`, `after`
 - 当一个`it`有多个`before`的时候，执行顺序从最外围的`describe`的`before`开始，其余同理。

1.`describe (moduleName, testDetails) `表示`测试套件`（test suite），表示一组相关的测试。它是一个函数，可以嵌套，第一个参数`moduleName`是测试套件的名称（可随意命名，一般描述测试内容），第二个参数`testDetails`是一个实际执行的函数。

2.`it (info, function)`块称为`测试用例`（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数`info`是测试用例的名称，第二个参数`function`是一个实际执行的函数。

3.`done()` 按照瀑布流编程习惯，取名done是表示你回调的最深处，也就是结束写嵌套回调函数。但对于回调链来说done实际上意味着告诉mocha从此处开始测试，一层层回调回去。此外，一个测试用例下（也就是一个it）里面只能调用一次done。

4.使用命令`mocha --recursive`执行当前目录下所有的测试用例（包括子目录）

### supertest使用
  
  `supertest`可以用来测试nodejs项目中的Restful API，也就是，我们不需要在浏览器中输入请求地址测试。
  详细看[说明文档](https://github.com/visionmedia/supertest)，下面代码简单介绍：
  ```javascript
    var app = require('../app');
    var request = require('supertest')(app);//获取对象
    describe('#showuser_list page', function () {
        it('should get admin/userlist', function (done) {
            request.get('/admin/userlist')//请求地址
                .set('Cookie', support.adminUserCookie)
                .expect(200, function (err, res) {//验证结果
                    res.text.should.contain('用户管理');
                    done(err);
                })
        });
    });

  ```

### 使用gulp自动化测试

1、安装插件：

 - gulp
 - gulp-watch
 - gulp-mocha
 
2、添加`Gulpfile.js`文件

```javascript
var gulp = require('gulp');
var watch = require('gulp-watch');

var path = 'src/server/test/**/*.js';

gulp.task('watch', function() {
  gulp.watch(['src/server/test/**/*.js', 'lib/*.js'], ['mocha']);
});

var mocha = require('gulp-mocha');
 
gulp.task('mocha', function () {
    return gulp.src(path , {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it 
        .pipe(mocha({reporter: 'spec'}));
});


gulp.task('default',['mocha', 'watch']);
```
3、运行监听测试文件改动，只要改动就会自动执行测试。

    gulp

### 测试覆盖率
在github上的项目大都有如图所示标志：

![Build Status & Coverage Status](http://giscafer.github.io/static/img/coverage-build.png)

**下面介绍如何使用`Istanbul With Mocha`生成测试覆盖率**

需要安装的插件有：

 - [coveralls](https://github.com/nickmerwin/node-coveralls)
 - [istanbul](https://github.com/gotwarlost/istanbul)
 - mocha
 
1、在`package.json`文件中的script属性下加入npm自定义命令`mocha`和`cov`：

```javascript
 "scripts": {
    "start": "node app.js",
    "test": "./node_modules/.bin/gulp",
    "mocha": "./node_modules/.bin/mocha -u bdd 'src/server/test/**/*.@(js|jsx)'",
    "cov": "istanbul cover ./node_modules/mocha/bin/_mocha src/server/test/**/*.js --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage"
  },
```
*mocha命令意思是执行测试的语句，cov命令是生成测试覆盖命令，具体可以查看coveralls文档*

2、使用github账号登录`travis-ci.org`站点，添加pro
在本地项目根目录中创建`.travis.yml`文件
```javascript
    language: node_js
    repo_token: Yt71K1wQ83RTyiSxvVwkgnrYn***FQn # 从coveralls.io获取
    services: mongodb
    node_js:
      - stable
      - 5.3
    sudo: false
    script: npm run mocha
    after_script: npm run cov
```

3、同样使用github账号登录`coveralls.io`，添加该pro，然后进入`SET UP COVERALLS页`可以看到教程，选择第一个将代码复制到`.coveralls.yml`文件中（同样是在根目录创建）
```javascript
# travis-pro 填写travis-ci的pro名称
service_name: Vue-order
repo_token: Yt71K1wQ83RTyiSxvVwkgnrYng9rQTFQn

```

4、最后push提交代码到github，在travis-ci查看项目是否自动部署成功，失败的话点击查看详细日记信息，根据失败信息解决问题即可。之后每次项目提交代码后，travis-ci上都会自动building项目。

5、成功后，将项目相应结果图片放到Readme.md下

    [![Build Status](https://travis-ci.org/giscafer/Vue-order.svg?branch=master)](https://travis-ci.org/giscafer/Vue-order)
    [![Coverage Status](https://coveralls.io/repos/github/giscafer/Vue-order/badge.svg?branch=master)](https://coveralls.io/github/giscafer/Vue-order?branch=master)


如项目效果：https://github.com/giscafer/Vue-order


推荐几篇不错的文章：
[测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
[初识 mocha in NodeJS](https://cnodejs.org/topic/516526766d38277306c7d277#56beaebf26d02fc6626bb560)
[Nodejs开源项目里怎么样写测试、CI和代码测试覆盖率](https://cnodejs.org/topic/558df089ebf9c92d17e73358)

  [1]: http://joshldavis.com/2013/05/27/difference-between-tdd-and-bdd/