# SpringBoot自定义属性配置

源代码项目参考：0027-spring-boot-configuration

​	我们都知道SpringBoot中大多数的配置都是在application.yml(application.properites)中完成的，如果我们应用中要使用这些配置该如何使用呢？

## application.yml

```yml
test:
  username: tangcheng
  password: 123456
  config:
    host: 127.0.0.1
    port: 1231
    rIp: 12,34,65
```

## 注解@Value

​	我们可以使用@Value来引用application配置文件中的配置。

```java
public class ConfigTest {

    @Value("${test.config.host}")
    private String host;

    @Test
    public void test4() {
        System.out.println(host);
    }
}
```



## 注解@ConfigurationProperties

### 作用于配置类

```java
package com.tc.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 *      如果没有使用EnableConfigurationProperties这个注解来启用这个注解，就需要使用@Configuration
 * 将配置类让spring管理起来。
 */
@Configuration
@ConfigurationProperties(
        prefix = "test.config"
)
public class TestConfig1 {
    private String host;
    private String port;
    private String[] rIp;

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String[] getrIp() {
        return rIp;
    }

    public void setrIp(String[] rIp) {
        this.rIp = rIp;
    }

    @Override
    public String toString() {
        return "TestConfig{" +
                "host='" + host + '\'' +
                ", port='" + port + '\'' +
                ", rIp=" + Arrays.toString(rIp) +
                '}';
    }
}
```

### 作用于方法

​	这种是方法值返回后SpringBoot才注入的参数的，所以如果想在方法内容填充了有些值，方法返回后有可能被覆盖的。

```java
    // 通过方法来注入参数   TestConfig2是一个普通的java bean类
    @Bean
    @ConfigurationProperties(prefix = "test.config")
    public TestConfig2 testConfig2() {
        return new TestConfig2();
    }
```

