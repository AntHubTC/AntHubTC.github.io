# Tomcat服务器配置

​		Tomcat服务器的配置主要集中于tomcat/conf下的catalina.policy、catalina.properties、context.xml、server.xml、tomcat-users.xml、web.xml文件。

## server.xml

​		server.xml是tomcat服务器的核心配置文件，包含了Tomcat的Servlet容器(Catalina)的所有配置。由于配置的属性特别多，我们在这里主要讲解其中一部分重要配置。

### Server

​		Server元素在最顶层，代表整个Tomcat容器，因此它必须是server.xml中唯一一个最外层的元素。 **一个** **Server** **元素中可以有一个或多个Service** **元素。**

​		在第一部分的例子中，在最外层有一个元素，shutdown属性表示关闭Server的指令；port属性表示Server接收shutdown指令的端口号，设为-1可以禁掉该端口。

​		Server的主要任务，就是提供一个接口让客户端能够访问到这个Service集合，同时维护它所包含的所有的Service的声明周期，包括如何初始化、如何结束服务、如何找到客户端要访问的Service。

​		Server是server.xml的根元素，用于创建一个Server实例，默认使用的实现类org.apache.catalina.core.StandardServer。

```xml
<Server port="8005" shutdown="SHUTDOWN">
		...
</Server>
```

port: Tomcat监听的关闭服务器的端口。

shutdown：关闭服务器的指令字符串。



Server内嵌的子元素为Listener、GlobalNamingResources、Service。

默认配置的5个Listener的含义：

