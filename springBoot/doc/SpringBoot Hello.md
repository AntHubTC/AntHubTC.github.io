# SpringBoot&nbsp;Hello

## pom.xml：

​        Spring Boot坐标需要继承spring-boot-starter-parent这个坐标。

​	spring-boot-starter-web    web开发相关依赖的坐标。

​	spring-boot-starter-test    SpringBoot做测试使用的坐标。

​	spring-boot-maven-plugin SpringBoot的Maven插件支持。

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
	<artifactId>01-spring-boot-hello</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>01-spring-boot-hello</name>
	<description>Demo project for Spring Boot</description>

    <!-- 修改JDK版本 -->
	<properties>
		<java.version>1.8</java.version>
	</properties>

	<dependencies>
        <!-- 添加启动类 -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

        <!-- 添加SpringBoot测试类 -->
		<!--<dependency>-->
			<!--<groupId>org.springframework.boot</groupId>-->
			<!--<artifactId>spring-boot-starter-test</artifactId>-->
			<!--<scope>test</scope>-->
		<!--</dependency>-->
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

## 编写Controller类：

```java
package com.tc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HelloWorld {

    @RequestMapping(value = "/hello")
    @ResponseBody
    public Map showHelloWorld () {
        HashMap<String, Object> map = new HashMap<>();
        map.put("key", "Hello World!");

        return map;
    }
}
```

## 编写启动类：

​	@SpringBootApplication     SpringBoot启动类需要标注这个注解。

​	下面是最基本的标准启动类写法：

```java
package com.tc;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 1.hello world
 * 2. banner的生成
 *    banner.txt字符画是通过一个ASCII字符画生成工具生成的，网站地址是：http://patorjk.com/software/taag/#p=testall&f=Big%20Money-nw&t=CSII%20SOFT
 */
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}

```

## 制作启动banner字符画

​	在目录/src/main/resources下建立一个banner.txt文件，这个文件里面的内容会在SpringBoot启动的时候最开始输出出来。如果需要好看一点可以使用[patorjk生成ASCII字符画工具](http://patorjk.com/software/taag/#p=testall&f=Big%20Money-nw&t=CSII%20SOFT)来制作一个好看的banner。

![banner effect1](..\img\banner effect1.png)

