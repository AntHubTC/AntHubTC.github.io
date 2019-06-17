# SpringBoot使用Druid数据库连接池

源代码项目参考：14-springBoot-Druid

## 了解Druid

​     Druid是阿里巴巴开源的数据库连接池作品，其它项相关Durid的详情参考官网介绍。

## maven项目依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

    <!-- 继承这个坐标 -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/>
    </parent>

	<groupId>com.tc</groupId>
	<artifactId>14-springBoot-Druid</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>14-springBoot-Druid</name>

    <!-- 修改JDK版本 -->
	<properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
        <!-- SpringBoot的启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>

        <!-- JPA启动器的坐标-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- druid数据库连接池 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.13</version>
        </dependency>
        <!--
            不使用starter参考https://github.com/alibaba/druid
        -->
        <!--<dependency>-->
            <!--<groupId>com.alibaba</groupId>-->
            <!--<artifactId>druid</artifactId>-->
            <!--<version>1.0.9</version>-->
        <!--</dependency>-->

        <!-- h2驱动坐标 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
	</dependencies>

	<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```



## application.properties配置

```properties
# 服务配置
server.port=8080

# ====================== 数据库连接配置 ======================
# H2数据库不同模式连接字串有所差异，详情参考互联网。
# jdbc:h2:file:~/h2/testdb 这个是嵌入式本地连接，它会在你的当前用户目录下建立一个h2的文件夹，然后放一个testdb.mv.db的数据库文件。
# jdbc:h2:file:./h2/testdb 这个会在当前项目目录中创建一个h2文件夹，数据库文件放里面的。
# jdbc:h2:mem:<databaseName> 内存模式
# 还有其它的模式
# 控制台访问的时候也要使用这个url。
spring.datasource.url=jdbc:h2:mem:h2DbTest
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# ====================== druid配置 ======================
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.druid.min-idle=2
# 控制台servlet参数
spring.datasource.druid.stat-view-servlet.enabled=true
spring.datasource.druid.stat-view-servlet.login-username=admin
spring.datasource.druid.stat-view-servlet.login-password=123456

# ======================= 数据初始化配置(这个需要jpa相关配置才生效) =====================
spring.datasource.schema=classpath:db/schema.sql
spring.datasource.data=classpath:db/data.sql

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

## 数据库初始化

#### schema.sql

```sql
DROP TABLE IF EXISTS T_USER;
CREATE TABLE T_USER(
    T_ID INT PRIMARY KEY,
    T_NAME VARCHAR(255),
    T_AGE INT(10),
    T_ADDRESS VARCHAR(300) DEFAULT ''
);
```

### data.sql

```sql
INSERT INTO T_USER(T_ID,T_NAME,T_AGE,T_ADDRESS)
VALUES (1, '张三', 23, '天空之城');
INSERT INTO T_USER(T_ID,T_NAME,T_AGE,T_ADDRESS)
VALUES (2, '李四', 53, '蒙古骆驼包');
```



## 用户实体类

```java
package com.tc.entity;

import java.io.Serializable;

public class User implements Serializable{

    private Long id;

    private String name;

    private int age;

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

## 启动类

```java
package com.tc;


import com.tc.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 h2控制台访问：http://127.0.0.1:8080/h2
 druid控制台访问：http://127.0.0.1:8080/druid
 */
@SpringBootApplication
public class App implements CommandLineRunner {
    /*
        spring boot启动应用程序实现CommandLineRunner接口，当程序启动起来后会执行实现的run方法。
     */
    @Autowired
    private DataSource dataSource;

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DATASOURCE = " + dataSource);

        List<User> userList = new ArrayList<>();
        Connection connection = dataSource.getConnection();
        PreparedStatement ps = null;
        try {
            ps = connection.prepareStatement("SELECT * FROM T_USER");
            ResultSet resultSet = ps.executeQuery();
            while (resultSet.next()) {
                User user = new User();
                user.setId(resultSet.getLong("T_ID"));
                user.setAddress(resultSet.getString("T_ADDRESS"));
                user.setAge(resultSet.getInt("T_AGE"));
                user.setName(resultSet.getString("T_NAME"));

                userList.add(user);
            }

            System.out.println("=============用户信息==============");
            for (User user : userList) {
                System.out.println(user);
            }
        } finally {
            // 资源一定要记住关闭
            connection.close();
            if (null != ps) {
                ps.close();
            }
        }
    }
}

```



## H2控制台访问

http://localhost:8080/h2

## Druid控制台访问

http://localhost:8080/durid