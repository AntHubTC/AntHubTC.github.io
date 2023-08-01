# SpringBoot整合FreeMarker

源代码项目参考：10-spring-boot-view-freemarker

maven依赖配置pom.xml：

​	两个关键依赖：spring-boot-starter-web和spring-boot-starter-freemarker。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tc</groupId>
    <artifactId>10-spring-boot-view-freemarker</artifactId>
    <packaging>jar</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
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
        <!-- Freemarker启动器的坐标 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-freemarker</artifactId>
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

后台接口：

```java
package com.tc.controller;

import com.tc.pojo.Users;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;

/**
 * SpringBoot 整合freemarker
 */
@Controller
public class UserController {

    /**
     *  处理请求，产生数据
     */
    @RequestMapping("/showUser")
    public String showUser(Model model) {
        ArrayList<Users> userList = new ArrayList<>();
        userList.add(new Users("1", "张三", "20"));
        userList.add(new Users("2", "李四", "20"));
        userList.add(new Users("3", "王五", "20"));

        model.addAttribute("userList", userList);

        return "userList";
    }
}

```

​	

模板编写：

> ​	SpringBoot规则模板类的视图技术要将模板放到/resources/templates中。

前端/src/main/resources/templates/userList.ftl：

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>展示用户数据 freemarker</title>
</head>
<body>
    <table border="1" align="center" width="50%">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
        </tr>
        <#-- FreeMarker语法： list类型  迭代userList 每一次迭代赋给user-->
        <#list userList as user>
            <tr>
                <#-- FreeMarker语法： 取值方式-->
                <td>${user.userId}</td>
                <td>${user.userName}</td>
                <td>${user.userAge}</td>
            </tr>
        </#list>
    </table>
</body>
</html>
```

