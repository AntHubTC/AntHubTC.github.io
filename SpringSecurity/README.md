# Spring Security OAuth2.0认证授权

​	学习来源：哔哩哔哩上《[java进阶教程2天快速入门Spring Security OAuth2.0认证授权](https://www.bilibili.com/video/BV1VE411h7aL?p=13)》

​	文档参考：[地址](https://so.csdn.net/so/search/s.do?q=%E8%B7%9F%E7%9D%80%E7%87%95%E9%9D%92%E5%AD%A6Spring%20Security&t=blog&u=weixin_44062339)

## 基本概念

### 什么是认证

​		进入移动互联网时代，大家每天都在刷手机，常用的软件有微信、支付宝、头条等，下边拿微信来举例子说明认证相关的基本概念，在初次使用微信前需要注册成为微信用户，然后输入账号和密码即可登录微信，输入账号和密码登录微信的过程就是认证。

系统为什么要认证？

​		认证是为了保护系统的隐私数据与资源，用户的身份合法方可访问该系统的资源。

​		**认证** ：用户认证就是判断一个用户的身份是否合法的过程，用户去访问系统资源时系统要求验证用户的身份信	息，身份合法方可继续访问，不合法则拒绝访问。常见的用户身份认证方式有：用户名密码登录，二维码登录，手机短信登录，指纹认证等方式。

### 什么是会话

​		用户认证通过后，为了避免用户的每次操作都进行认证可将用户的信息保证在会话中。会话就是系统为了保持当前用户的登录状态所提供的机制，常见的有基于**session方式**、基于**token方式**等。

基于session的认证方式如下图：

![基于session的认证方式](.\img\20190930220007898.png)

​		它的交互流程是，用户认证成功后，在服务端生成用户相关的数据保存在session(当前会话)中，发给客户端的 sesssion_id 存放到 cookie 中，这样用户客户端请求时带上 session_id 就可以验证服务器端是否存在 session 数据，以此完成用户的合法校验，当用户退出系统或session过期销毁时,客户端的session_id也就无效了。

基于token方式如下图：

![基于token方式](.\img\20190930220015350.png)

​		它的交互流程是，用户认证成功后，服务端生成一个token发给客户端，客户端可以放到 cookie 或 localStorage 等存储中，每次请求时带上 token，服务端收到token通过验证后即可确认用户身份。

### 什么是授权

​		还拿微信来举例子，微信登录成功后用户即可使用微信的功能，比如，发红包、发朋友圈、添加好友等，没有绑定银行卡的用户是无法发送红包的，绑定银行卡的用户才可以发红包，发红包功能、发朋友圈功能都是微信的资源即功能资源，用户拥有发红包功能的权限才可以正常使用发送红包功能，拥有发朋友圈功能的权限才可以使用发朋友圈功能，这个根据用户的权限来控制用户使用资源的过程就是授权。

为什么要授权？

认证是为了保证用户身份的合法性，授权则是为了更细粒度的对隐私数据进行划分，授权是在认证通过后发生的，控制不同的用户能够访问不同的资源。

授权： 授权是用户认证通过根据用户的权限来控制用户访问资源的过程，拥有资源的访问权限则正常访问，没有权限则拒绝访问。

### 授权的数据模型

如何进行授权即如何对用户访问资源进行控制，首先需要学习授权相关的数据模型。

授权可简单理解为Who对What(which)进行How操作，包括如下：

Who，即主体（Subject），主体一般是指用户，也可以是程序，需要访问系统中的资源。

What，即资源（Resource），如系统菜单、页面、按钮、代码方法、系统商品信息、系统订单信息等。系统菜单、页面、按钮、代码方法都属于系统功能资源，对于web系统每个功能资源通常对应一个URL；系统商品信息、系统订单信息都属于实体资源（数据资源），实体资源由资源类型和资源实例组成，比如商品信息为资源类型，商品编号 为001的商品为资源实例。

How，权限/许可（Permission），规定了用户对资源的操作许可，权限离开资源没有意义，如用户查询权限、用户添加权限、某个代码方法的调用权限、编号为001的用户的修改权限等，通过权限可知用户对哪些资源都有哪些操作许可。

主体、资源、权限关系如下图：

![主体、资源、权限关系](.\img\20191008205328566.png)

主体、资源、权限相关的数据模型如下：

主体（用户id、账号、密码、…）

资源（资源id、资源名称、访问地址、…）

权限（权限id、权限标识、权限名称、资源id、…）

角色（角色id、角色名称、…）

角色和权限关系（角色id、权限id、…）

主体（用户）和角色关系（用户id、角色id、…）

主体（用户）、资源、权限关系如下图：

![主体（用户）、资源、权限关系](.\img\20191008205350838.png)

通常企业开发中将资源和权限表合并为一张权限表，如下：

资源（资源id、资源名称、访问地址、…）

权限（权限id、权限标识、权限名称、资源id、…）

合并为：

权限（权限id、权限标识、权限名称、资源名称、资源访问地址、…）

修改后数据模型之间的关系如下图：

![修改后数据模型之间的关系](.\img\20191008205406483.png)

### RBAC

如何实现授权？业界通常基于RBAC实现授权。

#### 基于角色的访问控制

​		RBAC基于角色的访问控制（Role-Based Access Control）是按角色进行授权，比如：主体的角色为总经理可以查询企业运营报表，查询员工工资信息等，访问控制流程如下：

​	![基于角色的访问控制](.\img\2019100820575169.png)

根据上图中的判断逻辑，授权代码可表示如下：

```
if(主体.hasRole("总经理角色id")) {
	查询工资
}
```

如果上图中查询工资所需要的角色变化为总经理和部门经理，此时就需要修改判断逻辑为“判断用户的角色是否是总经理或部门经理”，修改代码如下：

```
if(主体.hasRole("总经理角色id") ||  主体.hasRole("部门经理角色id")){
    查询工资
}
```

根据上边的例子发现，当需要修改角色的权限时就需要修改授权的相关代码，系统可扩展性差。

#### 基于资源的访问控制

RBAC基于资源的访问控制（Resource-Based Access

Control）是按资源（或权限）进行授权，比如：用户必须具有查询工资权限才可以查询员工工资信息等，访问控制流程如下：

![基于资源的访问控制](.\img\20191008205816863.png)

根据上图中的判断，授权代码可以表示为：

```
if(主体.hasPermission("查询工资权限标识")){
    查询工资
}
```

优点：系统设计时定义好查询工资的权限标识，即使查询工资所需要的角色变化为总经理和部门经理也不需要修改授权代码，系统可扩展性强。

## 基于Session的认证方式

### 认证流程

基于Session认证方式的流程是，用户认证成功后，在服务端生成用户相关的数据保存在session(当前会话)，而发给客户端的 sesssion_id 存放到 cookie 中，这样用客户端请求时带上 session_id 就可以验证服务器端是否存在 session 数据，以此完成用户的合法校验。当用户退出系统或session过期销毁时,客户端的session_id也就无效了。下图是session认证方式的流程图：

![基于session的认证方式](.\img\20190930220007898.png)

基于Session的认证机制由Servlet规范定制，Servlet容器已实现，用户通过HttpSession的操作方法即可实现，如下是HttpSession相关的操作API。

| 方法                                         | 含义                    |
| -------------------------------------------- | ----------------------- |
| HttpSession getSession(Boolean create)       | 获取当前HttpSession对象 |
| void setAttribute(String name, Object value) | 向session中存放对象     |
| object getAttribute(String name)             | 从session中获取对象     |
| void removeAttribute(String name)            | 移除session中的对象     |
| void invalidate()                            | 使HttpSession失效       |
| 略...                                        |                         |

### 创建工程

#### 创建maven工程

创建maven工程 security-springmvc，工程结构如下：

![security-springmvc](.\img\20191009080841242.png)

引入如下依赖如下，注意：

1、由于是web工程，packaging设置为war

2、使用tomcat7-maven-plugin插件来运行工程

```xml
 <?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pbteach.security</groupId>
    <artifactId>security-springmvc</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.1.5.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.0.1</version>
            <scope>provided</scope>
        </dependency>
         <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.8</version>
        </dependency>
    </dependencies>
    <build>
        <finalName>security-springmvc</finalName>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.tomcat.maven</groupId>
                    <artifactId>tomcat7-maven-plugin</artifactId>
                    <version>2.2</version>
                </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <source>1.8</source>
                        <target>1.8</target>
                    </configuration>
                </plugin>

                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <configuration>
                        <encoding>utf-8</encoding>
                        <useDefaultDelimiters>true</useDefaultDelimiters>
                        <resources>
                            <resource>
                                <directory>src/main/resources</directory>
                                <filtering>true</filtering>
                                <includes>
                                    <include>**/*</include>
                                </includes>
                            </resource>
                            <resource>
                                <directory>src/main/java</directory>
                                <includes>
                                    <include>**/*.xml</include>
                                </includes>
                            </resource>
                        </resources>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

#### Spring 容器配置

在config包下定义ApplicationConfig.java，它对应web.xml中ContextLoaderListener的配置

```java
@Configuration
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
                ,excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class ApplicationConfig {
    //在此配置除了Controller的其它bean，比如：数据库链接池、事务管理器、业务bean等。
}
```

#### servletContext配置

本案例采用Servlet3.0无web.xml方式，的config包下定义WebConfig.java，它对应于DispatcherServlet配置。

```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
            ,includeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class WebConfig implements WebMvcConfigurer {

    //视频解析器
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
 }
```

#### 加载 Spring容器

在init包下定义Spring容器初始化类SpringApplicationInitializer，此类实现WebApplicationInitializer接口，Spring容器启动时加载WebApplicationInitializer接口的所有实现类。

```java
public class SpringApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { ApplicationConfig.class };//指定rootContext的配置类
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class }; //指定servletContext的配置类
    }

    @Override
    protected String[] getServletMappings() {
        return new String [] {"/"};
    }
}
```

SpringApplicationInitializer相当于web.xml，使用了servlet3.0开发则不需要再定义web.xml，ApplicationConfig.class对应以下配置的application-context.xml，WebConfig.class对应以下配置的spring-mvc.xml，web.xml的内容参考：

```xml
<web-app>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/application-context.xml</param-value>
    </context-param>
  
    <servlet>
        <servlet-name>springmvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>/WEB-INF/spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>springmvc</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

