title: NodeJS开发常见错误A&Q
date: 2016-02-05 14:18:08
categories:
- NodeJS
tags:
- NodeJS
---

## 0、NodeJS调试介绍
级别从高到低，推荐到不推荐：

 1. ttd/bdd测试驱动
 2. node-inspector，vsc编辑器，webstrom；
 3. node-debug
 4. console.log
 
<!--more-->

## 1、CookieParser错误
` throw new Error('cookieParser("secret") required for signed cookies');`
提示：**Error: cookieParser("secret") required for signed cookies**

```nodejs
    app.use(cookieParser(config.auth_cookie_name));//这里cookieParser("secret")需要指定内容"secret"
    //因为版本问题，这里坑里好一会
    app.use(session({
      secret:config.session_secret,
      key: config.auth_cookie_name, //这里auth_cookie_name就是指定内容"secret"
      cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({
        url: config.dev_dbUrl
      })
    }));

```
出现以上问题可能是在代码中使用类似` var auth_token = req.signedCookies[config.auth_cookie_name];`代码，如果没用，以上直接使用`pp.use(cookieParser());`即可。

参考解决：
https://segmentfault.com/a/1190000004139342
http://stackoverflow.com/questions/20112876/cookieparser-and-cookiesession-middleware-in-expressjs


## 2、Cast to ObjectId failed for value

错误大致：
  

      500 CastError: Cast to ObjectId failed for value "Mp0uah2G6TJVwPhOQ2sSZ10yklPkmbRV" at path "_id"
       at MongooseError.CastError (/home/bae/app/.bae/node_modules/mongoose/lib/error/cast.js:19:11)
       at ObjectId.cast (/home/bae/app/.bae/node_modules/mongoose/lib/schema/objectid.js:134:13)
       at ObjectId.castForQuery (/home/bae/app/.bae/node_modules/mongoose/lib/schema/objectid.js:173:17)
       at module.exports (/home/bae/app/.bae/node_modules/mongoose/lib/cast.js:205:32)
       at Query.cast (/home/bae/app/.bae/node_modules/mongoose/lib/query.js:2533:10)
       at Query.findOne (/home/bae/app/.bae/node_modules/mongoose/lib/query.js:1239:10)
       at Function.findOne (/home/bae/app/.bae/node_modules/mongoose/lib/model.js:1254:13)
       at Object.exports.getUserById (/home/bae/app/src/server/proxy/user.js:39:7)
       at exports.authUser (/home/bae/app/src/server/common/auth.js:114:19)
       at Layer.handle [as handle_request] (/home/bae/app/.bae/node_modules/express/lib/router/layer.js:95:5)
       at trim_prefix (/home/bae/app/.bae/node_modules/express/lib/router/index.js:312:13)
       at /home/bae/app/.bae/node_modules/express/lib/router/index.js:280:7
       at Function.process_params (/home/bae/app/.bae/node_modules/express/lib/router/index.js:330:12)
       at next (/home/bae/app/.bae/node_modules/express/lib/router/index.js:271:10)
       at /home/bae/app/.bae/node_modules/express-session/index.js:437:7
       at Command.callback (/home/bae/app/.bae/node_modules/connect-redis/lib/connect-redis.js:158:14)
       

这个问题可能和`1问题`有相关，如果不是，参考以下解决方案：

http://stackoverflow.com/questions/15771470/mongoose-cast-to-objectid-failed-for-value

http://stackoverflow.com/questions/25380388/error-casterror-cast-to-objectid-failed-for-value-at-path-id


## 3、model对象赋值不成功，需要创建字段。

目前通过schema创建字段解决。原因未知。

## 4、SyntaxError: Use of const in strict mode.
    /home/bae/app/.bae/node_modules/connect-mongo/src/index.js:3
    const Promise = require('bluebird');
    ^^^^^
    SyntaxError: Use of const in strict mode.

## 5、Error: Can’t set headers after they are sent.

`Can’t set headers after they are sent.` => `不能发送headers因为已经发送过一次了` => 在处理HTTP请求时，服务器会先输出响应头，
然后再输出主体内容，而一旦输出过一次响应头（比如执行过 `res.writeHead()` 或 `res.write()` 或 `res.end()`），
你再尝试通过 `res.setHeader()` 或 `res.writeHead()` 来设置响应头时（有些方法比如 `res.redirect()` 会调用 `res.writeHead()`），就会报这个错误。

（说明：express中的 res.header() 相当于 res.writeHead() ，res.send() 相当于 res.write() ）

原因就是你程序有问题，重复作出响应，具体原因很多，需要自己根据以上的原则来排除。

解决：`在一个回调函数前边应该加一个return`

参考：

https://cnodejs.org/topic/53774ffecbcc396349ca1155

http://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent


## 6、Redis:ERR wrong number of arguments for 'set' command

将[Vue-order][1]部署BAE的时候遇到此Redis报错问题，系统访问就会报此错误 最后查出是因为connect-redis插件版本引起的；（该原因也可能是代码引起）


  [1]: https://github.com/giscafer/Vue-order
  
  
## 7、express-session deprecated cookie should be available in req.headers.cookie

https://segmentfault.com/a/1190000004139342
https://github.com/expressjs/session/issues/62


## 8、Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters

必须是24位16进制的字符，或者一个12字节的字符串

http://stackoverflow.com/questions/26453507/argument-passed-in-must-be-a-single-string-of-12-bytes

https://docs.mongodb.org/manual/reference/object-id/
