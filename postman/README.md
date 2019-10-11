# Postman

​	一个HTTP接口测试的辅助工具

## 资源介绍

[下载Postman](https://www.getpostman.com/downloads/ )，有windows、Mac、Linux版本，安装简单，直接安装就行了。

[Postman官网学习中心](https://learning.getpostman.com)

[最强PostMan使用教程（1）](https://blog.csdn.net/u013613428/article/category/6255615)

[最强PostMan使用教程（2） - 在test suite中运行test case](https://blog.csdn.net/u013613428/article/details/51557914)

[最强PostMan使用教程（3）- script](https://blog.csdn.net/u013613428/article/details/78238043)

[最强PostMan使用教程（4）- 使用Postman的模拟服务模拟（mock）后端](https://blog.csdn.net/u013613428/article/details/82053793#comments)

[最强PostMan使用教程（5）- 工作协同：使用Postman生成接口文档和示例](https://blog.csdn.net/u013613428/article/details/82120152#comments)

## 初识Postman

​		第一次使用Postman的时候，首次进入软件会有一个登录界面，这是由于Postman提供了一个云服务器，将我们平时测试的接口或形成测试集保存在云服务器上，当我们在其它电脑上去也可以通过postman的云服务器上同步使用的机器上去，保留了一个工作状态。并且还可以加入到一个工作组中，让一个工作组里面的人员一起共享工作组中的测试请求，这是一个很便捷的功能。 如果不想登录进去，也可以将登录窗口关闭，也是可以进入到工作界面中去，但是就没法享受到上面云服务保存配置给我们带来的便捷功能。

**模拟各种HTTP requests**
		从常用的 GET、POST 到 RESTful 的 PUT 、 DELETE …等等。 甚至还可以发送文件、送出额外的 header。

**Collection 功能（测试集合）**
		Collection 是 requests的集合，在做完一個测试的時候， 你可以把這次的 request 存到特定的 Collection 里面，如此一來，下次要做同样的测试时，就不需要重新输入。而且一个collection可以包含多条request，如果我们把一个request当成一个test case，那collection就可以看成是一个test suite。通过collection的归类，我们可以良好的分类测试软件所提供的API.而且 Collection 还可以 Import 或是 Share 出來，让团队里面的所有人共享你建立起來的 Collection。

**人性化的Response整理**
		一般在用其他工具來测试的时候，response的内容通常都是纯文字的 raw， 但如果是 JSON ，就是塞成一整行的 JSON。这会造成阅读的障碍 ，而 Postman 可以针对response内容的格式自动美化。 JSON、 XML 或是 HTML 都會整理成我们可以阅读的格式

**内置测试脚本语言**
		Postman支持编写测试脚本，可以快速的检查request的结果，并返回测试结果

**设定变量与环境**
		Postman 可以自由 设定变量与Environment，一般我们在编辑request，校验response的时候，总会需要重复输入某些字符，比如url，postman允许我们设定变量来保存这些值。并且把变量保存在不同的环境中。比如，我們可能会有多种环境， development 、 staging 或 local， 而这几种环境中的 request URL 也各不相同，但我们可以在不同的环境中设定同样的变量，只是变量的值不一样，这样我们就不用修改我们的测试脚本，而测试不同的环境。

**Mock服务**

​		模拟服务端返回结果。

