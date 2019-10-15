# Web应用配置

​		web.xml是web应用的描述文件，它支持的元素及属性来自于Servlet规范定义。在Tomcat中，Web应用的描述信息包括tomcat/conf/web.xml中默认配置以及Web应用WEB-INF/web.xml下的定制配置。

​		welcome-file-list、servlet-mapping、servlet、filter-mapping、filter、listener、context-param、absolute-ordering、administered-object、connection-factory、data-source、deny-uncovered-http-methods、description、display-name、distributable、ejb-local-ref、ejb-ref、env-entry、error-page、icon、jms-connection-factory、jms-destination、jsp-config、locale-encoding-mapping-list、login-config、mail-session、message-destination、message-destination-ref、mime-mapping、module-name、persistence-context-ref、persistence-unit-ref、post-construct、pre-destroy、resource-env-ref、resource-ref、security-constraint、security-role、service-ref、session-config。



## ServletContext初始化参数

​	我们可以通过\<context-param\>添加ServletContext初始化参数，它配置了一个键值对，这样我们可以在应用程序中使用javax.servlet.ServletContext.getInitParameter()方法获取参数。

```xml
<context-param>
	<param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext-*.xml</param-value>
    <description>Spring Config File Location</description>
</context-param>
```

上面的参数就可以在Servlet中获取：

```java
String paramValue = request.getServletContext().getInitParameter("project_param_01");
```



## 会话配置

\<session-config\>用于配置Web应用会话，包括超时时间、Cookie配置以及会话追踪模式。它将覆盖server.xml和context.xml中的配置。

```xml
<session-config>
	<session-timeout>30</session-timeout>  会话超时时间，单位：分钟
    <cookie-config>  用于配置会话跟踪cookie
    	<name>JESSIONID</name>  cookie名称
        <domain>www.itcast.cn</domain>  对应的域名
        <path>/</path> 路径
        <comment>Session Cookie</comment>  注释信息
        <http-only>true</http-only>  这个cookie只能通过http方式进行访问，JS无法读取或修改，此项增加网络访问的安全性。
        <secure>false</secure> 设置为true，表示https的请求才带这个cookie
		<max-age>3600</max-age>  cookie有效期为1个小时
    </cookie-config>
    <tracking-mode>COOKIE</tracking-mode>  会话的跟踪模式，这里采用的COOKIE
</session-config>
```

tracking-mode: 用于配置会话跟踪模式， Servlet3.0版本中支持的跟踪模式：COOKIE、URL、SSL

1. COOKIE：通过HTTP Cookie追踪会话是最常用的会话跟踪机制，而且Servlet规范也要求所有的Servlet规范都需要支持Cookie跟踪。
2. URL：URL重新是最基本的会话追踪机制。当客户端不支持Cookie时，可以采用URL重写的方式。当采用URL追踪模式时，请求路径需要包含会话标识信息，Servlet容器会根据路径中的会话标识设置请求的会话信息。如：http://www.myserver.com/juser/index.html;jsessionid=1234567890
3. SSL：对于SSL请求，通过SSL会话标识确定请求会话标识。



## Servlet配置

​		Servlet的配置主要是两部分，servlet和servlet-mapping：

```xml
<servlet>
	<servlet-name>myServlet</servlet-name>
    <servlet-class>cn.itcast.web.MyServlet</servlet-class>
    <init-param>
    	<param-name>fileName</param-name>
        <param-value>init.conf</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup> 用于控制Web应用启动时，Servlet的加载顺序。值小于0，Web应用启动时，不加载该servlet，第一次访问时加载。
    <enabled>true</enabled>  若为false，表示Servlet不处理任何请求，默认为true
</servlet>

<servlet-mapping>
	<servlet-name>myServlet</servlet-name>
    <url-pattern>*.do</url-pattern>
    <url-pattern>/myservlet/*</url-pattern>
</servlet-mapping>
```



## Listener配置

​		Listener用于监听 servlet中的事件,例如 context、 request、 session对象的创建、修改、删除,并触发相应事件。listener是观察者模式的实现,在servlet中主要用于对 context、request、 session对象的生命周期进行监控。在servlet 2.5规范中共定义了8中 Listener。在启动时, ServletContextListener的执行顺序与web.xml中的配置顺序一致,停止时执行顺序相反。

```xml
<listener>
	<listener-class>org.springframework.web.context.ContextLoaerListener</listener-class>
</listener>
```



## Filter配置

​		filter用于配置web应用过滤器,用来过滤资源请求及响应。经常用于认证、日志、加密、数据转换等操作,配置如下：

```xml
<filter>
	<filter-name>myFilter</filter-name> 过滤器名称，web.xml中必须唯一
    <filter-class>cn.itcast.web.MyFilter</filter-class> 过滤器类名，必须实现Filter接口
    <async-supported>true</async-supported>  该过滤器是否支持异步
    <init-param>  用于配置Filter的初始化参数，可以配置多个，可以通过FilterConfig.getInitParameter获取
    	<param-name>language</param-name>
        <param-value>CN</param-value>
    </init-param>
</filter>
<filter-mapping>
	<filter-name>myFilter</filter-name>
    <url-pattern>/*</url-pattern>  要拦截的URL
</filter-mapping>
```



## 欢迎页面配置

welcome-file-list 用于指定web应用的欢迎文件列表。

```xml
<welcome-file-list>
	<welcome-file>index.html</welcome-file>
    <welcome-file>index.htm</welcome-file>
    <welcome-file>index.jsp</welcome-file>
</welcome-file-list>
```

尝试请求的顺序，从上到下。



## 错误页面配置

error-page用于配置Web应用访问异常时定向到的页面，支持HTTP响应码和异常类两种形式。

```xml
<error-page>
    <error-code>404</error-code>
    <location>/404.html</location>
</error-page>
<error-page>
    <error-code>500</error-code>
    <location>/500.html</location>
</error-page>
```

