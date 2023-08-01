# SpringBoot整合Quartz框架

**Quartz介绍：**

![1556545302948](/img/1556545302948.png)

**Quartz的使用思路：**

1. job 任务  - 你要做什么事？

2. Trigger 触发器 - 你什么时候去做？

3. Scheduler 任务调度 - 你什么时候需要去做什么事？

   ​	

   ​	对于此整合，网上好像还有相对更简单的整合方案，另外下面的感觉没有怎么使用到springBoot本身对Quartz的支持，我看了下，SpringBoot应该是有Quartz的整合方法，比如这个QuartzAutoConfiguration类。

**添加pom坐标：**

```xml
<!-- QuartZ坐标 -->
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>2.3.0</version>
            <!--spring-boot-starter-web含有slf4j-api包了-->
            <!--<exclusions>-->
                <!--<exclusion>-->
                    <!--<artifactId>slf4j-api</artifactId>-->
                    <!--<groupId>org.slf4j</groupId>-->
                <!--</exclusion>-->
            <!--</exclusions>-->
        </dependency>

        <!-- Scheduled坐标-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
        </dependency>

        <!-- Spring tx 坐标-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
        </dependency>
```

**编写Demo Job任务：**

```java
package com.tc.quartz;

import com.tc.service.UserService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

public class QuartzDemo implements Job { // 实现了Job接口

    /*
        错误情况：
            如果该类注入一个类，默认的Quartz的job工厂是不能注入的，因为默认的工厂是通过反射创建对象的，没有被
        spring管理起来，那么直接使用就会报错。
        解决方法：
            自定义默认工厂，让创建出来的对象放到spring容器中，那么这样就可以注入进来了
     */
    @Autowired
    private UserService userService;

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        System.out.println("QuartzDemo Execute..." + new Date());

        System.out.println(userService);
        userService.add();
    }
}

```

**用户服务类:**

```java
package com.tc.service;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    public void add(){
        System.out.println("add user...");
    }
}
```

**编写配置类：**

​	中包含了SimpleTriggerFactoryBean和CronTriggerFactoryBean两种实现方式：

```java
package com.tc.config;

import com.tc.quartz.QuartzDemo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.quartz.CronTriggerFactoryBean;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.scheduling.quartz.SimpleTriggerFactoryBean;

/**
 * Quartz配置类
 */
@Configuration
public class QuartzConfig {

    /**
     * 1. 创建Job对象
     */
    @Bean
    public JobDetailFactoryBean jobDetailFactoryBean() {
        // spring-context-support包下的类
        JobDetailFactoryBean factory = new JobDetailFactoryBean();
        factory.setJobClass(QuartzDemo.class);

        return factory;
    }

//    /**
//     * 2. 创建简单Trigger对象
//     */
//    @Bean
//    public SimpleTriggerFactoryBean simpleTriggerFactoryBean(JobDetailFactoryBean jobDetailFactoryBean) {
//        SimpleTriggerFactoryBean factory = new SimpleTriggerFactoryBean();
//        // 关联JobDetail
//        factory.setJobDetail(jobDetailFactoryBean.getObject());
//        factory.setRepeatInterval(2000L);// 单位毫秒
//        factory.setRepeatCount(5); // 重复 1 + 5 次  (1是本身就有一次)
//        return factory;
//    }
//    /**
//     * 3. 创建Scheduler对象
//     */
//    @Bean
//    public SchedulerFactoryBean schedulerFactoryBean(SimpleTriggerFactoryBean simpleTriggerFactoryBean) {
//        SchedulerFactoryBean factory = new SchedulerFactoryBean();
//        // 关联trigger
//        factory.setTriggers(simpleTriggerFactoryBean.getObject());
//
//        return factory;
//    }

    /**
     * 2. 创建cron Trigger对象
     */
    @Bean
    public CronTriggerFactoryBean simpleTriggerFactoryBean(JobDetailFactoryBean jobDetailFactoryBean) {
        CronTriggerFactoryBean factory = new CronTriggerFactoryBean();
        // 关联JobDetail
        factory.setJobDetail(jobDetailFactoryBean.getObject());
        factory.setCronExpression("0/2 * * * * ?");
        return factory;
    }

    /*
        3. 创建Scheduler对象
        注入cron trigger到scheduler中。
     */
    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(CronTriggerFactoryBean cronTriggerFactoryBean,
                                                     SpringAdaptableJobFactory springAdaptableJobFactory) {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        // 关联trigger
        factory.setTriggers(cronTriggerFactoryBean.getObject());
        // 改写默认的Job的工厂，让Job中的属性可以通过spring IOC注入进来。
        factory.setJobFactory(springAdaptableJobFactory);

        return factory;
    }
}

```

**编写适配器JOB工厂:**

```java
package com.tc.config;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.scheduling.quartz.AdaptableJobFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

@Component("springAdaptableJobFactory")
public class SpringAdaptableJobFactory extends AdaptableJobFactory {

    /*
        AutowireCapableBeanFactory 可以将一个对象添加到Spring IOC容器中，并且完成该对象的属性注入。
     */
    @Autowired
    private AutowireCapableBeanFactory autowireCapableBeanFactory;

    @Override
    protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
        Class<?> jobClass = bundle.getJobDetail().getJobClass();
        Object obj = ReflectionUtils.accessibleConstructor(jobClass, new Class[0]).newInstance();

        // 将obj对象添加到Spring IOC容器中，并完成注入。
        autowireCapableBeanFactory.autowireBean(obj);
        return obj;
    }
}
```

**编写启动类**

```java
package com.tc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```