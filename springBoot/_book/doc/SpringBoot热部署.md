# SpringBoot热部署

​	使用热部署可以在不重新启动的情况下部署改动，为开发提供更高的效率。

## 简介

​	SpringBoot的热部署方式：

1. SpringLoader插件
2. DevTools工具
3. Jrebel

## 使用SpringLoader插件

源代码项目参考：0023-spring-boot-springLoader

在pom文件中加入：

```xml
<!--
                  这个插件在和springLoader配合下可以帮助我们使用热部署,
              -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <dependencies>
                    <dependency>
                        <groupId>org.springframework</groupId>
                        <artifactId>springloaded</artifactId>
                        <version>1.2.5.RELEASE</version>
                    </dependency>
                </dependencies>
            </plugin>
```

加入这个插件后，就不能直接通过启动类允许了，要使用命令的方式启动 mvn spring-boot:run。

springLoader缺陷：

​	1.只能对java代码进行部署处理，对页面无能为力。

​	idea下好像不推荐这种方式，按ctrl+shift+F9就会重新编译改动的那个文件。



# 使用DevTools工具

### SpringLoader与DevTools的区别：

SpringLoader：springLoader在部署项目时使用的是**热部署**方式。

DevTools：DevTools在部署项目时使用的是**重新部署**的方式。

### 添加devtools的依赖

```xml
        <!-- devtools坐标 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <!-- 其它项目如果依赖这个项目，这个依赖是不传递的 -->
            <optional>true</optional>
            <!-- 运行时可用 -->
            <scope>runtime</scope>
        </dependency>
```

估计是idea的原因，要install一下才能看到改变。