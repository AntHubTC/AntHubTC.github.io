# 常见面试题

## 浏览器输入url按回车背后经历了哪些？

1.在PC浏览器的地址栏输入一串URL，然后按Enter键这个页面渲染出来，这个过程中都发生了什么事?

1、首先，在浏览器地址栏中输入url，先解析url，检测url地址是否合法
2、浏览器先查看浏览器缓存-系统缓存-路由器缓存，如果缓存中有，会直接在屏幕中显示页面内容。若没有，则跳到第三步操作。
浏览器缓存：浏览器会记录DNS一段时间，因此，只是第一个地方解析DNS请求；
操作系统缓存：如果在浏览器缓存中不包含这个记录，则会使系统调用操作系统，获取操作系统的记录(保存最近的DNS查询缓存)；
路由器缓存：如果上述两个步骤均不能成功获取DNS记录，继续搜索路由器缓存；
ISP缓存：若上述均失败，继续向ISP搜索。
3、在发送http请求前，需要域名解析(DNS解析)，解析获取相应的IP地址。
4、浏览器向服务器发起tcp连接，与浏览器建立tcp三次握手。
5、握手成功后，浏览器向服务器发送http请求，请求数据包。
6、服务器处理收到的请求，将数据返回至浏览器。
7、浏览器收到HTTP响应。
8、浏览器解码响应，如果响应可以缓存，则存入缓存。
9、 浏览器发送请求获取嵌入在HTML中的资源（html，css，javascript，图片，音乐······），对于未知类型，会弹出对话框。
10、 浏览器发送异步请求。
11、页面全部渲染结束。

## 常用的HTTP方法有哪些？

- GET： 用于请求访问已经被URI（统一资源标识符）识别的资源，可以通过URL传参给服务器
- POST：用于传输信息给服务器，主要功能与GET方法类似，但一般推荐使用POST方式。
- PUT： 传输文件，报文主体中包含文件内容，保存到对应URI位置。
- HEAD： 获得报文首部，与GET方法类似，只是不返回报文主体，一般用于验证URI是否有效。
- DELETE：删除文件，与PUT方法相反，删除对应URI位置的文件。
- OPTIONS：查询相应URI支持的HTTP方法。

## get和post的区别？

​	转自http://blog.itpub.net/31561268/viewspace-2667140/

这几点答案其实有几点并不准确

- 请求缓存：GET 会被缓存，而post不会
- 收藏书签：GET可以，而POST不能
- 保留浏览器历史记录：GET可以，而POST不能
- 用处：get常用于取回数据，post用于提交数据
- 安全性：post比get相对安全一点
- 请求参数：querystring 是url的一部分get、post都可以带上。get的querystring（仅支持urlencode编码），post的参数是放在body（支持多种编码）
- 请求参数长度限制：get请求长度最多1024kb，post对请求数据没有限制

### 误区一

**“用处：get常用于取回数据，post用于提交数据”**

​		曾听到过这样一种说法：get替换post来优化网站性能，虽然这种说法没错，也的确get常被用于取回数据，但是post也被一些ui框架使用于取回数据，比如kendo ui中的grid，就是用post来接受数据的。所以结论是get、post用途也是因地制宜。如果你有使用过kendo UI，会发现分页、过滤、自定义的参数都包含在form data里面。

**请求参数**get是querystring（仅支持urlencode编码），post是放在body（支持多种编码） query参数是URL的一部分，而GET、POST等是请求方法的一种，不管是哪种请求方法，都必须有URL，而URL的query是可选的，可有可无。

###  误区二

**“请求参数长度限制：get请求长度最多1024kb，post对请求数据没有限制”**

这句话看上去实在没毛病啊，菜鸟教程也是这样说的啊。虽然字面意思上没有错误，但是理解一定要正确。我想说的是GET方法提交的url参数数据大小没有限制，在http协议中没有对url长度进行限制（不仅仅是querystring的长度），这个限制是特定的浏览器及服务器对他的限制

下面就是对各种浏览器和服务器的最大处理能力做一些说明

- IE浏览器对URL的最大限制为2083个字符
- Firefox (Browser)：对于Firefox浏览器URL的长度限制为65,536个字符。
- Safari (Browser)：URL最大长度限制为 80,000个字符。
- Opera (Browser)：URL最大长度限制为190,000个字符。
- Google (chrome)：URL最大长度限制为8182个字符。
- Apache (Server)：能接受最大url长度为8,192个字符。
- Microsoft Internet Information Server(IIS)：能接受最大url的长度为16,384个字符。

所以为了符合所有标准，url的最好不好超过最低标准的2083个字符（2k+35）。当然在做客户端程序时，url并不展示给用户，只是个程序调用，这时长度只收web服务器的影响了。对于中文的传递，一个汉字最终编码后的字符长度是9个字符。

最常见的form表单，浏览器默认的form表单，默认的content-type是application/x-www-form-urlencoded,提交的数据会按照key value的方式，jquery的ajax默认的也是这种content-type。当然在post方式中添加querystring一定是可以接收的到，但是在get方式中加body参数就不一定能成功接收到了。

