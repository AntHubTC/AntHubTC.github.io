# SpringBoot整合thymeleaf

源代码项目参考：11-spring-boot-view-thymeleaf

## Thymeleaf

[Thymeleaf官方文档](https://www.thymeleaf.org/doc/tutorials/2.1/usingthymeleaf.html)

## Thymeleaf特点

```
是通过它特定的语法对html的标记做渲染。
```
### Thymeleaf语法详解
1. 变量输出与字符串操作
```   
   th:text 在页面中输出值。    
   th:value 可以将一个值放到input标签中的value中显示。
   th:text="${#strings.isEmpty(msg)}" 判断内容是否为空  它调用了Thymeleaf中的一个内置对象strings。
        注意语法：1.调用内置对象一定要用#   2.##大部分##的内置对象都以s结尾 stirngs、numbers、dates等。
   内置对象strings：
        strings.isEmpty(arg) 是否为空
        strings.contains(content, arg1) 判断是否拥有arg1子串
        strings.startsWith(content, arg1) 判断是否以arg1开头
        strings.endsWith(content, arg1) 判断是否以arg1结尾
        strings.length(content) 返回content的长度
        strings.indexOf(content, arg1) 返回arg1在content中的索引位置 未找到返回-1
        strings.substring(content, start [, end]) 截串
        strings.toUpperCase(content) 转换为大写
        strings.toLowerCase(content) 转换为小写
        还有其它用法，参见网络资料。
```

2. 日期格式化处理
```
    内置对象dates：
        dates.format(dateVal[, dateParttern]) 格式化日期，默认的以浏览器默认语言为格式化标准。
        dates.year(dateVal) 取年份
        dates.month(dateVal) 取月份
        dates.day(dateVal) 取哪一日
        ...
```
3. 条件判断
```
    th:if="条件表达式"  条件中取变量使用${变量}
    th:switch="值"  用来做多条件判断  和th:case="值"搭配使用
```
4. 迭代遍历
```
    th:each 循环遍历 具体参见案例   迭代list  迭代map
```
5. 域对象操作
```
    HttpServletRequest
    HttpSession
    ServletContext
    参见scope.html内容。
```
6. URL表达式
```
    th:href
    th:src
    
    url表达式语法：@{}
        绝对路径
        相对路径
            相对于应用的上下文根路径
            相对于服务器的根路径
        传参数
```

## 学习案例

maven依赖：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.tc</groupId>
    <artifactId>11-spring-boot-view-thymeleaf</artifactId>
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
        <!-- thymeleaf启动器的坐标 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
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

后端接口的编写:

```java
package com.tc.controller;

import com.tc.pojo.Users;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

/**
 * SpringBoot 整合Thymeleaf
 */
@Controller
public class DemoController {

    @RequestMapping("/show")
    public String show(Model model) {
        model.addAttribute("msg", "Thymeleaf 第一个案例");
        model.addAttribute("dateVal", new Date());

        return "index";
    }

    @RequestMapping("/condition")
    public String condition(Model model) {
        model.addAttribute("sex", "男");
        model.addAttribute("id", "2");

        return "condition";
    }

    @RequestMapping("/each")
    public String each(Model model) {
        Users user1 = new Users("1", "张三", "20");
        Users user2 = new Users("2", "李四", "20");
        Users user3 = new Users("3", "王五", "20");

        ArrayList<Users> userList = new ArrayList<>();
        userList.add(user1);
        userList.add(user2);
        userList.add(user3);

        HashMap<String, Users> userMap = new HashMap<>();
        userMap.put("u1", user1);
        userMap.put("u2", user2);
        userMap.put("u3", user3);

        model.addAttribute("userList", userList);
        model.addAttribute("userMap", userMap);

        return "each";
    }

    @RequestMapping("/scope")
    public String scope(HttpServletRequest request, Model model) {
        request.setAttribute("req", "HttpServletRequest");

        request.getSession().setAttribute("ses", "HttpSession");

        request.getSession().getServletContext().setAttribute("app", "Application");

        return "scope";
    }

    @RequestMapping("/url")
    public String scope(Model model) {

        return "url";
    }
}
```

前端模板的编写，同样，模板类的文件需要放到/resources/templates：

condition.html:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>条件判断</title>
</head>
<body>
    <div>
        <span th:if="${sex} == '男'">性别：男</span>
        <span th:if="${sex} == '女'">性别：女</span>
    </div>
    <div>
        <div th:switch="${id}">
            排名：
            <span th:case="1">第一名</span>
            <span th:case="2">第二名</span>
            <span th:case="3">第三名</span>
        </div>
    </div>
</body>
</html>
```

each.html

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>循环遍历</title>
</head>
<body>
    <table>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
        <tr th:each="u:${userList}">
            <td th:text="${u.userId}"></td>
            <td th:text="${u.userName}"></td>
            <td th:text="${u.userAge}"></td>
        </tr>
    </table>
    <hr>
    <table border="1">
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>index</th>
            <th>count</th>
            <th>size</th>
            <th>current</th>
            <th>even/odd</th>
            <th>first</th>
            <th>last</th>
        </tr>
        <!--
            状态变量，属性有：
               index:当前迭代对象的迭代索引，从0开始，这是索引属性；
               count:当前迭代对象的迭代索引，从1开始，这个是统计属性；
               size:迭代变量元素的总量，这是被迭代对象的大小属性；
               current:当前迭代变量；
               even/odd:布尔值，当前循环是否是偶数/奇数（从0开始计算）；
               first:布尔值，当前循环是否是第一个；
               last:布尔值，当前循环是否是最后一个；
        -->
        <tr th:each="u,iterStat:${userList}" th:style="${iterStat.even} ? 'background-color:yellow':  'background-color:#ddd'">
            <td th:text="${u.userId}"></td>
            <td th:text="${u.userName}"></td>
            <td th:text="${u.userAge}"></td>
            <td th:text="${iterStat.index}"></td>
            <td th:text="${iterStat.count}"></td>
            <td th:text="${iterStat.size}"></td>
            <td th:text="${iterStat.current}"></td>
            <td th:text="${iterStat.even}+'/'+${iterStat.odd}"></td>
            <td th:text="${iterStat.first}"></td>
            <td th:text="${iterStat.last}"></td>
        </tr>
    </table>
    <hr>
    <table border="1">
        <tr>
            <th>key</th>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
        <tr th:each="map:${userMap}">
            <td th:each="entry:${map}" th:text="${entry.key}"></td>
            <td th:each="entry:${map}" th:text="${entry.value.userId}"></td>
            <td th:each="entry:${map}" th:text="${entry.value.userName}"></td>
            <td th:each="entry:${map}" th:text="${entry.value.userAge}"></td>
        </tr>
    </table>
</body>
</html>
```

index.html

```html
<!doctype html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Thymeleaf</title>
</head>
<body>
    <!-- th是Thymeleaf的语法 -->
    <span th:text="hello"></span>
    <hr>
    <span th:text="${msg}"></span>
    <hr>
    <input type="text" name="userName" th:value="${msg}">
    <hr>
    <span th:text="${#strings.isEmpty(msg)}"></span>
    <hr>
    <span th:text="${#strings.contains(msg, 'T')}"></span>
    <hr>
    <span th:text="${#strings.contains(msg, 'f')}"></span>
    <hr>
    <span th:text="${#strings.startsWith(msg, 'Thy')}"></span>
    <hr>
    <span th:text="${#strings.endsWith(msg, 'T')}"></span>
    <hr>
    <span th:text="${#strings.length(msg)}"></span>
    <hr>
    <span th:text="${#strings.indexOf(msg, 'hy')}"></span>
    <hr>
    <span th:text="${#strings.substring('你好呀！', 1)}"></span>
    <hr>
    <span th:text="${#strings.substring('你好呀！', 1, 4)}"></span>
    <hr>
    <span th:text="${#dates.format(dateVal)}"></span>
    <hr>
    <span th:text="${#dates.format(dateVal, 'yyyy/MM/dd')}"></span>
    <hr>
    <span th:text="${#dates.year(dateVal)}"></span>
    <hr>
    <span th:text="${#dates.month(dateVal)}"></span>
    <hr>
    <span th:text="${#dates.day(dateVal)}"></span>
</body>
</html>
```

scope.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>域对象操作</title>
</head>
<body>
    Request: <span th:text="${#httpServletRequest.getAttribute('req')}"></span><br>
    Session: <span th:text="${session.ses}"></span><br>
    Application: <span th:text="${application.app}"></span><br>
</body>
</html>
```

url.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>URL操作</title>
</head>
<body>
    <a th:href="@{http://www.baidu.com}">绝对路径</a>
    <hr>
    <!--
        / 相对于项目的上下文相对路径
    -->
    <a th:href="@{/each}">相对路径</a>
    <hr>
    <a th:href="@{~/project2/resourcename}">相对于服务器的根</a>
    <hr>
    <span>传参数</span> <br>
    <a th:href="@{/show(id=1)}">URL传参数语法</a> <br>
    <a th:href="@{/show(id=1,name=zhangsan)}">URL传参数语法</a>
    <hr>
    <a th:href="@{/path/{id}/show(id=1,name=zhangsan)}">URL传参-restful风格</a>
</body>
</html>
```