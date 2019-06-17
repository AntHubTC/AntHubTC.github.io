# SpringBoot整合内存数据库H2

源代码项目参考：12-spring-boot-h2

## H2介绍

​	开源的、纯java实现的、嵌入式的内存关系数据库。

H2的优势：
1. h2采用纯Java编写，因此不受平台的限制。

2. h2只有一个jar文件，十分适合作为嵌入式数据库试用。

3. 有比较好的兼容性，支持相当标准的sql标准

4. h2提供了一个十分方便的web控制台用于操作和管理数据库内容。

   https://www.cnblogs.com/xdp-gacl/p/4171024.html



maven的pom.xml配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tc</groupId>
    <artifactId>12-spring-boot-h2</artifactId>
    <packaging>jar</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
        <!-- jar包名称加version可以改变jar的版本 应该是starter包有处理-->
        <!--<thymeleaf.version>2.1.2.RELEASE</thymeleaf.version>-->
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <dependencies>
        <!-- SpringBoot的启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>

        <!-- h2坐标 -->
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

application.properties配置:

```properties
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

数据库JDBC测试程序：

```java
package com.tc.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.*;

/**
 *
 * 操作说明：
 *    应用启动起来之后访问： http://localhost:8080/h2
      登录到控制台后执行：
         CREATE TABLE TEST(ID INT PRIMARY KEY,
         NAME VARCHAR(255));
         INSERT INTO TEST VALUES(1, 'Hello');
         INSERT INTO TEST VALUES(2, 'World');
     然后控制台访问:  http://localhost:8080/test
 */
@Controller
public class TestH2JdbcController {

//    注入application.properties中配置的内容
    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.driverClassName}")
    private String dbClassName;

    @Value("${spring.datasource.username}")
    private String dbUserName;

    @Value("${spring.datasource.password}")
    private String dbPassword;


    @RequestMapping("/test")
    @ResponseBody
    public void test() throws ClassNotFoundException, SQLException {
        // 加载驱动
        Class.forName(dbClassName);
        // 获取数据库连接
        Connection connection = DriverManager.getConnection(dbUrl, dbUserName, dbPassword);
        /*
        通过Connection对象创建Statement对象。创建Statement有三种方法。
            createStatement(): 创建基本的Statement对象
            prepareStatement(String sql): 根据传入的SQL语句创建预编译的Statement对象
            prepareCall(String sql): 根据传入的SQL语句创建CallableStatement对象。
         */
        String sql = "select * from TEST";
//        Statement statement = connection.createStatement();
        PreparedStatement psStatement = connection.prepareStatement(sql);
        ResultSet resultSet = psStatement.executeQuery();
        ResultSetMetaData metaData = psStatement.getMetaData();
        int columnCount = metaData.getColumnCount();
        System.out.println("TABLE NAME:" + metaData.getTableName(1));
        System.out.println("==================");
        for (int i = 1; i <= columnCount; i++) {
            String columnName = metaData.getColumnName(i); // 从1开始
            System.out.print(columnName + "\t\t");
        }
        System.out.println();
        while (resultSet.next()) {
            for (int i = 1; i <= columnCount; i++) {
                String val = resultSet.getString(i); // 从1开始
                System.out.print(val + "\t\t");
            }
            System.out.println();
        }
        // 释放资源
        resultSet.close();
        psStatement.close();
        connection.close();
    }
}
```



 操作说明：
 	应用启动起来之后访问： http://localhost:8080/h2

![db2_login](..\img\db2_login.png)

登录到控制台后执行(下面直接考进去有可能报错，应该是字符问题)：
​      CREATE TABLE TEST(ID INT PRIMARY KEY,
         NAME VARCHAR(255));
         INSERT INTO TEST VALUES(1, 'Hello');
         INSERT INTO TEST VALUES(2, 'World');
db2的控制台：
![db2_console](..\img\db2_console_test.png)


   然后控制台访问:  http://localhost:8080/test  控制台输出：
![h2_jdbc_test_out](..\img\h2_jdbc_test_out.png)