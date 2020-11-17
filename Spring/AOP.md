# AOP

## 什么是AOP

​		AOP（Aspect Oriented Programming） 意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。AOP是OOP的延续，是软件开发中的一个热点，也是Spring框架的一个重要内容，是函数式编程的一种衍生范型。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各个部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

![在这里插入图片描述](./img/image-20201112174036311.png)

## AOP在Spring中的作用

 **提供声明式编程：允许用户自定义切面
 相关术语概念：**

横切关注点：跨越应用程序多个模块的方法或功能，即是，与我们业务逻辑无关的，但是我们需要关注的部分，就是横切关注点。如日志，安全，逻辑，缓存，事务等等

切面（Aspect）: 横切关注点被模块化的特殊对象，即它是一个类

通知（Advice）: 切面必须要完成的工作。即它是类中的一个方法。

目标（Target）: 被通知的对象

代理（Proxy）: 向目标对象应用通知后创建的对象

切入点（Ponitcut）: 切面通知执行的地点（位置）的定义

连接点（JointPoint）: 与切入点匹配的执行点

![在这里插入图片描述](./img/image-20201113011102211.png)

SpringAOP中，通过advice定义横切逻辑，Spring中支持五种类型的Advice：

| 通知类型     | 链接点               | 实现接口                                        |
| ------------ | -------------------- | ----------------------------------------------- |
| 前置通知     | 方法前               | org.springframework.aop.MethodBeforeAdvice      |
| 后置通知     | 方法后               | org.springframework.aop.AfterReturningAdvice    |
| 环绕通知     | 方法前后             | org.aopalliance.intercept.MethodInterceptor     |
| 异常抛出通知 | 方法跑出异常         | org.springframework.aop.ThrowsAdvice            |
| 引介通知     | 类中增加新的方法属性 | org.springframework.aop.IntroductionInterceptor |

即AOP在不改变原有代码情况下，去增加新的功能。

## 使用Spring实现Aop

使用aop织入，需要导入依赖包

```xml
<dependency>
 	<groupId>org.aspectj</group>
 	<artifactId>aspectjweaver</artifactId>
 	<version>1.9.4</version>
</dependency>
```

### 方式一：使用spring API接口

UserService.java

```java
public interface UserService {
    void add();
    void del();
    void modify();
    void query();
}
```

UserServiceImpl.java

```java
public class UserServiceImpl implements UserService {
    public void add() {
        // 日志输出
//        System.out.println("[debug] 用户使用了add方法");
        // 业务操作
        System.out.println("用户新增");
    }

    public void del() {
        // 日志输出
//        System.out.println("[debug] 用户使用了del方法");
        // 业务操作
        System.out.println("用户删除");
    }

    public void modify() {
        // 日志输出
//        System.out.println("[debug] 用户使用了modify方法");
        // 业务操作
        System.out.println("用户修改");
    }

    public void query() {
        // 日志输出
//        System.out.println("[debug] 用户使用了query方法");
        // 业务操作
        System.out.println("用户查询");
    }
}
```

LogAfterAdvice.java

```java
public class LogAfterAdvice implements AfterReturningAdvice {
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("LogAfterAdvice-[debug] 调用" + method.getName() + "方法 End...");
    }
}
```

LogBeforeAdvice.java

```java
public class LogBeforeAdvice implements MethodBeforeAdvice {
    /**
     *
     * @param method    要执行的目标对象的方法
     * @param args  参数
     * @param target    目标对象
     * @throws Throwable
     */
    public void before(Method method, Object[] args, Object target) throws Throwable {
        System.out.println("LogBeforeAdvice-[debug] 调用" + method.getName() + "方法 start...");
    }
}
```

LogRoundAdvice.java