### 实现认证功能

#### 认证页面

```html
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="utf-8" %>
<html>
<head>
    <title>用户登录</title>
</head>
<body>
<form action="login" method="post">
    用户名：<input type="text" name="username"><br>
    密&nbsp;&nbsp;&nbsp;码:
    <input type="password" name="password"><br>
    <input type="submit" value="登录">
</form>
</body>
</html>
```

在WebConfig中新增如下配置，将/直接导向login.jsp页面：

```java
@Override
public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("login");
}
```

启动项目，访问/路径地址，进行测试

![登录页面效果](.\img\20191009080957202.png)

#### 认证接口

用户进入认证页面，输入账号和密码，点击登录，请求/login进行身份认证。

（1）定义认证接口，此接口用于对传来的用户名、密码校验，若成功则返回该用户的详细信息，否则抛出错误异常：

```java
/**
 * 认证服务
 */
public interface AuthenticationService {

    /**
     * 用户认证
     * @param authenticationRequest 用户认证请求
     * @return 认证成功的用户信息
     */
    UserDto authentication(AuthenticationRequest authenticationRequest);
}
```

认证请求结构：

```java
@Data
public class AuthenticationRequest {
    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;
}
```

认证成功后返回的用户详细信息，也就是当前登录用户的信息：

```java
/**
 * 当前登录用户信息
 */
@Data
@AllArgsConstructor
public class UserDto {

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;
}
```

