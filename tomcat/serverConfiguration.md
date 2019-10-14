# Tomcat服务器配置

​		Tomcat服务器的配置主要集中于tomcat/conf下的catalina.policy、catalina.properties、context.xml、server.xml、tomcat-users.xml、web.xml文件。

## server.xml

​		server.xml是tomcat服务器的核心配置文件，包含了Tomcat的Servlet容器(Catalina)的所有配置。由于配置的属性特别多，我们在这里主要讲解其中一部分重要配置。

```xml
<?xml version='1.0' encoding='utf-8'?>

<!--
    Server元素在最顶层，代表整个Tomcat容器，因此它必须是server.xml中唯一一个最外层的元素。 一个 Server 元素中可以有一个或多个Service 元素。
在第一部分的例子中，在最外层有一个元素，shutdown属性表示关闭Server的指令；port属性表示Server接收shutdown指令的端口号，设为-1可以禁掉该端口。
Server的主要任务，就是提供一个接口让客户端能够访问到这个Service集合，同时维护它所包含的所有的Service的声明周期，包括如何初始化、如何结束服务、如何找到客户端要访问的Service。
-->
<Server port="8005" shutdown="SHUTDOWN">
    <!-- 用于以日志形式输出服务器、操作系统、JVM的版本信息 -->
    <Listener className="org.apache.catalina.startup.VersionLoggerListener"/>
    <!--<Listener className="org.apache.catalina.security.SecurityListener" />-->
    <!-- 用于加载（服务器启动）和销毁（服务器停止）APR。如果找不到APR库，则会输出日志，并不影响Tomcat启动 -->
    <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on"/>
    <!--在Web应用启动之前初始化Jasper，Jasper是JSP引擎，把JVM不认识的JSP文件解析成java文件，然后编译成class文件供JVM使用。-->
    <Listener className="org.apache.catalina.core.JasperListener"/>
    <!-- 用于避免JRE内存泄漏问题 -->
    <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
    <!-- 用户加载（服务器启动）和销毁（服务器停止）全局命名服务 -->
    <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
    <!-- 用于Context停止时重建Executor池中的线程，以避免ThreadLocal相关的内存泄漏 -->
    <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>

    <!-- 全局命名服务资源   JNDI资源 -->
    <GlobalNamingResources>
        <Resource name="UserDatabase" auth="Container"
                  type="org.apache.catalina.UserDatabase"
                  description="User database that can be updated and saved"
                  factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
                  pathname="conf/tomcat-users.xml"/>
    </GlobalNamingResources>

    <!-- Service的作用，是在Connector和Engine外面包了一层，把它们组装在一起，对外提供服务。 一个 Service 可以包含多个Connector ，但是只能包含一个Engine ；其中Connector的作用是从客户端接收请求，Engine的作用是处理接收进来的请求。 在第一部分的例子中，Server中包含一个名称为“Catalina”的Service。实际上，Tomcat可以提供多个Service，不同的Service监听不同的端口 -->
    <Service name="Catalina">
        <!--
            Connector的主要功能，是接收连接请求，创建Request和Response对象用于和请求端交换数据；然后分配线程让Engine来处理这个请求，并把产生的Request和Response对象传给Engine。
        -->
        <Connector port="8080" protocol="HTTP/1.1"
                   connectionTimeout="20000"
                   redirectPort="8443"/>

        <Connector port="8009" protocol="AJP/1.3" redirectPort="8443"/>

        <!--
            Engine 组件在Service 组件中有且只有一个；Engine 是Service **组件中的请求处理组件。**Engine组件从一个或多个Connector中接收请求并处理，并将完成的响应返回给Connector，最终传递给客户端。Engine、Host和Context都是容器，但它们不是平行的关系，而是父子关系：Engine包含Host，Host包含Context。
        -->
        <Engine name="Catalina" defaultHost="localhost">

            <Realm className="org.apache.catalina.realm.LockOutRealm">
                <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
                       resourceName="UserDatabase"/>
            </Realm>

            <!--
                Host是Engine的子容器。Engine组件中可以内嵌1个或多个Host组件， 每个 Host 组件代表Engine 中的一个虚拟主机。Host组件至少有一个，且其中一个的name必须与Engine组件的defaultHost属性相匹配。
                Host虚拟主机的作用，是运行多个Web应用（一个Context代表一个Web应用），并负责安装、展开、启动和结束每个Web应用。
            -->
            <Host name="localhost" appBase="webapps"
                  unpackWARs="true" autoDeploy="true">
                <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
                       prefix="localhost_access_log." suffix=".txt"
                       pattern="%h %l %u %t &quot;%r&quot; %s %b"/>
                <!--
                    Context 元素代表在特定虚拟主机上运行的一个Web 应用。在后文中，提到Context、应用或Web应用，它们指代的都是Web应用。每个Web应用基于WAR文件，或WAR文件解压后对应的目录（这里称为应用目录）。
                -->
            </Host>
        </Engine>
    </Service>
</Server>
```



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

