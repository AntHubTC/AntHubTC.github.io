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
    <!--  =========================配置事务（保证数据ACID原则） end=============================================  -->
</beans>
```

