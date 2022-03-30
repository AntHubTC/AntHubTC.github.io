# Bean的创建销毁顺序

转载： https://blog.csdn.net/likun557/article/details/104368546

## 先给结论

1. **无依赖的bean创建顺序和定义的顺序一致，销毁顺序刚好相反；**
2. **通过构造器强依赖的bean，会先创建构造器参数中对应的bean，然后才会创建当前bean，销毁顺序刚好相反；**
3. **depend-on可以指定当前bean依赖的bean，通过这个可以确保depend-on指定的bean在当前bean创建之前先创建好，销毁顺序刚好相反bean的销毁顺序和bean创建的顺序相反；**

## 案例一

```java
/**
 * 无任何依赖的bean创建的顺序
 */
public class NormalBean {
    public static class Bean1 implements DisposableBean {
        public Bean1() {
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }

    public static class Bean2 implements DisposableBean {
        public Bean2() {
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }

    public static class Bean3 implements DisposableBean {
        public Bean3() {
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">
 
    <bean id="bean3" class="com.javacode2018.lesson001.demo7.NormalBean$Bean3"/>
    <bean id="bean2" class="com.javacode2018.lesson001.demo7.NormalBean$Bean2"/>
    <bean id="bean1" class="com.javacode2018.lesson001.demo7.NormalBean$Bean1"/>
</beans>
```

输出:

```
class com.javacode2018.lesson001.demo7.NormalBean$Bean3 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean2 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean1 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean1 destroy()
class com.javacode2018.lesson001.demo7.NormalBean$Bean2 destroy()
class com.javacode2018.lesson001.demo7.NormalBean$Bean3 destroy()
```

**结论：**

1. **bean对象的创建顺序和bean xml中定义的顺序一致**
2. **bean销毁的顺序和bean xml中定义的顺序相反**

## 案例二

通过构造器强依赖bean创建和销毁顺序

```java
/**
 * 强依赖的bean创建和销毁顺序
 */
public class StrongDependenceBean {
    public static class Bean1 implements DisposableBean {
        public Bean1() {
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }
 
    public static class Bean2 implements DisposableBean {
        private Bean1 bean1;
        public Bean2(Bean1 bean1) { //@1
            this.bean1 = bean1;
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }
 
    public static class Bean3 implements DisposableBean {
        private Bean2 bean2;
        public Bean3(Bean2 bean2) { //@2
            this.bean2 = bean2;
            System.out.println(this.getClass() + " constructor!");
        }
        @Override
        public void destroy() throws Exception {
            System.out.println(this.getClass() + " destroy()");
        }
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">
    <!-- bean3->bean2->bean1 -->
    <bean id="bean3" class="com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean3">
        <constructor-arg index="0" ref="bean2"/> //@1
    </bean>
    <bean id="bean2" class="com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean2">
        <constructor-arg index="0" ref="bean1"/> //@2
    </bean>
    <bean id="bean1" class="com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean1">
    </bean>
</beans>
```

输出：

```
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean1 constructor!
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean2 constructor!
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean3 constructor!
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean3 destroy()
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean2 destroy()
class com.javacode2018.lesson001.demo7.StrongDependenceBean$Bean1 destroy()
```

**结论：**

1. **bean对象的创建顺序和bean依赖的顺序一致**
2. **bean销毁的顺序和bean创建的顺序相反**

## 案例三：depend-on干预依赖顺序

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">
    <!-- 在案例一的基础上添加depends-on="bean2,bean1"依赖 -->
    <bean id="bean3" class="com.javacode2018.lesson001.demo7.NormalBean$Bean3" depends-on="bean2,bean1"/>
    <bean id="bean2" class="com.javacode2018.lesson001.demo7.NormalBean$Bean2"/>
    <bean id="bean1" class="com.javacode2018.lesson001.demo7.NormalBean$Bean1"/>
</beans>
```

输出：

```
class com.javacode2018.lesson001.demo7.NormalBean$Bean2 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean1 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean3 constructor!
class com.javacode2018.lesson001.demo7.NormalBean$Bean3 destroy()
class com.javacode2018.lesson001.demo7.NormalBean$Bean1 destroy()
class com.javacode2018.lesson001.demo7.NormalBean$Bean2 destroy()
```

**结论：**

**depends-on可以改变bean定义文件中的依赖顺序**

