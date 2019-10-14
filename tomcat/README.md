# tomcat基础

****[tomcat官网](https://tomcat.apache.org/)

[tomcat7.0官方文档](http://tomcat.apache.org/tomcat-7.0-doc/index.html)

[tomcat8.5官方文档](http://tomcat.apache.org/tomcat-8.5-doc/index.html)

[tomcat9.0官方文档](http://tomcat.apache.org/tomcat-9.0-doc/index.html)

##  Tomcat基础

### web概念

1. 软件架构

   - C/S  客户端/服务器端     如：QQ、360等等
   - B/S  浏览器/服务器端     如：京东、淘宝、网易、新浪等

2. 资源分类

   - 静态资源：所有用户访问后，得到的结果都是一样的，静态资源可以直接被浏览器解析。如：html,css,javascript,jpg
   - 动态资源：每个用户访问相同资源后，得到的结果可能不一样，称为动态资源。动态资源被访问后，需要先转换为静态资源，再返回给浏览器，通过浏览器进行解析。如：servlet/jsp,php,asp...

3. 网络通信三要素

   - IP：电子设备（计算机）在网络中的唯一标识。
   - 端口：应用程序在计算机中的唯一标识。  0-65536
   - 传输协议：规定了数据传输的规则
     - 基础协议
       - tcp: 安全协议，三次握手，速度稍慢
       - udp:不安全协议，速度快

## 常见web服务器

### 概念

​		服务器：安装了服务器软件的计算机。

​		服务器软件：接收用户请求，处理请求，做出响应。

​		web服务器软件：接收用户的请求，处理请求，做出响应。在web服务器软件中，可以部署web项目，让用户通过浏览器来访问这些项目。

### 常见web服务器软件

- tomcat  Apache基金组织，中小型的JavaEE服务器，仅仅支持少量的JavaEE规范servlet/jsp，开源的，免费的。
- websphere  IBM公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费的
- weblogic   Oracle公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费的
- Jboss Oracle公司，大型的JavaEE服务器，支持所有的JavaEE规范，收费的  (好像社区版不收费)
- Jetty 仅仅支持少量的JavaEE规范servlet/jsp，是一个开源的servlet容器，它为基于Java的web容器
- Resin  CAUCHO公司，对servlet和JSP提供了良好的支持，性能也比较优良，免费
- Undertow   红帽公司,基于 NIO 的高性能 Web 嵌入式服务器,免费
- Glassfish  Oracle公司,   Java EE应用服务器,
- WildFly  Red Hat开发，前身是JBoss。
- 其它

## Tomcat历史

​		Tomcat最初由Sun公司的软件架构师 James Duncan Davidson开发，名称为“JavaWebServer”。

​		1999年，在Davidson的帮组下，该项目于1999年于apache软件基金会旗下的JServ项目合并，并发布第一个版本(3.x)，即是现在的Tomcat，该版本实现了Servlet2.2和JSP1.1规范。

​		2001年，Tomcat发布了4.0版本，作为里程碑的版本，Tomcat完全重新设计了其架构，并实现了Servlet2.3和JSP1.2规范。

​		目前Tomcat已经更新到Tomcat 9.0.x版本，但是目前企业中的Tomcat服务器，主流版本还是7.x和8.x。

## Tomcat安装方式

根据自己的情况灵活选择安装方式，这里就不做具体描述了，网上的教程也很多。下面是安装的几种方式:

1. 下载源码包编译安装；
2. 下载官网提供的对应版本的二进制软件安装包；
3. docker安装tomcat。

## Tomcat目录结构

| 目录    | 目录下的文件              | 说明                                                         |
| ------- | ------------------------- | ------------------------------------------------------------ |
| bin     | /                         | 存放tomcat的启动、停止等批处理脚本文件                       |
|         | startup.bat、startup.sh   | 用于在windows和linux下的启动脚本                             |
|         | shutdown.bat、shutdown.sh | 用于在windows和linux下的停止脚本                             |
| conf    | /                         | 用于存放Tomcat相关的配置文件                                 |
|         | Catalina                  | 用于存储对每个虚拟机的Context配置                            |
|         | context.xml               | 用于定义所有web应用均需加载的context配置，如果web应用指定了自己的context.xml，该文件将被覆盖 |
|         | catalina.properties       | Tomcat的环境变量配置                                         |
|         | catalina.policy           | Tomcat运行的安全策略配置                                     |
|         | logging.properties        | Tomcat的日志配置文件，可以通过该文件修改Tomcat的日志级别及日志路径等。 |
|         | server.xml                | Tomcat服务器的核心配置文件                                   |
|         | tomcat-users.xml          | 定义Tomcat默认的用户及角色映射信息配置                       |
|         | web.xml                   | Tomcat中所有应用默认的部署描述文件，主要定义了基础Servlet和MIME映射。 |
| lib     | /                         | Tomcat服务器的依赖包                                         |
| logs    | /                         | Tomcat默认的日志存放目录                                     |
| webapps | /                         | Tomcat默认的Web应用部署目录                                  |
| work    | /                         | Web应用JSP代码生成和编译的临时目录                           |

## Tomcat启动停止

```bash
# 启动
# windows
双击 /bin/startup.bat
# linux
sh ./bin/startup.sh

# 停止
# windows
双击 /bin/shutdown.bat 或者直接关闭运行窗口
# linux
sh ./bin/shutdown.sh

# 访问http://localhost:8080   Tomcat默认端口8080
```

![tomcat首页](.\img\1570869195545.png)



## Tocmat源码

​		方便理解讲解tomcat后面的内容，另外如果自己去研究了源码肯定对tomcat会理解得更深一点，对自己代码水平也会有所提高。

### 下载源码

​		下载Tomcat8源码[页面地址](https://tomcat.apache.org/download-80.cgi)

![下载tomcat源码页面](.\img\1570870123776.png)

### 创建pom.xml

​		需要通过Maven组织文件，因此需要在apache-tomcat-8.5.35-src根目录下创建目录中新建catalina-home目录和pom.xml文件，如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 
    <modelVersion>4.0.0</modelVersion>
    <groupId>org.apache.tomcat</groupId>
    <artifactId>Tomcat8.5</artifactId>
    <name>Tomcat8.5</name>
    <version>8.5</version>
 
    <build>
        <finalName>Tomcat8.5</finalName>
        <sourceDirectory>java</sourceDirectory>
        <testSourceDirectory>test</testSourceDirectory>
        <resources>
            <resource>
                <directory>java</directory>
            </resource>
        </resources>
        <testResources>
           <testResource>
                <directory>test</directory>
           </testResource>
        </testResources>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.3</version>
                <configuration>
                    <encoding>UTF-8</encoding>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
 
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.easymock</groupId>
            <artifactId>easymock</artifactId>
            <version>3.4</version>
        </dependency>
        <dependency>
            <groupId>ant</groupId>
            <artifactId>ant</artifactId>
            <version>1.7.0</version>
        </dependency>
        <dependency>
            <groupId>wsdl4j</groupId>
            <artifactId>wsdl4j</artifactId>
            <version>1.6.2</version>
        </dependency>
        <dependency>
            <groupId>javax.xml</groupId>
            <artifactId>jaxrpc</artifactId>
            <version>1.1</version>
        </dependency>
        <dependency>
            <groupId>org.eclipse.jdt.core.compiler</groupId>
            <artifactId>ecj</artifactId>
            <version>4.5.1</version>
        </dependency>
       
    </dependencies>
</project>
```

![img](.\img\738818-20181203223605630-600738606.png)

​		apache-tomcat-8.5.46-src目录中的conf和webapps文件夹复制到catalina-home目录中

### 配置IDEA运行项目

Main class设置为org.apache.catalina.startup.Bootstrap

添加VM options 

```
-Dcatalina.home=catalina-home
-Dcatalina.base=catalina-home
-Djava.endorsed.dirs=catalina-home/endorsed
-Djava.io.tmpdir=catalina-home/temp
-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager
-Djava.util.logging.config.file=catalina-home/conf/logging.properties
```

![img](.\img\738818-20181203224338153-691867278.png)

运行项目,提示找不到类“CookieFIlter”，这里我从网上找的直接加上:

CookieFilter.java

```java
package util;

import java.util.Locale;
import java.util.StringTokenizer;

public class CookieFilter {
    private static final String OBFUSCATED = "[obfuscated]";

    private CookieFilter() {
        // Hide default constructor
    }

    public static String filter(String cookieHeader, String sessionId) {

        StringBuilder sb = new StringBuilder(cookieHeader.length());

        // Cookie name value pairs are ';' separated.
        // Session IDs don't use ; in the value so don't worry about quoted
        // values that contain ;
        StringTokenizer st = new StringTokenizer(cookieHeader, ";");

        boolean first = true;
        while (st.hasMoreTokens()) {
            if (first) {
                first = false;
            } else {
                sb.append(';');
            }
            sb.append(filterNameValuePair(st.nextToken(), sessionId));
        }


        return sb.toString();
    }

    private static String filterNameValuePair(String input, String sessionId) {
        int i = input.indexOf('=');
        if (i == -1) {
            return input;
        }
        String name = input.substring(0, i);
        String value = input.substring(i + 1, input.length());

        return name + "=" + filter(name, value, sessionId);
    }

    public static String filter(String cookieName, String cookieValue, String sessionId) {
        if (cookieName.toLowerCase(Locale.ENGLISH).contains("jsessionid") &&
                (sessionId == null || !cookieValue.contains(sessionId))) {
            cookieValue = OBFUSCATED;
        }

        return cookieValue;
    }
}
```

