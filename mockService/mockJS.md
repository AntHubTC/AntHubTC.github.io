# MockJs

> 生成随机数据，拦截Ajax请求。

[官方wiki文档](https://github.com/nuysoft/Mock/wiki)  使用方法就不记录了，官方文档写的很细。

[MockJs开源地址](https://github.com/nuysoft/Mock)



![1592321625549](.\img\1592321625549.png)

## vue接入MockJs

​	Vue+Mockjs，模拟接口数据，实现前后端独立开发。前后端分工协作是一个非常高效的做法，但是有时前后端分离不彻底会很痛苦。前后端应该是异步进行的，进度互不影响，但是在没有mock的时候，前端却严重依赖后端的接口，总会苦苦等待后端接口出来才能继续开发。为了解决这个问题，大神就造了一个轮子，供大家使用--mock.js

### 安装

```shell
npm install mockjs --save-dev
```

### 配置

为了只在开发环境使用mock.js，而打包到生产环境时自动不使用mock.js，做以下配置：

config目录下dev.env.js

```js
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  Mock: true
})
```

config目录下prod.env.js

```js
'use strict'

module.exports = {
  NODE_ENV: '"production"',
  Mock: false
}
```

src目录下main.js

```js
// 向main.js中添加如下代码
process.env.Mock && require('./mock')
```

### 创建文件

mock目录下新建一个index.js

```javascript
// 将所有的mock文件引入
require('@/mock/usermock')
require('@/mock/wxmock')

// 在这里可以做一些通用的配置
const Mock = require("mockjs")
// 设置所有ajax请求的超时时间，模拟网络传输耗时
Mock.setup({
    timeout: 0-300
})
```

单个模块mock实现：

```js
// 引入mockjs
 const Mock = require('mockjs')
 // 获取 mock.Random 对象
 const Random = Mock.Random
 // mock一组数据
 const produceNewsData = function () {
  let articles = []
  for (let i = 0; i < 100; i++) {
    let newArticleObject = {
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    }
    articles.push(newArticleObject)
  }
  return {
    data: articles
  }
 }
 // 拦截ajax请求，配置mock的数据
 Mock.mock('/api/articles', 'get', produceNewsData)

 Mock.mock('/api/getUserInfo', "get", {
    "code": 0,
    "data": {
      "fullName": "@CNAME", // 随机生成中文人名
      "userId": 1000234234001,
      "username": "zhangsan"
    },
    "msg": "success"
})
```

然后实际请求就可以拦截进行mock数据了。