```java
// 实现环绕通知
public class LogRoundAdvice implements MethodInterceptor {
    public Object invoke(MethodInvocation invocation) throws Throwable {

        System.out.println("LogRoundAdvice-[debug] 前面搞事情！");
        Object result = invocation.getMethod().invoke(invocation.getThis(), invocation.getArguments());
        System.out.println("LogRoundAdvice-[debug] 后面搞事情！");

        return result;
    }
}
```

beans-1.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="userService" class="com.tc.aop.service.UserServiceImpl"/>

    <bean id="logBeforeAdvice" class="com.tc.aop.aspect.advice.LogBeforeAdvice"/>
    <bean id="logAfterAdvice" class="com.tc.aop.aspect.advice.LogAfterAdvice"/>
    <bean id="logRoundAdvice" class="com.tc.aop.aspect.advice.LogRoundAdvice"/>

    <!-- 方式一：使用原生Spring API接口 -->
    <!-- 配置aop需要先导入aop依赖 -->
    <aop:config>
        <aop:pointcut id="logPointCut" expression="execution(* com.tc.aop.service..*.*(..))"/>

        <aop:advisor advice-ref="logBeforeAdvice" pointcut-ref="logPointCut"/>
        <aop:advisor advice-ref="logAfterAdvice" pointcut-ref="logPointCut"/>
        <aop:advisor advice-ref="logRoundAdvice" pointcut-ref="logPointCut"/>
    </aop:config>
</beans>
```

### 方式二：使用切面

DiyPointCut.java

```java
// 自定义切面
public class DiyPointCut {
    public void before() {
        System.out.println("在之前执行");
    }

    public void after() {
        System.out.println("在之后执行");
    }
}
```

beans-2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="userService" class="com.tc.aop.service.UserServiceImpl"/>

    <bean id="diyPointCut" class="com.tc.aop.aspect.advice.DiyPointCut"/>
    <!-- 方式二：自定义类 -->
    <aop:config>
        <!-- 自定义切面，ref指向要引用的类 -->
        <aop:aspect id="logAspect" ref="diyPointCut">
            <!-- 切入点 -->
            <aop:pointcut id="point" expression="execution(* com.tc.aop.service..*.*(..))"/>
            <!-- 通知 -->
            <aop:before method="before" pointcut-ref="point"/>
            <aop:after method="after" pointcut-ref="point"/>
         </aop:aspect>
    </aop:config>
</beans>
```

### 方式三：使用注解

AnnotationPointCut.java

```java
package com.tc.aop.aspect.advice;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.*;

// 方式三:使用注解实现AOP
@Aspect // 标注这个类是一个切面
public class AnnotationPointCut {

    @Before("execution(* com.tc.aop.service..*.*(..))")
    public void before() {
        System.out.println("在之前执行");
    }

    @After("execution(* com.tc.aop.service..*.*(..))")
//    @AfterReturning
//    @AfterThrowing
    public void after() {
        System.out.println("在之后执行");
    }

    // 在环绕增强中，我们可以给定一个参数，代表我们要获取处理切入点。
    @Around("execution(* com.tc.aop.service..*.*(..))")
    public void round(ProceedingJoinPoint jp) throws Throwable {
        System.out.println("环绕前");

        // 看一下签名信息
        Signature signature = jp.getSignature();
        System.out.println("signature:" + signature);

        Object proceed = jp.proceed();
        System.out.println("环绕后");
    }
}
```

beans-3.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="userService" class="com.tc.aop.service.UserServiceImpl"/>

    <bean id="annotationPointCut" class="com.tc.aop.aspect.advice.AnnotationPointCut"/>
    <!-- 开启aop注解支持  AOP实现：JDK(默认proxy-target-class="false") cglib（proxy-target-class="true"）-->
    <aop:aspectj-autoproxy proxy-target-class="false"/>
</beans>
```



## AOP(execution表达式)

​	[参考资料1](https://blog.csdn.net/somilong/article/details/74568223)  [参考资料2](https://www.cnblogs.com/sjqq/p/10241781.html)

