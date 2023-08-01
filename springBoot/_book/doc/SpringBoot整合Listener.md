# SpringBoot整合Listener

源代码参考：spring-boot-Listener项目

------

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tc</groupId>
    <artifactId>04-spring-boot-listener</artifactId>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>
    </dependencies>

</project>
```



### 回顾SpringMVC配置Listener方式：

以前写Servlet是在web.xml中配置:

```xml
<listener>
    <listener-class>com.tc.listener.FirstListener</listener-class>
</listener>
```



### SpringBoot整合方式一：

​    通过@WebListener注解来标识Listener，然后在启动类上加上@ServletComponentScan注解，然后SpringBoot就会去扫描配置的Listener。

编写Listener：

```java
package com.tc.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class FirstListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("contextInitialized...");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("contextDestroyed...");
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
 * @ServletComponentScan 这个注解会去扫描Listener。
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

​	通过编写注册bean的方式注册Listener。

​	首先编写Servlet：

```java
package com.tc.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

public class SecondListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("contextInitialized...");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("contextDestroyed...");
    }
}

```

编写注册bean：

```java
package com.tc;

import com.tc.filter.SecondFilter;
import com.tc.listener.SecondListener;
import com.tc.servlet.SecondServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class App2 {
    public static void main(String[] args) {
        SpringApplication.run(App2.class, args);
    }

    @Bean
    public ServletRegistrationBean getServletRegistrationBean() {
        ServletRegistrationBean bean = new ServletRegistrationBean(new SecondServlet());
        bean.setName("SecondServlet");
        bean.addUrlMappings("/second");

        return bean;
    }

    @Bean
    public FilterRegistrationBean getFilterRegistrationBean() {
        FilterRegistrationBean<SecondFilter> bean = new FilterRegistrationBean<>(new SecondFilter());
        bean.setName("SecondFilter");
        bean.addUrlPatterns("/second");

        return bean;
    }

    @Bean
    public ServletListenerRegistrationBean getServletListenerRegistrationBean() {
        ServletListenerRegistrationBean bean = new ServletListenerRegistrationBean(new SecondListener());

        return bean;
    }
}

```

