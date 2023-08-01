# SpringBoot整合Servlet

源代码参考：spring-boot-servlet项目

------

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.1.2.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.tc</groupId>
	<artifactId>02-spring-boot-servlet</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>02-spring-boot-servlet</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```



### 回顾SpringMVC配置servlet方式：

以前写Servlet是在web.xml中配置:

```xml
<serlvet>
    <servlet-name>FirstServlet</servlet-name>
    <servlet-class>com.tc.FirstServlet</servlet-class>
</serlvet>
<servlet-mapping><
     <servlet-name>FirstServlet</servlet-name>
     <url-parttern>/first</url-parttern>
</servlet-mapping>
```



### SpringBoot整合方式一：

​    通过@WebServlet注解来标识Servlet，定义Servlet的名称和Servlet的请求路径等信息，然后在启动类上加上@ServletComponentScan注解，然后SpringBoot就会去扫描配置的Servlet。

编写Servlet：

```java
package com.tc.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "FirstServlet",urlPatterns = "/first")
public class FirstServlet extends HttpServlet {
    protected Logger logger = LoggerFactory.getLogger(FirstServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.info("我进入了Servlet方法");
    }
}
```

编写启动类：

```java
package com.tc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * @ServletComponentScan 这个注解会去扫描Servlet。
 */

@SpringBootApplication
@ServletComponentScan
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

### SpringBoot整合方式二：

​	通过编写注册bean的方式注册Servlet。

​	首先编写Servlet：

```java
package com.tc.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * SpringBoot整合Servlet方式二
 *      通过方法来主持Servlet
 */
public class SecondServlet extends HttpServlet {
    protected Logger logger = LoggerFactory.getLogger(SecondServlet.class);

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        logger.info("我进入了SecondServlet的doGet方法了！~");
    }
}
```

编写注册bean：

```java
package com.tc;

import com.tc.servlet.SecondServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class App2 {
    public static void main(String[] args) {
        SpringApplication.run(App2.class, args);
    }

    @Bean
    public ServletRegistrationBean getServletRegistrationBean() {
        ServletRegistrationBean<SecondServlet> bean = new ServletRegistrationBean<>(new SecondServlet());
        bean.setName("SecondServlet");
        bean.addUrlMappings("/second");

        return bean;
    }
}
```