### 误区三

**“post比get安全性要高”**

这里的安全是相对性，并不是真正意义上的安全，通过get提交的数据都将显示到url上，页面会被浏览器缓存，其他人查看历史记录会看到提交的数据，而post不会。另外get提交数据还可能会造成CSRF攻击。

### 误区四：“GET产生一个TCP数据包；POST产生两个TCP数据包。”

这一点理解起来还是有一定难度的,实际上，不论哪一种浏览器，在发送 POST 的时候都没有带 Expect 头，server 也自然不会发 100 continue。通过抓包发现，尽管会分两次，body 就是紧随在 header 后面发送的，根本不存在『等待服务器响应』这一说。

从另一个角度说，TCP 是传输层协议。别人问你应用层协议里的 GET 和 POST 有啥区别，你回答说这俩在传输层上发送数据的时候不一样，确定别人不抽你？参考资料：https://zhuanlan.zhihu.com/p/25028045

## cookies机制和session机制的区别

cookies机制和session机制的区别，这个也是经常会问的

- cookies数据保存在客户端，session数据保存在服务器端；
- cookies可以减轻服务器压力，但是不安全，容易进行cookies欺骗；
- session较安全，但占用服务器资源

## http和https区别

1. HTTP 的URL 以http:// 开头，而HTTPS 的URL 以https:// 开头
2. HTTP 是不安全的，而 HTTPS 是安全的
3. HTTP 标准端口是80 ，而 HTTPS 的标准端口是443
4. 在OSI 网络模型中，HTTP工作于应用层，而HTTPS 的安全传输机制工作在传输层
5. HTTP 无法加密，而HTTPS 对传输的数据进行加密
6. HTTP无需证书，而HTTPS 需要CA机构wosign的颁发的SSL证书

## 报文

7.HTTP请求报文与响应报文格式
请求报文包含三部分：
a、请求行：包含请求方法、URI、HTTP版本信息
b、请求头部（headers）字段
c、请求内容实体(body)
响应报文包含三部分：
a、状态行：包含HTTP版本、状态码、状态码的原因短语
b、响应头部（headers）字段
c、响应内容(body)实体

## 常见的 POST 提交数据方式

application/x-www-form-urlencoded
multipart/form-data
application/json
text/xml

## 什么是DNS？

域名解析服务。将主机名转换为IP地址。如将http://www.cnblogs.com/主机名转换为IP地址：211.137.51.78

## HTTP无状态

什么是Http协议无状态协议?怎么解决Http协议无状态协议?

- 无状态协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息
  - 也就是说，当客户端一次HTTP请求完成以后，客户端再发送一次HTTP请求，HTTP并不知道当前客户端是一个”老用户“。
- 可以使用Cookie来解决无状态的问题，Cookie就相当于一个通行证，第一次访问的时候给客户端发送一个Cookie，当客户端再次来的时候，拿着Cookie(通行证)，那么服务器就知道这个是”老用户“。

## URI和URL的区别

**URI，是uniform resource identifier，统一资源标识符，用来唯一的标识一个资源。**

- Web上可用的每种资源如HTML文档、图像、视频片段、程序等都是一个来URI来定位的
- URI一般由三部组成：
- ①访问资源的命名机制
- ②存放资源的主机名
- ③资源自身的名称，由路径表示，着重强调于资源。

**URL是uniform resource locator，统一资源定位器，它是一种具体的URI，即URL可以用来标识一个资源，而且还指明了如何locate这个资源。**

- URL是Internet上用来描述信息资源的字符串，主要用在各种WWW客户程序和服务器程序上，特别是著名的Mosaic。
- 采用URL可以用一种统一的格式来描述各种信息资源，包括文件、服务器的地址和目录等。URL一般由三部组成：
- ①协议(或称为服务方式)
- ②存有该资源的主机IP地址(有时也包括端口号)
- ③主机资源的具体地址。如目录和文件名等

**URN，uniform resource name，统一资源命名，是通过名字来标识资源，比如mailto:java-net@java.sun.com。**

- URI是以一种抽象的，高层次概念定义统一资源标识，而URL和URN则是具体的资源标识的方式。URL和URN都是一种URI。笼统地说，每个 URL 都是 URI，但不一定每个 URI 都是 URL。这是因为 URI 还包括一个子类，即统一资源名称 (URN)，它命名资源但不指定如何定位资源。上面的 mailto、news 和 isbn URI 都是 URN 的示例。

在Java的URI中，**一个URI实例可以代表绝对的，也可以是相对的，只要它符合URI的语法规则。而URL类则不仅符合语义，还包含了定位该资源的信息，因此它不能是相对的。**

**在Java类库中，URI类不包含任何访问资源的方法，它唯一的作用就是解析。**

**相反的是，URL类可以打开一个到达资源的流。**



[更多网络知识考点](https://lijie.blog.csdn.net/article/details/105462015?utm_medium=distribute.pc_relevant.none-task-blog-OPENSEARCH-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-1.control)