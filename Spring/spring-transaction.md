# 声明式事务

## 回顾事务

- 把一组业务当成一个业务来做；要么都成功，要么都失败！
- 事务在项目开发中十分重要，涉及到数据的一致性问题，不能马虎！
- 确保完整性和一致性；

事务ACID原则：

- 原子性
- 一致性
  - 要么成功，要么失败
- 隔离性
  - 多个业务可能操作同一个资源，防止数据损坏。
- 持久性
  - 事务一但提交，无论系统发生问题，结果都不会再被影响，被持久化的写到存储器中！

## spring中的事务管理

- 声明式事务： AOP
- 编程式事务：需要在代码中，进行事务管理。

思考：为什么需要事务？

- 如果不配置事务，可能存在数据提交不一致的情况；
- 如果我们不在Spring中去配置声明式事务，我们就需要在代码中手动配置事务；
- 事务在项目开发中十分重要，设计到数据的一致性和完整性问题，不容马虎！



## 声明式事务实战

参考文档： [mybatis-spring](http://mybatis.org/spring/zh/transactions.html)

详细代码参见 spring-11-transaction

关键代码：

pom.xml

```xml
		<dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
        </dependency>

        <!-- spring操作数据库支持 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
        </dependency>
        <!-- 事务等切片支持 -->
        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.5</version>
        </dependency>
        <!-- mysql数据库驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.18</version>
        </dependency>

        <!-- mybatis包 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.3</version>
        </dependency>
        <!-- mybatis spring集成包 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.1</version>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.8</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.2.2.RELEASE</version>
        </dependency>
```

spring-dao.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop
        https://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">

    <context:property-placeholder location="jdbc.properties"/>

    <!--
        DataSource: 使用Spring的数据源替换Mybatis在mybatis-config.xml中的配置
        有哪些常见的数据源配置：c3p0 dbcp jndi druid spring-jdbc
        这里我们使用spring提供的JDBC：org.springframework.jdbc.datasource
    -->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${db.driver}"/>
        <property name="url" value="${db.url}"/>
        <property name="username" value="${db.username}"/>
        <property name="password" value="${db.password}"/>
    </bean>

    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
        <property name="mapperLocations" value="classpath:mappers/*.xml"/>
    </bean>

    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>

    <!-- 方式三 -->
    <!-- 自动搜索Mapper接口生成代理，不用写实现类 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <property name="basePackage" value="com.tc.mapper"/>
    </bean>

    <!--  =========================配置事务（保证数据ACID原则） start=============================================  -->
    <!-- 配置声明式事务 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <!-- 结合AOP实现事务的织入 -->
    <!-- 配置事务通知 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <!-- 给哪些方法配置事务 -->
        <tx:attributes>
<!--            <tx:method name="*add*" propagation="REQUIRED"/>-->
<!--            <tx:method name="*insert*" propagation="REQUIRED"/>-->
<!--            <tx:method name="*del*" propagation="REQUIRED"/>-->
<!--            <tx:method name="*remove*" propagation="REQUIRED"/>-->
<!--            <tx:method name="*update*" propagation="REQUIRED"/>-->
<!--            <tx:method name="*modify*" propagation="REQUIRED"/>-->
            <tx:method name="*query*" read-only="true"/>
            <tx:method name="*searh*" read-only="true"/>
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>
    
    <aop:config>
        <aop:pointcut id="txPointCut" expression="execution(* com.tc.service..*.*(..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
    </aop:config>
    
    <!-- 配置事务管理器模板 编程式事务用得上 -->
    <bean id="transactionTemplate"
          class="org.springframework.transaction.support.TransactionTemplate">
        <!-- 注入真正进行事务管理的事务管理器,name必须为 transactionManager否则无法注入 -->
        <property name="transactionManager" ref="transactionManager"></property>
    </bean>
    <!--  =========================配置事务（保证数据ACID原则） end=============================================  -->
</beans>
```

## Spring事务失效的情况

### 1.使用默认的事务处理

​		spring的事务默认是对`RuntimeException`进行回滚，而不继承`RuntimeException`的不回滚。因为在java的设计中，它认为不继承`RuntimeException`的异常是”checkException”或普通异常，如`IOException`，这些异常在java语法中是要求强制处理的。对于这些普通异常，spring默认它们都已经处理，所以默认不回滚。可以添加rollbackfor=Exception.class来表示所有的Exception都回滚。

​		spring事务默认只处理RuntimeException，若需要处理Exception的子类，可以如下配置。

```java
@Transactional(rollbackFor = Exception.class)
```

### 2.内部调用

​		不带事务的方法调用该类中带事务的方法，不会回滚。因为spring的回滚是用过代理模式生成的，如果是一个不带事务的方法调用该类的带事务的方法，直接通过`this.xxx()`调用，而不生成代理事务，所以事务不起作用。常见解决方法，拆类。

spring中在一个拥有事务的方法A中调用另一个会挂起事务并创建新事务的方法B，如果使用this调用这个方法B， 
此时方法B抛出了一个一场，此时的方法B的事务会失效的。并不会回滚。 

- `PROPAGATION_REQUIRED`: 如果存在一个事务，则支持当前事务。如果没有事务则开启事务；
- `PROPAGATION_REQUIRES_NEW`:总是开启一个新的事务。如果一个事务已经存在，则将这个存在的事务挂起。

如下：

```java
@Service
public class EmployeeService {
 
    @Autowired
    private EmployeeDao employeeDao;
 
    public void save(){
        try {        
            this.saveEmployee();  //此处this调用不会开启事务，数据会被保存
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    
    @Transactional(propagation = Propagation.PROPAGATION_REQUIRED)
    //此处无论是PROPAGATION_REQUIRED还是PROPAGATION_REQUIRES_NEW，事务均不生效
    public void saveEmployee(){
        Employee employee = new Employee();
        employee.setName("zhangsan");
        employee.setAge("26";
        employeeDao.save(employee);
        throw new RuntimeException();
    }
}
```

**问题原因：**

​		JDK的动态代理。只有被动态代理直接调用时才会产生事务。在SpringIoC容器中返回的调用的对象是代理对象而不是真实的对象。而这里的this是`EmployeeService`真实对象而不是代理对象。

**解决办法：**

​		方法1、在方法A上开启事务，方法B不用事务或默认事务，并在方法A的catch中`throw new RuntimeException();`(在没指定rollbackFor时，默认回滚的异常为`RuntimeException`)，这样使用的就是方法A的事务。（一定要`throw new RuntimeException();`否则异常被捕捉处理，同样不会回滚。）如下：

```java
@Transactional() //开启事务
public void save(){
    try {        
        this.saveEmployee();  //这里this调用会使事务失效，数据会被保存
    }catch (Exception e){
        e.printStackTrace();
        throw new RuntimeException();
    }
}
```

​	方法2、方法A上可以不开启事务，方法B上开启事务，并在方法A中将this调用改成动态代理调用(`AopContext.currentProxy()`),如下：

```java
public void save(){
    try {        
        EmployeeService proxy =(EmployeeService) AopContext.currentProxy();
        proxy.saveEmployee();
    }catch (Exception e){
        e.printStackTrace();
    }
}
```

​	导致事务不生效的原因可能还有很多，例如数据库引擎不支持（例如mysql需要innodb引擎可以支持事务，myisam不支持），spring的xml配置文件没有导入相应xsi:schemaLocation，再次无法一一列举