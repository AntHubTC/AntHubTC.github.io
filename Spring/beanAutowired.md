## Bean的自动装配

- 自动装配是Spring满足bean依赖一种方式；
- Spring会在上下文中自动寻找，并自动给bean装配属性。

在spring中有三种自动装配的方式

1. 在xml中显示的配置；
2. 在java中显示配置；
3. 隐式的自动装配bean。

### ByName自动装配

```xml
<!--
	byName:会自动在容器上下文中查找。和自己对象set方法后面的值对应的bean id
-->
<bean id="people" class="com.tc.pojo.People" autowire="byName">
    <property name="name" value="涛xxx"/>
</bean>
```

### ByType自动装配

```xml
<bean class="com.tc.pojo.Cat"/>
<bean class="com.tc.pojo.Dog"/>
<!--
	byType: 会自动在容器上下文中查找，和自己对象属性类型相同的bean
-->
<bean id="people" class="com.tc.pojo.People" autowire="byType">
	<property name="name" value="iaisodf"/>
</bean>
```

小结：

- byName的时候，需要保证所有bean的id唯一，并且这个bean和自动注入属性的set方法的值一致！
- byType的时候，需要保证所有bean的class唯一，并且这个bean需要和自动注入的属性的类型一致！

### 使用注解自动装配

	jdk1.5支持的注解，Spring2.5就支持注解了！

The introduction of annotation-based configuration raised the question of whether this approach is “better” than XML. 

要使用注解须知：

1. 导入约束

2. 配置注解的支持

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           https://www.springframework.org/schema/context/spring-context.xsd">
   	<!-- 开启注解的支持 -->
       <context:annotation-config/>
   
   </beans>
   ```

#### @Autowired

		@Autowired是根据类型进行自动装配的。如果当Spring上下文中存在不止一个UserDao类型的bean时，就会抛出BeanCreationException异常;如果Spring上下文中不存在UserDao类型的bean，也会抛出BeanCreationException异常。我们可以使用@Qualifier配合@Autowired来解决这些问题。

> @Nullable 字段标记了这个注解，说明这个字段可以为null

```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
    boolean required() default true;
}
```

		当使用@Autowired注解的时候，其实默认就是@Autowired(required=true)，表示注入的时候，该bean必须存在，否则就会注入失败。
	
		@Autowired(required=false)：表示忽略当前要注入的bean，如果有直接注入，没有跳过，不会报错。
	
		如果@Autowired自动装配的环境比较复杂，自动装配无法通过一个@Autowired完成的时候，我们可以使用@Qualifier(value="xxx")去配置@Autowired的使用，指定一个唯一的bean对象注入。

#### @Resource注解

```java
public class People {
    @Resource(name = "cat2")
    private Cat cat;
    @Resource
    private Dog dog;
}
```

@Resource装配顺序 
　　1. 如果同时指定了name和type，则从Spring上下文中找到唯一匹配的bean进行装配，找不到则抛出异常 
　　2. 如果指定了name，则从上下文中查找名称（id）匹配的bean进行装配，找不到则抛出异常 
　　3. 如果指定了type，则从上下文中找到类型匹配的唯一bean进行装配，找不到或者找到多个，都会抛出异常 
　　4. 如果既没有指定name，又没有指定type，则自动按照byName方式进行装配；如果没有匹配，则回退为一个原始类型进行匹配，如果匹配则自动装配

[@Autowired 与@Resource的区别（详细）](https://blog.csdn.net/weixin_40423597/article/details/80643990)

### 使用注解开发

#### xml配置

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

    <context:component-scan base-package="com.tc.spring">
<!--        <context:exclude-filter type="" expression=""/>-->
<!--        <context:include-filter type="" expression=""/>-->
    </context:component-scan>
    <context:annotation-config/>
</beans>
```

#### 属性注入

```java
@Component
public class User {
    public String name;
    
    // 相当于<property name="name" value="tc"/>
    @Value("tc")
    public void setName(String name) {
        this.name = name;
    }
}
```

#### 衍生的注解

@Component有几个衍生注解，我们在web开发中，会按MVC三层架构分层！

- dao  @Respository

- service   @Service

- controller @Controller

  这四个注解功能都是一样的，都是代表某个类注册到Spring中，装配Bean

#### 自动装配配置

```
- @Autowired：自动装配通过类型、名字
	如果Autowired不能唯一自动装配上属性，则需要通过@Qualifier(value="xxx")
- @Nullable	字段标记了这个注解，表明这个字段可以为null
- @Resource	自动装配通过名字、类型。
```

#### 作用域

@Scope

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Scope {
    @AliasFor("scopeName") // singleton单例  prototype原型
    String value() default "";

    @AliasFor("value")
    String scopeName() default "";

    ScopedProxyMode proxyMode() default ScopedProxyMode.DEFAULT;
}
```

#### 小结

	xml与注解：

- xml更加万能，适用于任何场合！维护简单方便
- 注解不是自己类使用不了，维护相对复杂。

xml与注解最佳实践：

- xml用来管理bean；
- 注解只负责完成属性的注入；
- 我们在使用的过程中，只需要注意一定要让注解配置生效。

### 使用java的方式配置Spring

User.java

```java
package com.tc.pojo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

// 这里这个注解的意思就是这个类被Spring接管了，注入到了容器中
@Component
public class User {
    private String name;

    public String getName() {
        return name;
    }

    @Value("zhangsan")
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

TcConfig.java

```java
package com.tc.config;

import com.tc.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration // 这个也会Spring容器托管，注入到容器中，因为它本身也是一个@Component
// @Configuration 代表这一个配置类，就和我们之前看到的beans.xml类似。
@ComponentScan("com.tc.pojo")
@Import(TcConfig2.class)
public class TcConfig {

    // 注入一个bean，相当于我们之前写的一个bean标签
    // 这个方法的名字，就相当于bean标签中的id属性
    // 这个方法的返回值，就相当于bean标签中的class属性
    @Bean
    public User zhangsan() {
        User user = new User();
        return user; // 就是返回要注入的bean对象。
    }
}
```

TcConfig2.java

```java
package com.tc.config;

import com.tc.pojo.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TcConfig2 {

    @Bean
    public User zhangsan2 () {
        User user = new User();
        return user;
    }
}
```

Main.java

```java
package com.tc;

import com.tc.config.TcConfig;
import com.tc.pojo.User;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(TcConfig.class);

        User zhangsan = (User) context.getBean("zhangsan");
        System.out.println(zhangsan);
        User zhangsan2 = (User) context.getBean("zhangsan2");
        System.out.println(zhangsan2);
    }
}
```