（2）认证实现类，根据用户名查找用户信息，并校验密码，这里模拟了两个用户：

```java
@Service
public class AuthenticationServiceImpl implements AuthenticationService{

    @Override
    public UserDto authentication(AuthenticationRequest authenticationRequest) {
        if(authenticationRequest == null
                || StringUtils.isEmpty(authenticationRequest.getUsername())
                || StringUtils.isEmpty(authenticationRequest.getPassword())){
            throw new RuntimeException("账号或密码为空");
        }
        UserDto userDto = getUserDto(authenticationRequest.getUsername());
        if(userDto == null){
            throw new RuntimeException("查询不到该用户");
        }
        if(!authenticationRequest.getPassword().equals(userDto.getPassword())){
            throw new RuntimeException("账号或密码错误");
        }

        return userDto;
    }
    //模拟用户查询
    public UserDto getUserDto(String username){
        return userMap.get(username);
    }
    //用户信息
    private Map<String,UserDto> userMap = new HashMap<>();
    {
        userMap.put("zhangsan",new UserDto("1010","zhangsan","123","张三","133443"));
        userMap.put("lisi",new UserDto("1011","lisi","456","李四","144553"));
    }
}
```

（3）登录Controller，对/login请求处理，它调用AuthenticationService完成认证并返回登录结果提示信息：

