# Spring Boot拦截器

 源代码参考： 05-spring-boot-interceptor

## 拦截器介绍



## 创建一个拦截器

​	创建一个类去实现org.springframework.web.servlet.HandlerInterceptor接口，并将该类使用@Component标识为spring的组件bean。

```java
package com.tc.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 创建一个拦截器
 *
 */
@Component
public class HelloInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println(">>interceptor preHandle<<");

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println(">>interceptor postHandle请求处理之后进行调用，但是在视图被渲染之前（Controller方法调用之后）<<");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println(">>interceptor afterCompletion<<");
    }
}
```



## 拦截器注册

​	创建一个配置类，实现WebMvcConfigurer接口中的addInterceptors方法（在这个接口中还可以配置其它的东西，可以点开看看）。

​	为什么没有去继承WebMvcConfigurerAdapter适配器去实现相应的方法，由于java8开始接口类可以有实现方法，在WebMvcConfigurer中有空的实现了,所以WebMvcConfigurerAdapter标记为过时了。

```java
package com.tc.config;

import com.tc.interceptor.HelloInterceptor;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 */
/*
    @SpringBootConfiguration继承自@Configuration，二者功能也一致，标注当前类是配置类，
并会将当前类内声明的一个或多个以@Bean注解标记的方法的实例纳入到spring容器中，并且实例名就是方法名。
 */
//@Configuration
@SpringBootConfiguration
public class webMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration registration = registry.addInterceptor(new HelloInterceptor());
        registration.addPathPatterns("/**"); // 拦截根路径下的所有请求
    }
}
```