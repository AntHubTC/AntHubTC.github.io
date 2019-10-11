# 使用Postman导入swagger OPEN API

## 什么是swagger

先来普及一波与swagger相关的基本信息：

- Swagger官网：http://swagger.io


- GitHub地址：https://github.com/swagger-api


- 官方注解文档：http://docs.swagger.io/swagger-core/apidocs/index.html


- Swagger-UI地址：https://github.com/swagger-api/swagger-ui

#### Swagger简介

“Swagger是一个规范和完整的框架，用于生成、描述、调用和可视化RESTful风格的Web服务。”简单来说，Swagger是一个功能强大的接口管理工具，并且提供了多种编程语言的前后端分离解决方案。Swagger主要包含了以下4个部分：

1. Swagger可以直接嵌入项目中，通过开发时编写注释，自动生成接口文档；
2. Swagger包含了Swagger Editor，它是使用yaml语言的Swagger API的编辑器，支持导出yaml和json格式的接口文件；
3. Swagger包含了Swagger UI，它将Swagger Editor编辑好的接口文档以html的形式展示出来；
4. Swagger支持根据定义的接口导出各种语言的服务端或客户端代码。

​		其中1和4是更加面向开发的内容，开发团队要有自动生成文档的需求，在开发和自测中遵循前后端分离。而2和3是相对可以独立出来的、可供QA人员参考的接口文档管理方案，也是我们主要关注的部分。

Swagger提供了Swagger
		Editor和Swagger UI的在线demo，如下图。可以看出，Swagger可以完整地定义一个接口的内容，包括各个参数、返回值的具体结构、类型，Swagger
		Editor可以实时进行编辑并在线调试。编辑好的API可以导出为json文件，使用Swagger UI打开即可以看到更美观的接口文档。

![](.\img\20190425103706466.png)

![](.\img\20190425103718802.png)

Swagger Editor和SwaggerUI的本地部署十分简单，这两者都可以直接从Github上下载源码，将其部署到本地Tomcat服务器上，然后通过浏览器访问即可。官方还提供了其他几种部署方式，具体步骤在帮助文档中有详细说明，这里不再赘述。

## 为什么需要postman

​		可以看到swagger本身是一套完备的框架，即可面向开发也可面向用户, 功能已经很强大，那在什么情况下我们需要postman与swagger一起工作？

对我来说，主要原因如下：

- Swagger毕竟是网页打开，很多参数无法保存，而postman可以存储或者动态生成测试的参数，比如，设计到token权限的话，swagger中可能每次都需要模拟登录，而postman在Header中保存Token信息；如果需要数字签名，postman还可动态的生成数字签名
- 很多数字货币交易所的服务器都搭在境外，访问很慢，但他们大抵都提供了swagger接口的json，因此，通过将其导入到postman，我们可以在本地进行接口学习和测试，无需反复翻墙登陆swagger UI
- 启动postman比启动swagger UI方便！！！

## 导入

导入的方式很简单。

- 获取对应的swagger文档的地址或者内容
- 打开postman的import功能
- 输入链接或者内容

![](.\img\20190425105043562.gif)

对应的接口，文档描述，和参数都给你配置好了

![](.\img\2019042510530259.png)

因为也是使用{{}}, 可以直接对应到postman的variables

![](.\img\20190425105318823.png)

## 修改SWAGGER接口

但并非所有的swagger.json都能满足我们的测试需求，比如：

![](.\img\20190425105513445.png)

这里并没有给我们提供实际的地址，而且也不是http，因此，可以修改swagger文件，重新导入：

![](.\img\20190425110737674.gif)

## 修改变量并测试

- 创建一个env
- 增加一个变量

![](.\img\20190425111121897.png)

- 增加一个动态变量，比如，starttime：

![](.\img\20190425113157723.png)

- 因为每个接口上的相同参数的名字是是一样的，所以我们可以为整个collection或者folder设置统一的pre-script

  ![](.\img\20190425123740942.png)

测试一下：

![](.\img\20190425124139167.gif)