```java
@RestController
public class LoginController {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * 用户登录
     * @param authenticationRequest 登录请求
     * @return
     */
    @PostMapping(value = "/login",produces = {"text/plain;charset=UTF-8"})
    public String login(AuthenticationRequest authenticationRequest){
        UserDetails userDetails = authenticationService.authentication(authenticationRequest);
        return userDetails.getFullname() + " 登录成功";
    }

}
```

（5）测试
启动项目，访问/路径地址，进行测试

![访问效果](.\img\20191009081040652.png)

以上的测试全部符合预期，到目前为止最基础的认证功能已经完成，它仅仅实现了对用户身份凭证的校验，若某用户认证成功，只能说明他是该系统的一个合法用户。

### 实现会话功能

会话是指用户登入系统后，系统会记住该用户的登录状态，他可以在系统连续操作直到退出系统的过程。

认证的目的是对系统资源的保护，每次对资源的访问，系统必须得知道是谁在访问资源，才能对该请求进行合法性拦截。因此，在认证成功后，一般会把认证成功的用户信息放入Session中，在后续的请求中，系统能够从Session中获取到当前用户，用这样的方式来实现会话机制。

（1）增加会话控制

首先在UserDto中定义一个SESSION_USER_KEY，作为Session中存放登录用户信息的key。

```java
public static final String SESSION_USER_KEY = "_user";
```

然后修改LoginController，认证成功后，将用户信息放入当前会话。并增加用户登出方法，登出时将session置为失效。

```java
/**
 * 用户登录
 * @param authenticationRequest 登录请求
 * @param session http会话
 * @return
 */
 @PostMapping(value = "/login",produces = "text/plain;charset=utf-8")
    public String login(AuthenticationRequest authenticationRequest, HttpSession session){

        UserDto userDto = authenticationService.authentication(authenticationRequest);
        //用户信息存入session
        session.setAttribute(UserDto.SESSION_USER_KEY,userDto);
        return userDto.getUsername() + "登录成功";
    }

    @GetMapping(value = "logout",produces = "text/plain;charset=utf-8")
    public String logout(HttpSession session){
        session.invalidate();
        return "退出成功";
    }
```

（2）增加测试资源

```java
修改LoginController，增加测试资源1，它从当前会话session中获取当前登录用户，并返回提示信息给前台。

  /**
     * 测试资源1
     * @param session
     * @return
     */
 
    @GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
    public String r1(HttpSession session){
        String fullname = null;
        Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
        if(userObj != null){
            fullname = ((UserDto)userObj).getFullname();
        }else{
            fullname = "匿名";
        }
        return fullname + " 访问资源1";
    }
```

3）测试

未登录情况下直接访问测试资源/r/r1：

![匿名访问资源1](.\img\20191009081149162.png)

成功登录的情况下访问测试资源/r/r1：
![李四访问资源](.\img\20191009081157242.png)

