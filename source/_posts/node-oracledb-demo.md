title: nodejs链接oracle
date: 2016-04-13 11:30:17
categories:
- NodeJS
tags:
- node-oracledb
- node.js链接oracle

---

## windows下node-oracledb环境

在windows环境下， oracle一直是个麻烦事情，参考官方[环境搭建说明](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md#instwin)
<!--more-->
原本就在电脑上安装了`oracle11g`数据库,`VS2013`,`python2.7`，所以，我在环境变量下只需要再添加以下两个变量：
```
    set OCI_LIB_DIR=D:\app\giscafer\product\11.2.0\dbhome_1\OCI\lib\MSVC
    set OCI_INC_DIR=D:\app\giscafer\product\11.2.0\dbhome_1\OCI\include
```
    npm install --save oracle

![node-oracledb.png](http://giscafer.github.io/static/img/node-oracledb.png)


## oracle数据库连接

1、安装`node-oracledb`完成后，新建一个数据库配置文件`dbconfig.js`：
```javascript
    
module.exports = {
  user          : process.env.NODE_ORACLEDB_USER || "scott",

  // Instead of hard coding the password, consider prompting for it,
  // passing it in an environment variable via process.env, or using
  // External Authentication.
  password      : process.env.NODE_ORACLEDB_PASSWORD || "tiger",

  // For information on connection strings see:
  // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#connectionstrings
  connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost/orcl",

  // Setting externalAuth is optional.  It defaults to false.  See:
  // https://github.com/oracle/node-oracledb/blob/master/doc/api.md#extauth
  externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};
```

2、然后测试数据库连接，建个`connect.js`文件：
```
    var oracledb = require('oracledb');
    var dbConfig = require('./dbconfig.js');
    
    oracledb.getConnection(
      {
        user          : dbConfig.user,
        password      : dbConfig.password,
        connectString : dbConfig.connectString
      },
      function(err, connection)
      {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log('Connection was successful!');
    
        connection.release(
          function(err)
          {
            if (err) {
              console.error(err.message);
              return;
            }
          });
      });

```
3、最后运行`connect.js`，成功会输出'Connection was successful!'信息

    node connect.js



## 查询表

1、`npm install --save async`

2、新建``select.js`文件，代码如下（sql语句修改为自己需要查询的表语句即可）

3、`node select.js`执行即可看到结果，结果分为数据和对象两种处理方式，比较简单

测试结果图：

![](http://giscafer.github.io/static/img/node-oracledb-select.png)


```javascript
var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

// Properties are applicable to all connections and SQL executions.
// They can also be set or overridden at the individual execute() call level
//
// This script sets outFormat in the execute() call but it could be set here instead:
// oracledb.outFormat = oracledb.OBJECT;

var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    cb);
};

var dorelease = function(conn) {
  conn.release(function (err) {
    if (err)
      console.error(err.message);
  });
};

// Default Array Output Format
var doquery_array = function (conn, cb) {
  conn.execute(
    "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city",
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("----- Cities beginning with 'S' (default ARRAY output format) --------");
        console.log(result.rows);
        return cb(null, conn);
      }
    });
};

// Optional Object Output Format
var doquery_object = function (conn, cb) {
  conn.execute(
    "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city",
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
        // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result)
    {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("----- Cities beginning with 'S' (OBJECT output format) --------");
        console.log(result.rows);
        return cb(null, conn);
      }
    });
};

async.waterfall(
  [
    doconnect,
    doquery_array,
    doquery_object
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });


```

---

更多见官方提供的例子：
https://github.com/oracle/node-oracledb/tree/master/examples

