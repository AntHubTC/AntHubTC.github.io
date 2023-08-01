# SpringBoot+JPA+H2

源代码项目参考：13-spring-boot-jpa-h2

  JPA就是sprint提供的操作数据的框架。SpringDataJpa只是spring框架的一个基于JPA标准操作数据的模块。

1. 添加依赖关系：

   web组件支持:

   ```xml
   		<!-- SpringBoot web的启动器 -->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-web</artifactId>
               <version>2.0.1.RELEASE</version>
           </dependency>
   ```

   h2驱动包：

   ```xml
   		<!-- h2坐标 -->
           <dependency>
               <groupId>com.h2database</groupId>
               <artifactId>h2</artifactId>
               <scope>runtime</scope>
           </dependency>
   ```

   JPA支持：

   ```xml
   		<!-- JPA 坐标-->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-data-jpa</artifactId>
           </dependency>
   ```

2. application.properties应用配置

   spring数据源配置：

   ```properties
   # ====================== 数据库连接配置 ======================
   # H2数据库不同模式连接字串有所差异，详情参考互联网。
   # jdbc:h2:file:~/h2/testdb 这个是嵌入式本地连接，它会在你的当前用户目录下建立一个h2的文件夹，然后放一个testdb.mv.db的数据库文件。
   # jdbc:h2:mem:<databaseName> 内存模式
   # 还有其它的模式
   # 控制台访问的时候也要使用这个url。
   spring.datasource.url=jdbc:h2:mem:h2DbTest
   spring.datasource.driverClassName=org.h2.Driver
   spring.datasource.username=sa
   spring.datasource.password=
   
   # ======================= 数据初始化配置(需要JPA支持) =====================
   spring.datasource.schema=classpath:db/schema.sql
   spring.datasource.data=classpath:db/data.sql
   ```

   H2配置：

   ```properties
   # ====================== h2 web console ======================
   # 进行该配置后，h2 web consloe就可以在远程访问了。否则只能在本机访问。
   spring.h2.console.settings.web-allow-others=true
   # 进行该配置，程序开启时就会启动h2 web consloe。当然这是默认的，如果你不想在启动程序时启动h2 web consloe，那么就设置为false。
   spring.h2.console.enabled=true
   # 进行该配置，你就可以通过YOUR_URL/h2-console访问h2 web consloe。YOUR_URL是你程序的访问URl。
   spring.h2.console.path=/h2
   # 跟踪设置输出
   spring.h2.console.settings.trace=false
   ```

   JPA配置：

   ```properties
   # JPA 配置
   spring.jpa.database=h2
   spring.jpa.show-sql=true
   #spring.jpa.hibernate.ddl-auto=create-drop
   spring.jpa.hibernate.ddl-auto=none
   spring.jpa.generate-ddl=false
   ```

   spring.jpa.hibernate.ddl-auto属性：

   ​	create 启动时删数据库中的表，然后创建，退出时不删除数据表
   ​	create-drop 启动时删数据库中的表，然后创建，退出时删除数据表 如果表不存在报错
   ​	update 如果启动时表格式不一致则更新表，原有数据保留

   ​        none 默认。不做任何操作。本实例配置为none是由于我们自己有创建表的语句和数据文件，所以不让hibernate自动生成表。

   数据库初始化建表文件/src/main/resources/db/schema.sql:

   ```sql
   DROP TABLE IF EXISTS T_USER;
   CREATE TABLE T_USER(
       T_ID INT PRIMARY KEY,
       T_NAME VARCHAR(255),
       T_AGE INT(10),
       T_ADDRESS VARCHAR(300) DEFAULT ''
   );
   ```

   数据库初始化数据文件/src/main/resources/db/data.sql:

   ```sql
   INSERT INTO T_USER(T_ID,T_NAME,T_AGE,T_ADDRESS)
   VALUES (1, '张三', 23, '天空之城');
   INSERT INTO T_USER(T_ID,T_NAME,T_AGE,T_ADDRESS)
   VALUES (2, '李四', 53, '蒙古骆驼包');
   ```

3. 编写实体类

   ​       根据数据库中的字段来创建一个User实体类作为对应的操作：

   ```java
   package com.tc.entity;
   
   import javax.persistence.*;
   
   @Entity
   @Table(name = "T_USER")
   public class User {
   
       @Id
       @GeneratedValue
       @Column(name = "T_ID")
       private Long id;
   
       @Column(name = "T_NAME")
       private String name;
   
       @Column(name = "T_AGE")
       private int age;
   
       @Column(name = "T_ADDRESS")
       private String address;
   
       public Long getId() {
           return id;
       }
   
       public void setId(Long id) {
           this.id = id;
       }
   
       public String getName() {
           return name;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public int getAge() {
           return age;
       }
   
       public void setAge(int age) {
           this.age = age;
       }
   
       public String getAddress() {
           return address;
       }
   
       public void setAddress(String address) {
           this.address = address;
       }
   
       @Override
       public String toString() {
           return "User{" +
                   "id=" + id +
                   ", name='" + name + '\'' +
                   ", age=" + age +
                   ", address='" + address + '\'' +
                   '}';
       }
   }
   ```

4. 创建JPA接口类：
   ​      创建UserJPA接口并且继承SpringDataJPA内的接口作为父类，UserJPA继承了JpaRepository接口（SpringDataJPA提供的简单数据操作接口）、JpaSpecificationExecutor（SpringDataJPA提供的复杂查询接口）、Serializable（序列化接口）。

      ```java
      package com.tc.jpa;
      
      import com.tc.entity.User;
      import org.springframework.data.jpa.repository.JpaRepository;
      import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
      
      import java.io.Serializable;
      
      public interface UserJPA extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>, Serializable {
      }
      ```
      	我们并不需要做其他的任何操作了，因为SpringBoot以及SpringDataJPA会为我们全部搞定，SpringDataJPA内部使用了类代理的方式让继承了它接口的子接口都以spring管理的Bean的形式存在。

      	以上，我们已经完成了SpringBoot整合JPA的工作，接下来我们将使用SpringDataJPA完成数据的CRUD（Create,Read,Update,Delete）简单操作。

5. 使用Spring Data JPA完成数据的CRUD操作

   在Controller中编写代码，完成数据的CRUD操作。

   ```java
   package com.tc.controller;
   
   import com.tc.entity.User;
   import com.tc.jpa.UserJPA;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.RequestMethod;
   import org.springframework.web.bind.annotation.RestController;
   
   import java.util.List;
   
   @RestController
   @RequestMapping("/user")
   public class UserController12 {
   
       @Autowired
       private UserJPA userJPA;
   
       // http://localhost:8080/user/save?name=王五&age=33&address=一叶孤舟
       @RequestMapping(value = "/save", method = RequestMethod.GET)
       public User saveUser(User user) {
           return userJPA.save(user);
       }
   
       // http://localhost:8080/user/queryAllUser
       @RequestMapping(value = "/queryAllUser", method = RequestMethod.GET)
       public List<User> queryAllUser(){
           return userJPA.findAll();
       }
   
   
       // http://localhost:8080/user/delUser?id=1
       @RequestMapping(value = "/delUser")
       public List<User> delUser(User user) {
           userJPA.delete(user);
   
           return userJPA.findAll();
       }
   }
   ```

   