测试结果说明，在用户登录成功时，该用户信息已被成功放入session，并且后续请求可以正常从session中获取当前登录用户信息，符合预期结果。

### 实现授权功能

现在我们已经完成了用户身份凭证的校验以及登录的状态保持，并且我们也知道了如何获取当前登录用户(从Session中获取)的信息，接下来，用户访问系统需要经过授权，即需要完成如下功能：

匿名用户（未登录用户）访问拦截：禁止匿名用户访问某些资源。
登录用户访问拦截：根据用户的权限决定是否能访问某些资源。
（1）增加权限数据

为了实现这样的功能，我们需要在UserDto里增加权限属性，用于表示该登录用户所拥有的权限，同时修改UserDto的构造方法。

```java
@Data
@AllArgsConstructor
public class UserDto {
    public static final String SESSION_USER_KEY = "_user";

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;
    /**
     * 用户权限
     */
    private Set<String> authorities;

}
```

并在AuthenticationServiceImpl中为模拟用户初始化权限，其中张三给了p1权限，李四给了p2权限。

```java
    //用户信息
    private Map<String,UserDto> userMap = new HashMap<>();
    {
        Set<String> authorities1 = new HashSet<>();
        authorities1.add("p1");
        Set<String> authorities2 = new HashSet<>();
        authorities2.add("p2");
        userMap.put("zhangsan",new UserDto("1010","zhangsan","123","张三","133443",authorities1));
        userMap.put("lisi",new UserDto("1011","lisi","456","李四","144553",authorities2));
    }
    private UserDetails getUserDetails(String username) {
        return userDetailsMap.get(username);
    }
```

（2）增加测试资源

我们想实现针对不同的用户能访问不同的资源，前提是得有多个资源，因此在LoginController中增加测试资源2。

```java
/**
 * 测试资源2
 * @param session
 * @return
 */
@GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
public String r2(HttpSession session){
    String fullname = null;
    Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
    if(userObj != null){
        fullname = ((UserDto)userObj).getFullname();
    }else{
        fullname = "匿名";
    }
    return fullname + " 访问资源2";
}
```

（3）实现授权拦截器

在interceptor包下定义SimpleAuthenticationInterceptor拦截器，实现授权拦截：

1、校验用户是否登录

2、校验用户是否拥有操作权限

```java
@Component
public class SimpleAuthenticationInterceptor implements HandlerInterceptor {
    //请求拦截方法
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //读取会话信息
        Object object = request.getSession().getAttribute(UserDto.SESSION_USER_KEY);
        if(object == null){
            writeContent(response,"请登录");
        }
        UserDto user = (UserDto) object;
        //请求的url
        String requestURI = request.getRequestURI();
        if(user.getAuthorities().contains("p1") && requestURI.contains("/r1")){
            return true;
        }
        if(user.getAuthorities().contains("p2") && requestURI.contains("/r2")){
            return true;
        }
        writeContent(response,"权限不足，拒绝访问");
        return false;
    }

    //响应输出
    private void writeContent(HttpServletResponse response, String msg) throws IOException {
        response.setContentType("text/html;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.print(msg);
        writer.close();
        response.resetBuffer();
    }

}
```

