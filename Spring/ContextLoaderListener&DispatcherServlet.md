# Spring 中ContextLoaderListener和DispatcherServlet所加载的context的关系

> 转自 https://blog.csdn.net/woshiren123ew/article/details/70448082



## 区别

- ContextLoaderListener加载的applicationContext是web应用全局的上下文，而DispatcherServlet加载的applicationContext是spring MVC的上下文。

- ContextLoaderListener所加载的context被spring通过servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context)存放到ServletContext的attribute中。该上下文可通过WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext)或WebApplicationContextUtils.getWebApplicationContext(servletContext)方法来获取。 
  DispatcherServlet加载context完成后，如果publishContext属性的值设置为true的话(缺省为true) 会将context存放在ServletContext的key为org.springframework.web.servlet.FrameworkServlet.CONTEXT. + (servletName)的attribute中。

  xml配置如下：

  ```xml
  <servlet>  
      <servlet-name>dispatcher</servlet-name>  
      <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
      <init-param>  
      <param-name>contextConfigLocation</param-name>  
      <param-value>classpath*:dispatcher-servlet.xml</param-value>  
      </init-param>  
  </servlet>  
  ```

  

- DispatcherServlet所加载的applicationContext可以认为是mvc私有的context，由于保存在servletContext中的key值与通过ContextLoaderListener加载进来的applicationContext使用的key值不相同，因此如果只使用DispatcherServlet加载context的话，如果程序中有地方使用WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext) 来试图获取applicationContext时，就会抛出”No WebApplicationContext found: no ContextLoaderListener registered?”的exception。

## 关联

- Spring的ContextLoaderListener所创建出来的context和Spring MVC DispatcherServlet所创建出来的context是父子关系，FrameworkServlet在实例化对应的applicationContext后通过setParent将从ServletContext中获取到的ContextLoaderListener创建的applicaitonContext设置成父上下文，然后加载在对应的xml配置文件对其初始化。

- Father WebApplicationContext里的bean可以被注入到child WebApplicationContext里的bean，而child WebApplicationContext的bean则不能被注入到parent WebApplicationContext里的bean。所以在使用**Spring MVC时启用自动检测功能，应在applicationContext.xml里只component-scan非Controller的类，而在Spring MVC里只component-scan Controller类** (否则会重复注入初始化，这个问题遇到过)

  applicationContext.xml配置如下

  ```xml
  <context:component-scan base-package="com.test">
     <context:exclude-filter  expression="org.springframework.stereotype.Controller" type="annotation" />
     <context:exclude-filter type="annotation" expression="org.springframework.web.bind.annotation.ControllerAdvice" />
  </context:component-scan>
  ```

  dispatcher-servlet.xml的配置如下

  ```xml
  <context:component-scan base-package="com.test.web" use-default-filters="false">
      <context:include-filter expression="org.springframework.stereotype.Controller"
          type="annotation" />
      <context:include-filter type="annotation" expression="org.springframework.web.bind.annotation.ControllerAdvice" />
  </context:component-scan>
  ```

  如果不这么分开扫描的话，那么父容器和子容器中都会有相对应的bean实例。他们因为不在同一个容器中，所以虽然他们bean的id相同也不报错，但这无疑会加应用的负担。同时会造成难以发现的问题。比如我遇到的一个问题：

  > 将一个ApplicationListener实现加上@Component注解，在applicationContext.xml和dispatcherServlet.xml中配置了相同的扫描方案。在触发监听事件的时候调用两次onApplicationEvent方法。这是因为在Spring的上下文和Spring MVC的上下文有两个相同名称的bean，在调用完子类中的监听器后Spring回去查看父容器中是否也有监听器在监听对应的事件。如果有则调用监听器方法

  ## 注意

  ?		虽然这两个context上下文是一对父子关系，但它们加载的bean不是合并存储的，所以个人建议，基于mvc相关的spring配置由DispatcherServlet加载，而其余的JavaBean都交给ContextLoaderListener加载

