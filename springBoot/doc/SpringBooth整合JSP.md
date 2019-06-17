# SpringBooth整合JSP

源代码项目参考: 09-spring-boot-view-jsp

使用JSP需要依赖的Maven坐标配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tc</groupId>
    <artifactId>09-spring-boot-view-jsp</artifactId>
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
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>2.0.1.RELEASE</version>
        </dependency>

        <!-- 整合jsp还需要导入两个坐标 -->
        <!-- jstl -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
        </dependency>
        <!-- jasper -->
        <dependency>
            <groupId>org.apache.tomcat.embed</groupId>
            <artifactId>tomcat-embed-jasper</artifactId>
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

application.properties配置：

```
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
```

/src/main/webapp/WEB-INF/jsp/userList.jsp

```jsp
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<table border="1">
    <tr>
        <th>编号</th>
        <th>姓名</th>
        <th>年龄</th>
    </tr>
    <c:forEach items="${userList}" var="user">
        <tr>
            <td>${user.userId}</td>
            <td>${user.userName}</td>
            <td>${user.userAge}</td>
        </tr>
    </c:forEach>
</table>
</body>
</html>
```

UserController.java

```java
package com.tc.controller;

import com.tc.pojo.Users;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;

/**
 * SpringBoot 整合JSP
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

其它文件不关键就不展示了。