在WebConfig中配置拦截器，匹配/r/**的资源为受保护的系统资源，访问该资源的请求进入SimpleAuthenticationInterceptor拦截器。

```java
@Autowired
 private SimpleAuthenticationInterceptor simpleAuthenticationInterceptor;
    
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(simpleAuthenticationInterceptor).addPathPatterns("/r/**");
}
```

4）测试

未登录情况下，/r/r1与/r/r2均提示 “请先登录”。

张三登录情况下，由于张三有p1权限，因此可以访问/r/r1，张三没有p2权限，访问/r/r2时提示 “权限不足 “。

李四登录情况下，由于李四有p2权限，因此可以访问/r/r2，李四没有p1权限，访问/r/r1时提示 “权限不足 “。

测试结果全部符合预期结果。

### 案例代码

[securityspringmvc](https://github.com/FallenGodCoder/FallenGodCoder.github.io/tree/master/SpringSecurity/codeSource/securityspringmvc)



# Spring Security 快速上手

## Spring Security介绍

​		Spring Security是一个能够为基于Spring的企业应用系统提供声明式的安全访问控制解决方案的安全框架。由于它是Spring生态系统中的一员，因此它伴随着整个Spring生态系统不断修正、升级，在spring boot项目中加入spring security更是十分简单，使用Spring Security 减少了为企业系统安全控制编写大量重复代码的工作。

## 创建工程

### 创建Maven工程

创建maven工程security-spring-security，工程结构如下：

![工程结构](.\img\20191009081634636.png)

2）引入以下依赖：

在security-springmvc的基础上增加spring-security的依赖：

```xml
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-web</artifactId>
            <version>5.1.4.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-config</artifactId>
            <version>5.1.4.RELEASE</version>
        </dependency>
```

### Spring容器配置

同security-springmvc.

```java
@Configuration
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
                ,excludeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class ApplicationConfig {
    //在此配置除了Controller的其它bean，比如：数据库链接池、事务管理器、业务bean等。
}
```

### Servlet Context配置

```java
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "com.pbteach.security.springmvc"
            ,includeFilters = {@ComponentScan.Filter(type = FilterType.ANNOTATION,value = Controller.class)})
public class WebConfig implements WebMvcConfigurer {

    //视频解析器
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/views/");
        viewResolver.setSuffix(".jsp");
        return viewResolver;
    }
 }
```

### 加载 Spring容器

在init包下定义Spring容器初始化类SpringApplicationInitializer，此类实现WebApplicationInitializer接口，Spring容器启动时加载WebApplicationInitializer接口的所有实现类。

```java
public class SpringApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { ApplicationConfig.class };//指定rootContext的配置类
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class<?>[] { WebConfig.class }; //指定servletContext的配置类
    }

    @Override
    protected String[] getServletMappings() {
        return new String [] {"/"};
    }
}
```

## 认证

### 认证页面

springSecurity默认提供认证页面，不需要额外开发。

![springSecurity默认提供认证页面](.\img\20191009081810807.png)

### 安全配置

spring security提供了用户名密码登录、退出、会话管理等认证功能，只需要配置即可使用。

1. 在config包下定义WebSecurityConfig，安全配置的内容包括：用户信息、密码编码器、安全拦截机制。

```java
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //配置用户信息服务
        @Bean
        public UserDetailsService userDetailsService()  {
            InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
            manager.createUser(User.withUsername("zhangsan").password("123").authorities("p1").build());
            manager.createUser(User.withUsername("lisi").password("456").authorities("p2").build());
        return manager;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
    	return  NoOpPasswordEncoder.getInstance();
    }
    //配置安全拦截机制
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/r/**").authenticated()               （1）
                .anyRequest().permitAll()                           （2）
                .and()
                .formLogin().successForwardUrl("/login-success");   （3）
    }
}
```

在userDetailsService()方法中，我们返回了一个UserDetailsService给spring容器，Spring Security会使用它来获取用户信息。我们暂时使用InMemoryUserDetailsManager实现类，并在其中分别创建了zhangsan、lisi两个用户，并设置密码和权限。

而在configure()中，我们通过HttpSecurity设置了安全拦截规则，其中包含了以下内容：

（1）url匹配/r/**的资源，经过认证后才能访问。

（2）其他url完全开放。

（3）支持form表单认证，认证成功后转向/login-success。

关于HttpSecurity的配置清单请参考附录 HttpSecurity。

加载 WebSecurityConfig
修改SpringApplicationInitializer的getRootConfigClasses()方法，添加WebSecurityConfig.class：

```java
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class<?>[] { ApplicationConfig.class, WebSecurityConfig.class};
    }
```

## Spring Security初始化

Spring Security初始化，这里有两种情况

若当前环境没有使用Spring或Spring MVC，则需要将 WebSecurityConfig(Spring Security配置类) 传入超类，以确保获取配置，并创建spring context。
相反，若当前环境已经使用spring，我们应该在现有的springContext中注册Spring Security(上一步已经做将WebSecurityConfig加载至rootcontext)，此方法可以什么都不做。
在init包下定义SpringSecurityApplicationInitializer：

```java
    public class SpringSecurityApplicationInitializer
            extends AbstractSecurityWebApplicationInitializer {
        public SpringSecurityApplicationInitializer() {
            //super(WebSecurityConfig.class);
        }
    }
```

## 默认根路径请求

在WebConfig.java中添加默认请求根路径跳转到/login，此url为spring security提供：

// 默认Url根路径跳转到/login，此url为spring security提供

```java
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("redirect:/login");
    }
```

spring security默认提供的登录页面。

## 认证成功页面

在安全配置中，认证成功将跳转到/login-success，代码如下：

```java
//配置安全拦截机制
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
            .antMatchers("/r/**").authenticated()               （1）
            .anyRequest().permitAll()                           （2）
            .and()
            .formLogin().successForwardUrl("/login-success");   （3）
}
```

spring security支持form表单认证，认证成功后转向/login-success。

在LoginController中定义/login-success:

```java
@RequestMapping(value = "/login-success",produces = {"text/plain;charset=UTF-8"})
public String loginSuccess(){
    return " 登录成功";
}
```

## 测试

（1）启动项目，访问http://localhost:8080/security-spring-security/路径地址

![登录界面](.\img\20191009081907180.png)

页面会根据WebConfig中addViewControllers配置规则，跳转至/login，/login是pring Security提供的登录页面。

（2）登录

1、输入错误的用户名、密码

![登录错误](.\img\20191009081921100.png)

2、输入正确的用户名、密码，登录成功

（3）退出

1、请求/logout退出

![注销](.\img\20191009081946780.png)

2、退出 后再访问资源自动跳转到登录页面

## 授权

实现授权需要对用户的访问进行拦截校验，校验用户的权限是否可以操作指定的资源，Spring Security默认提供授权实现方法。

在LoginController添加/r/r1或/r/r2

```java
/**
 * 测试资源1
 * @return
 */
@GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
public String r1(){
    return " 访问资源1";
}

/**
 * 测试资源2
 * @return
 */
@GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
public String r2(){
    return " 访问资源2";
}
```

在安全配置类WebSecurityConfig.java中配置授权规则：

```java
.antMatchers("/r/r1").hasAuthority("p1")                                      
 .antMatchers("/r/r2").hasAuthority("p2")
```

.antMatchers("/r/r1").hasAuthority(“p1”)表示：访问/r/r1资源的 url需要拥有p1权限。

.antMatchers("/r/r2").hasAuthority(“p2”)表示：访问/r/r2资源的 url需要拥有p2权限。

完整的WebSecurityConfig方法如下：

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
            .authorizeRequests()
            .antMatchers("/r/r1").hasAuthority("p1")
            .antMatchers("/r/r2").hasAuthority("p2")
            .antMatchers("/r/**").authenticated()
            .anyRequest().permitAll()
            .and()
            .formLogin().successForwardUrl("/login-success");
}
```

测试：

1、登录成功

2、访问/r/r1和/r/r2，有权限时则正常访问，否则返回403（拒绝访问）



## 小结

​	通过快速上手，咱们使用Spring Security实现了认证和授权，Spring Security提供了基于账号和密码的认证方式，通过安全配置即可实现请求拦截，授权功能，Spring Security能完成的不仅仅是这些。



# Spring应用详解

## 集成Spring Boot

### Spring Boot介绍

​		Spring Boot是一套Spring的快速开发框架，基于Spring 4.0设计，使用Spring Boot开发可以避免一些繁琐的工程搭建和配置，同时它集成了大量的常用框架，快速导入依赖包，避免依赖包的冲突。基本上常用的开发框架都支持Spring Boot开发，例如：MyBatis、Dubbo等，Spring 家族更是如此，例如：Spring cloud、Spring mvc、Spring security等，使用Spring Boot开发可以大大得高生产率，所以Spring Boot的使用率非常高。