默认配置的几个个Listener的含义：

```xml
<!-- 用于以日志形式输出服务器、操作系统、JVM的版本信息 -->
<Listener className="org.apache.catalina.startup.VersionLoggerListener"/>
<!--<Listener className="org.apache.catalina.security.SecurityListener" />-->
<!-- 用于加载（服务器启动）和销毁（服务器停止）APR。如果找不到APR库，则会输出日志，并不影响Tomcat启动 -->
<Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on"/>
<!--在Web应用启动之前初始化Jasper，Jasper是JSP引擎，把JVM不认识的JSP文件解析成java文件，然后编译成class文件供JVM使用。-->
<Listener className="org.apache.catalina.core.JasperListener"/>
<!-- 用于避免JRE内存泄漏问题 -->
<Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
<!-- 用户加载（服务器启动）和销毁（服务器停止）全局命名服务 -->
<Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
<!-- 用于Context停止时重建Executor池中的线程，以避免ThreadLocal相关的内存泄漏 -->
<Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>
```

GlobalNamingResources中定义了全局命名服务：

```xml
	<!-- 全局命名服务资源   JNDI资源 -->
    <GlobalNamingResources>
        <Resource name="UserDatabase" auth="Container"
                  type="org.apache.catalina.UserDatabase"
                  description="User database that can be updated and saved"
                  factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
                  pathname="conf/tomcat-users.xml"/>
    </GlobalNamingResources>
```

### Service

​		该元素用于创建Service实例，默认使用org.apache.catalina.core.StandardService。默认情况下，Tomcat仅指定了Service名称，值为“Catalina”。Service可以内嵌的元素为：Listener、Executor、Connector、Engine，其中：Listener用于Service添加生命周期监听器，Executor用于配置Service共享线程池，Connector用于配置Service包含的连接器，Engine用于配置Service中链接器，Engine用于配置Service中链接器对应的Servlet容器引擎。

```xml
<Service name="Catalina">
	...
</Service>
```

一个Server服务器，可以包含多个Service服务。

### Executor

默认情况下，Service并未添加共享线程池配置。如果我们想添加一个线程池，可以在\<Service\>下添加如下配置：

```xml
<Executor name="tomcatThreadPool"
	namePrefix="catalina-exec-"
 	maxThreads="1000"
	minSpareThreads="100"
	maxIdleTime="6000"
	maxQueueSize="Integer.MAX_VALUE"
    prestartminSpareThreads="false"
 	threadPriority="5"         		 className="org.apache.catalina.core.StandardThreadExecutor">
</Executor>
```

属性说明：

| 属性                    | 含义                                                         |
| ----------------------- | ------------------------------------------------------------ |
| name                    | 线程池名称，用于Connector中指定。                            |
| namePrefix              | 所创建的每个线程的名称前缀，一个单独的线程名称namePrefix+threadNumber。 |
| maxThreads              | 池中最大线程数                                               |
| minSpareThreads         | 活跃线程数，也就是核心池线程数，这些线程不会被销毁，会一直存在。 |
| maxIdleTime             | 线程空闲时间，超过该时间后，空闲线程会被销毁，默认值为6000（1分钟），单位毫秒。 |
| maxQueueSize            | 在被执行前最大线程排队数目，默认为Int的最大值，也就是广义的无限。除非特殊情况下，这个值不需要更改，否则会有请求不会被处理的情况发生。 |
| prestartminSpareThreads | 启动线程池时是否启动minSpareThreads部分线程。默认为false，即不启动。 |
| threadPriority          | 线程池中线程优先级，默认为5，值从1到10                       |
| className               | 线程实现类，未指定情况下，默认实现类为org.apache.catalina.core.StandardThreadExecutor。如果想使用自定义线程池首先要实现org.apache.catalina.Executor接口。 |

JConsole中查看到的线程情况：

![1571058652462](.\img\1571058652462.png)

如果不配做共享线程池，那么Catalina各组件在用到线程池时会独立创建。

### Connector

Connector用于创建链接器实例。默认情况下，server.xml配置了两个连接器，一个支持HTTP协议，一个支持AJP协议。因此大多数情况下，我们并不需要新增连接器配置，只是根据需要对已有连接器进行优化。

```xml
<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="2000" redirectPort="8443"/>
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
```

属性说明：

1. port：端口号，Connector用于创建服务器端Socket并进行监听，以等待客户端请求连接。如果该属性设置为0，Tomcat将会随机选择一个可用的端口号给当前Connector使用。

