# SpringBoot整合Filter

源代码参考：spring-boot-filter项目 （下面省略建立相关Serlvet， 详情参考项目代码）

------

## pom.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.tc</groupId>
    <artifactId>03-spring-boot-filter</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```



### 回顾SpringMVC配置Filter方式：

以前写Filter是在web.xml中配置:

```xml
<filter>
    <filter-name>FirstFilter</filter-name>
    <filter-class>com.tc.FirstFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>FirstFilter</filter-name>
    <url-parttern>/first</url-parttern>
</filter-mapping>
```



### SpringBoot整合方式一：

​    通过@WebFilter注解来标识Filter，定义Filter的名称和过滤的请求路径等信息，然后在启动类上加上@ServletComponentScan注解，然后SpringBoot就会去扫描配置的Filter。

编写Filter：

```java
package com.tc.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(filterName = "FirstFilter", urlPatterns = "/first")
public class FirstFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("我进入了First Filter!~");

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

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
 * @ServletComponentScan 这个注解会去扫描Servlet、Filter、Listener等。
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

​	通过编写注册bean的方式注册Filter。

​	首先编写Filter：

```java
package com.tc.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

public class SecondFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("我进入了First Filter!~");

        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
```

编写注册bean：

```java
package com.tc;

import com.tc.filter.SecondFilter;
import com.tc.servlet.SecondServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletComponentScan;
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
}

```