​		本章节讲解如何通过Spring Boot开发Spring Security应用，Spring Boot提供spring-boot-starter-security用于开发Spring Security应用。

## 创建工程

### 创建Maven工程

创建maven工程 security-spring-boot，工程结构如下：

![security-spring-boot](.\img\20191010075247892.png)

引入以下依赖：

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.pbteach.security</groupId>
    <artifactId>security-springboot</artifactId>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.3.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>
    <dependencies>
        <!-- 以下是>spring boot依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 以下是>spring security依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>


        <!-- 以下是jsp依赖-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <scope>provided</scope>
        </dependency>
        <!--jsp页面使用jstl标签 -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
            <scope>provided</scope>
        </dependency>
        <!--用于编译jsp -->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
            <scope>provided</scope>
        </dependency>
         <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.0</version>
          </dependency>
    </dependencies>
    <build>
        <finalName>security-springboot</finalName>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.apache.tomcat.maven</groupId>
                    <artifactId>tomcat7-maven-plugin</artifactId>
                    <version>2.2</version>
                </plugin>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <configuration>
                        <source>1.8</source>
                        <target>1.8</target>
                    </configuration>
                </plugin>

                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <configuration>
                        <encoding>utf-8</encoding>
                        <useDefaultDelimiters>true</useDefaultDelimiters>
                        <resources>
                            <resource>
                                <directory>src/main/resources</directory>
                                <filtering>true</filtering>
                                <includes>
                                    <include>**/*</include>
                                </includes>
                            </resource>
                            <resource>
                                <directory>src/main/java</directory>
                                <includes>
                                    <include>**/*.xml</include>
                                </includes>
                            </resource>
                        </resources>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>

</project>
```

### spring 容器配置

SpringBoot工程启动会自动扫描启动类所在包下的所有Bean，加载到spring容器。

1）Spring Boot配置文件

在resources下添加application.properties，内容如下：

```properties
server.port=8080
server.servlet.context-path=/security-springboot
spring.application.name = security-springboot
```

2）Spring Boot 启动类

```java
@SpringBootApplication
public class SecuritySpringBootApp {
    public static void main(String[] args) {
        SpringApplication.run(SecuritySpringBootApp.class, args);
    }

}
```

### Servlet Context配置

由于Spring boot starter自动装配机制，这里无需使用@EnableWebMvc与@ComponentScan，WebConfig如下

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    //默认Url根路径跳转到/login，此url为spring security提供
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("redirect:/login");
    }
}
```

视图解析器配置在application.properties中

```properties
spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp
```

### 安全配置

由于Spring boot starter自动装配机制，这里无需使用@EnableWebSecurity，WebSecurityConfig内容如下

在config包下定义WebSecurityConfig，安全配置的内容包括：用户信息、密码编码器、安全拦截机制。

```java
 @Configuration
    public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //配置用户信息服务
        @Bean
        public UserDetailsService userDetailsService()  {
            InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
            manager.createUser(User.withUsername("zhangsan").password("123").authorities("p1").build());
            manager.createUser(User.withUsername("lisi").password("456").authorities("p2").build());
        return manager;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
    	return  NoOpPasswordEncoder.getInstance();
    }
    //配置安全拦截机制
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/r/**").authenticated()               （1）
                .anyRequest().permitAll()                           （2）
                .and()
                .formLogin().successForwardUrl("/login-success");   （3）
    }
}
```

​		在userDetailsService()方法中，我们返回了一个UserDetailsService给spring容器，Spring Security会使用它来获取用户信息。我们暂时使用InMemoryUserDetailsManager实现类，并在其中分别创建了zhangsan、lisi两个用户，并设置密码和权限。

> 而在configure()中，我们通过HttpSecurity设置了安全拦截规则，其中包含了以下内容：
> （1）url匹配/r/**的资源，经过认证后才能访问。
> （2）其他url完全开放。
> （3）支持form表单认证，认证成功后转向/login-success。

### 测试

LoginController的内容同同Spring security入门程序。

测试过程：

1、测试认证

2、测试退出

3、测试授权