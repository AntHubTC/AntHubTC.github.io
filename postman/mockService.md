# Mock服务

在整个开发过程中，前端或后端的延迟可能会阻碍相关团队有效地完成工作。一些后端的API工程师已经开始使用Postman去测试后端endpoint，而不依赖于前端UI来模拟API请求。

现在，Postman开发了一种新的模拟服务，使团队能够模拟后端服务器。前端开发人员可以模拟Postman collection（和相应的环境）中的每个endpoint，以查看潜在的响应，而无需实际启动后端。

前端，后端和API团队现在可以并行工作，从而释放之前因这些依赖性而延迟的开发人员。现在，让我们看看Postman是如何模拟后端的。

## 设置一个用于模拟的集合

在我的最强PostMan使用教程（2） - 在test suite中运行test case中已经介绍过了Collection集合，这里，前端开发得先知道有哪些url是用于和后端通信的。

在这个例子中，我们有一个Tesk Mock的集合，并且配置了同名的环境的Tesk Mock。 
集合中，有两个request：mock_r_1和mock_r_2，一个GET，一个POST，对应的path分别是/test，/tp。

![](.\img\20180825163940319.png)

接下来，让我们设置一个 mock server 并且为每一个endpoint模拟一条response。注意，这两个是必须的步骤，没有必然的先后顺序。你可以先mock response，再创建mock server，也可以先创建mock server，再mock response。这里，我们先创建一个mock server。

## 创建mock server

进入左边的导航栏，选择我们的Test mock集合，会出现一个三角符号（如下图中Postman Echo集合旁边的符号），点击之后，三角符号会反向（如下图中Test mock集合旁边的符号），并且出现针对该集合的配置。这里有一个Mocks，请选择之：

![](.\img\2018082516482974.jpg)

接下来的步骤很简单，一路点击创建即可：

![](.\img\20180825171200727.gif)

最后一个步骤，我们得到了一个mock server的地址，也就是说，这个mock server是postman在自己的服务器上为我们创建的，无论我们是否打开postman，我们都可以直接用这个地址来访问mock的API。

别担心你会忘掉这个地址，因为它会自动保存在collection的配置中，按照我们刚才是的步骤，回到这个集合中，在Mocks下面，你会看到你创建的server： 

![](.\img\20180825172247196.jpg)

点击图中的图标，会直接复制到粘贴板上。然后你可以将其保存在Tesk mock环境的变量中。也可以直接使用。

但这时，你拥有的只是一个mock server，上面没有任何服务可用。你需要在这个server上注册endpoint，并且mock对应的response，才可以使之服务于你。

### mock每个endpoint的response（创建example）

​		这里的步骤也不复杂，针对每个endpoint，或者说是host下面的path，你需要自己提供mock data。在postman里面，这个概念叫做example，即每一个你需要访问的路径／接口／资源，都可以提供一个栗子，即便你连不上，你也可以通过例子知道该路径／接口／资源大概会返回什么样的response。这个example不单单是为了mock而做的，因为postman可以生成API文档，在生成文档的时候，这个例子也会直接放在文档里，方便查阅文档的人了解接口。

具体创建步骤：

1. 打开collection，选择request
2. 为request创建一个example
3. 保存example

![](.\img\20180825173651573.gif)

这里需要注意的是：

- 每个request都可以有多个example
- 每个example创建之后都可以修改
- Mock server只会采用最后创建的example

### 使用mock server

在前面的步骤中，我们已经创建了mock server，并且为每个end point至少创建了一个example。这时，mock server就不再只是一个空壳了，它会为每一创建了example的endpoint提供mock服务，mock的内容就是最后创建的example的内容。

我们可以直接在postman上测试：

![](.\img\20180825174820767.gif)

也可直接在浏览器上验证： 

![](.\img\20180825175104997.gif)

注意，在验证第二个endpoint的时候，失败的原因是，endpoint是POST权限的，但浏览器默认是用GET去访问。

### 对开发模式的启发

​		使用postman，前端团队和后端团队完全可以在约定了API接口之后，各自完成开发，而不需要收到对方进度的影响，因此在真正开始开发工作之前，接口、数据格式的约定变得尤为重要，当然，因为postman是支持组开发的，即便接口，数据有变化，也可通过share collection的方式，及时同步collection下request的变化，并立即反应到mock server上。并且，因为mock server是挂载postman的服务器上，只要有网络，前端是可以在家办公，而不用受制于内网限制的。



------------------------------------------------
版权声明：本文为CSDN博主「点火三周」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/u013613428/article/details/82053793

