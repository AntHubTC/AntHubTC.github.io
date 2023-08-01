# SpringBoot单元测试

源代码项目参考：0022-spring-boot-unitTest

## Maven依赖：

```xml
<!-- SpringBoot的启动器 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.0.1.RELEASE</version>
</dependency>
<!--
    SpringBoot test的启动器
-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
```

## 分析spring-boot-starter-test：

​	第一层依赖的包有：
​            xmlunit-core、json-path、jsonassert、mockit-core、spring-boot-test、spring-boot-test-autoconfigure、hamcrest-core、hamcrest-library、assertj-core、junit等。
​        也就是说，学springBoot单元测试从以下下手，可以看出有：
​            spring-boot-test 是SpringBoot官方提供的测试包
​            XMLUnit 一种用于测试 XML 文档的 JUnit 扩展框架
​                扩展阅读：https://www.ibm.com/developerworks/cn/java/j-cq121906.html IBM上一个关于XMLUnit使用文档。
​            JsonPath 一种类似使用路径检索或设置Json的工具(类似对于xml的xpath)。
​            JSONassert 用更少的代码编写JSON单元测试。非常适合测试REST接口。
​                使用：JSONAssert.assertEquals(expectedJSONString, actualJSON, strictMode);
​                扩展阅读：https://github.com/skyscreamer/JSONassert 开源项目
​            Mockit 一中mock模拟框架（比较不错）。
​                扩展阅读：
​                    https://github.com/mockito/mockito/wiki
​                    https://www.jianshu.com/p/eae0187900f8
​            Hamcrest 匹配器框架
​                扩展阅读： http://hamcrest.org/JavaHamcrest/
​            AssertJ 断言框架(断言神器)
​                扩展阅读：
​                    https://blog.csdn.net/neven7/article/details/51448559
​            junit 单元测试框架
​                扩展阅读：
​                    https://github.com/junit-team/junit4
​                    https://github.com/junit-team/junit5