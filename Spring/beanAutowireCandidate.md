# bean中的autowire-candidate又是干什么的？

转载：https://blog.csdn.net/likun557/article/details/104438417



当容器中某种类型的bean存在多个的时候，此时如果我们从容器中查找这种类型的bean的时候，会报下面这个异常：

```java
org.springframework.beans.factory.NoUniqueBeanDefinitionException
```

**原因：当从容器中按照类型查找一个bean对象的时候，容器中却找到了多个匹配的bean，此时spring不知道如何选择了，处于懵逼状态，就会报这个异常。**

这种异常主要出现在2种场景中：

1. BeanFactory的获取bean方法<T> T getBean(Class<T> requiredType) throws BeansException;

2. 自动注入通过byType的时候；

   ```java
   
   public class SetterBean {
       public interface IService{} //@1
       
       public static class ServiceA implements IService{} //@2
       public static class ServiceB implements IService{} //@3
    
       private IService service;
    
       // 这里注入的是接口类型
       public void setService(IService service) {
           this.service = service;
       }
   }
   ```

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">
    
       <bean id="serviceA" class="com.tc.demo.SetterBean$ServiceA"/>
       <bean id="serviceB" class="com.tc.demo.SetterBean$ServiceB"/>
    
       <bean id="setterBean" class="com.tc.demo.SetterBean" autowire="byType" />
   </beans>
   ```

​    **容器不知道选哪个bean，我们可以通过primary属性来指定一个主要的bean，当从容器中查找的时候，如果有多个候选的bean符合查找的类型，此时容器将返回primary="true"的bean对象。**

spring还有一种方法也可以解决这个问题，可以**设置某个bean是否在自动注入的时候是否为作为候选bean，通过bean元素的autowire-candidate属性类配置**，如下：

```xml
<bean id="serviceB" class="com.tc.demo.SetterBean$ServiceB" autowire-candidate="false"/>
```

autowire-candidate：设置当前bean在被其他对象作为自动注入对象的时候，是否作为候选bean，默认值是true。

- default：这个是默认值，autowire-candidate如果不设置，其值就是default
- true：作为候选者
- false：不作为候选者

来举例说明一下，以上面的setter注入的案例先来说一下注入的过程：

​    **容器在创建setterBean的时候，发现其autowire为byType，即按类型自动注入，此时会在SetterBean类中查找所有setter方法列表，其中就包含了setService方法，setService方法参数类型是IService，然后就会去容器中按照IService类型查找所有符合条件的bean列表，此时容器中会返回满足IService这种类型并且autowire-candidate="true"的bean，刚才有说过bean元素的autowire-candidate的默认值是true，所以容器中符合条件的候选bean有2个：serviceA和serviceB，setService方法只需要一个满足条件的bean，此时会再去看这个列表中是否只有一个主要的bean（即bean元素的primary=“ture”的bean），而bean元素的primary默认值都是false，所以没有primary为true的bean，此时spring容器懵了，不知道选哪个了，此时就报错了，抛出NoUniqueBeanDefinitionException异常**

beans元素是xml中定义bean的根元素，beans元素有个**default-autowire-candidates**属性，用于定义哪些bean可以作为候选者，default-autowire-candidates的值是个通配符如：

```xml
default-autowire-candidates="*Service"
```

spring中由beans元素的default-autowire-candidates和bean元素的autowire-candidate来决定最终bean元素autowire-candidate的值，我们来看一下bean元素autowire-candidates的解析源码：

org.springframework.beans.factory.xml.BeanDefinitionParserDelegate#parseBeanDefinitionAttributes

```java
String autowire = ele.getAttribute(AUTOWIRE_ATTRIBUTE);
bd.setAutowireMode(getAutowireMode(autowire));
if (ele.hasAttribute(DEPENDS_ON_ATTRIBUTE)) {
    String dependsOn = ele.getAttribute(DEPENDS_ON_ATTRIBUTE);
	bd.setDependsOn(StringUtils.tokenizeToStringArray(dependsOn, MULTI_VALUE_ATTRIBUTE_DELIMITERS));
}

//获取bean元素的autowire-candidate元素，autowire-candidate如果不设置，其值就是default
String autowireCandidate = ele.getAttribute(AUTOWIRE_CANDIDATE_ATTRIBUTE);
//判断bean元素的autowire-candidate元素是否等于"default"或者是否等于""
if (isDefaultValue(autowireCandidate)) { 
    //获取beans元素default-autowire-candidates属性值
    String candidatePattern = this.defaults.getAutowireCandidates();
    //判断获取beans元素default-autowire-candidates属性值是否为空，default-autowire-candidates默认值就是null
    if (candidatePattern != null) {
        //判断bean的名称是否和default-autowire-candidates的值匹配，如果匹配就将bean的autowireCandidate置为true，否则置为false
        String[] patterns = StringUtils.commaDelimitedListToStringArray(candidatePattern);
        bd.setAutowireCandidate(PatternMatchUtils.simpleMatch(patterns, beanName));
    }
} else {
    //判断bean的autowire-candidate的值是否等于"true"
    bd.setAutowireCandidate(TRUE_VALUE.equals(autowireCandidate));
}
```