2. protocol：当前Connecotr支持的访问协议。默认为HTTP/1.1，并采用自动切换机制选择一个基于JAVA NIO的连接器或者基于本地APR的连接器（根据本地是否含有Tomcat的本地库判定）。

   如果不需要采用上述自动切换的机制，而是明确指定协议，可以使用一下值。

   Http协议：

   ```
   org.apache.coyote.http11.Http11NioProtocol， 非阻塞式Java NIO连接器
   org.apache.coyote.http11.Http11Nio2Protocol， 非阻塞式Java NIO2连接器
   org.apache.coyote.http11.Http11AprProtocol， APR连接器
   ```

   AJP协议：

   ```
   org.apache.coyote.ajp.AjpNioProtocol， 非阻塞式Java NIO连接器
   org.apache.coyote.ajp.AjpNio2Protocol， 非阻塞式Java NIO2连接器
   org.apache.coyote.ajp.AjpAprProtocolO2， APR连接器
   ```

3. connectionTimeOut：Connector接收连接后等待超时时间，单位为毫秒。-1表示不超时。

4. redirectPort:当前Connector不支持SSL请求，接收到了一个请求，并且也符合security-constraint约束，需要SSL传输，Catalina自动将请求重定向到指定的端口。

5. executor：指定共享线程池的名称，也可以通过maxThreads、minSpareThreads等属性配置内部线程池。通过这个属性就可以使用上面Executor讲解中定义的线程池。

6. URIEncoding：用于指定编码URI的字符编码，Tomcat8.x版本默认的编码是UTF-8，tomcat7.x版本默认为ISO-8859-1.

### Engine

Engine作为Servlet引擎的顶级元素，内部可以嵌入：Cluster、Listener、Realm、Valve和Host。

```xml
<Engine name="Catalina" defaultHost="localhost">
	...
</Engine>
```

属性说明：

1. name：用于指定Engine的名称，默认为Catalina。该名称会影响一部分Tomcat的存储路径（如临时文件）。
2. defaultHost：默认使用的虚拟机主机名称，当客户端请求指向的主机无效时，将交由默认的虚拟主机处理，默认为localhost。

### Host

​		Host元素用于配置一个虚拟主机，它支持一下嵌入元素：Alias、Cluster、Listener、Valve、Realm、Context。如果在Engine下配置Realm，那么此配置将在当前Engine下的所有Host中共享。同样，如果在Host中配置Realm，则当前Host下的所有Context中共享。Context中的Realm优先级 > Host 的Realm优先级 > Engine中的Realm优先级。

```xml
<Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true">
	...
</Host>
```

属性说明：

1. name：当前Host同样的网络名词，必须与DNS服务器上的注册信息一致。Engine中包含的Host必须存在一个名称与Engine的defaultHost设置一致。
2. appBase：当前Host的应用基础目录，当前Host上部署的Web应用均在该目录下（可以是绝对目录，相对路径）。默认为webapps。
3. unpackWARs：设置为true，Host在启动时会将appBase目录下war包解压为目录。设置为false，Host将直接从war文件启动。
4. autoDeploy：控制tomcat是否在运行时定期检测并自动部署新增或变更的web应用。

通过Host添加别名，我们可以实现同一个Host拥有多个网络名词，配置如下：

```xml
<Host name="www.web1.com" appBase="webapps" unpackWARs="true" autoDeploy="true">
	<Alais>www.web2.com</Alais>
    ...
</Host>
```

这个时候，我们就可以通过两个域名访问当前Host下的应用（需要确保DNS或hosts中添加域名的映射配置）。

### Context

Context用于配置一个Web应用，默认的配置如下：

```xml
<Context docBase="myApp" path="/myApp">
	...
</Context>
```

属性描述：

1. docBase：web应用目录或者war包的部署路径。可以是绝对路径，也可以是相对于Host appBase的相对路径。

2. path：web应用的Context路径。如果我们Host名为localhost，则该web应用访问的根路径为：http://localhost:8080/myApp。 

   它支持的内嵌元素为CookieProcessor，Loader，Manager，Realm，Resources，WatchedResource，JarScanner，Valve。

```xml
<Host name="www.tomcat.com" appbase="webapps" unpackWars="true" autoDeploy="true">
	<Context docBase="D:\servlet_project03" path="/myApp"></Context>
    <valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log" suffix=".txt" pattern="%h %l %u %t &quot;%r&quot; %s %b"/>
</Host>
```

## tomcat-users.xml

​	 该配置文件中，主要配置的是Tomcat的用户，角色等信息，用来控制Tomcat中manager，host-manager的访问权限。

