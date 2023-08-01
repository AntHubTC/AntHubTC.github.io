# SpringBoot线程池配置

Spring Boot提供了许多配置选项来自定义线程池。可以使用`ThreadPoolTaskExecutor`实现自定义线程池配置，并通过`@Bean`注解将其添加到Spring上下文中。

以下是一些常见的线程池配置选项：

1. 核心线程数（corePoolSize）：线程池中要保留的最小线程数。
2. 最大线程数（maxPoolSize）：线程池中允许的最大线程数。
3. 队列容量（queueCapacity）：当所有核心线程都在忙碌时，要放置等待执行的任务的队列的最大容量。
4. 线程存活时间（keepAliveTime）：空闲线程保持活动状态的最长时间。
5. 拒绝策略（rejectedExecutionHandler）：当任务被添加到已满的队列中时，线程池应采取的行动。

使用线程池可以更好地管理应用程序中的并发请求，从而提高性能和吞吐量。但是，要注意正确地配置线程池参数以避免过度消耗资源或导致应用程序响应变慢。



##  ThreadPoolTaskScheduler和ThreadPoolTaskExecutor的关系

​	ThreadPoolTaskExecutor是一个**通用的线程池**，可以处理各种类型的异步任务，例如在Web应用中处理HTTP请求时，可以使用ThreadPoolTaskExecutor来处理请求的业务逻辑。通过ThreadPoolTaskExecutor，我们可以自行控制线程池的核心线程数、最大线程数、队列容量等参数，以及配置拒绝策略等选项。

​	ThreadPoolTaskScheduler则是一个**定时任务专用的线程池**，用于执行定时任务。在Spring中，我们通常使用ScheduledExecutorService来处理定时任务，而ThreadPoolTaskScheduler正是对ScheduledExecutorService的封装。ThreadPoolTaskScheduler可以指定线程池的大小、名称前缀、是否支持并发执行等属性，同时还提供了cron表达式、fixedRate和fixedDelay等多种定时任务调度方式，方便我们实现各种复杂的定时任务逻辑。

​	需要注意的是，虽然ThreadPoolTaskScheduler和ThreadPoolTaskExecutor都是基于线程池的异步任务执行器，但它们并没有直接的继承或实现关系。通常情况下，我们可以分别使用它们来处理不同类型的异步任务。



## 通过配置配置线程池，任务调度执行器池（常用）

注意！其实在spring boot中可以不用自己去写代码new一个线程池的bean，因为spring boot有一个线程池自动配置类TaskExecutionAutoConfiguration, TaskSchedulingAutoConfiguration，我们可以将线程池的配置写到spring boot配置中就可以直接使用(TaskExecutionProperties,TaskSchedulingProperties)，除非有特殊需求需要我们自己去创建线程池。

```yaml
spring:
  task:
    execution:
      thread-name-prefix: tc-thread-
      pool:
        core-size: 8
        max-size: 25
        queue-capacity: 20
        keep-alive: 100s
    scheduling:
      thread-name-prefix: tc-schedule-
      pool:
        size: 1
```

> 上面配置需要使用@EnableAsync，@EnableScheduling去启用他们
>

​		TaskExecutionAutoConfiguration，TaskSchedulingAutoConfiguration源代码中，有类似@ConditionalOnMissingBean的注解，意思是如果用户自己定义了线程池，那么就不通过配置自动创建线程池了，那么也就是说用户如果有特殊需求也可以自己写代码配置线程池bean。

```java
package com.minibyte.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.concurrent.ThreadPoolExecutor;

/**
 * @author: MiniByte
 * @date: 2022/5/30
 * @description:
 */
@Configuration
@EnableAsync // 启用
@EnableScheduling // 启用
@Slf4j
public class ThreadPoolTaskConfig {
     @Bean
     public ThreadPoolTaskScheduler tcThreadPoolTaskScheduler() {
         ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
         log.info("init executor successful......");
         return threadPoolTaskScheduler;
     }

     @Bean
     public ThreadPoolTaskExecutor tcThreadPoolTaskExecutor() {
         ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
         executor.setCorePoolSize(15);
         executor.setMaxPoolSize(25);
         executor.setQueueCapacity(20);
         executor.setKeepAliveSeconds(100);
         executor.setThreadNamePrefix("tc-thread-");
         executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
         executor.initialize();
         log.info("init executor successful......");
         return executor;
     }

    // TransmittableThreadLocal 是Alibaba开源的、用于解决 “在使用线程池等会缓存线程的组件情况下传递ThreadLocal” 问题的 InheritableThreadLocal 扩展。
}
```





## 注解说明

### @EnableAsync

`@EnableAsync` 是一个 Spring Framework 的注解，用于启用异步方法的功能。当您在 Spring Boot 应用程序中使用此注解时，它会自动配置默认的执行器，并将任何标记有 `@Async` 注解的方法注册为异步任务。

要启用异步方法，请在您的 Spring Boot 应用程序中添加 `@EnableAsync` 注解。例如：

```java
@SpringBootApplication
@EnableAsync
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

然后，在任何类中添加带有 `@Async` 注解的方法即可创建异步任务。例如：

```java
@Service
public class MyService {
    @Async
    public void doSomething() {
        // 以异步方式运行这个方法
        System.out.println("Doing something...");
    }
}
```

在上面的示例中，`MyService` 类中的 `doSomething()` 方法将以异步方式运行。这是通过在方法上添加 `@Async` 注解来实现的。

请注意，如果您需要自定义执行器或更改其他异步任务设置，可以创建一个自定义的 `Executor` Bean 并将其注入到您的应用程序中。

### @EnableScheduling

`@EnableScheduling` 是一个 Spring Framework 的注解，用于启用计划任务的功能。当您在 Spring Boot 应用程序中使用此注解时，它会自动配置默认的 `TaskScheduler` 实例，并将任何标记有 `@Scheduled` 注解的方法注册为计划任务。

要启用计划任务，请在您的 Spring Boot 应用程序中添加 `@EnableScheduling` 注解。例如：

```java
@SpringBootApplication
@EnableScheduling
public class MyApp {
    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }
}
```

然后，在任何类中添加带有 `@Scheduled` 注解的方法即可创建计划任务。例如：

```java
@Service
public class MyService {
    @Scheduled(fixedDelay = 5000)
    public void doSomething() {
        // 每隔 5 秒运行一次
        System.out.println("Doing something...");
    }
}
```

在上面的示例中，`MyService` 类中的 `doSomething()` 方法将以固定延迟方式运行（每隔 5 秒）。这是通过在方法上添加 `@Scheduled(fixedDelay = 5000)` 注解来实现的。

请注意，如果您需要自定义任务调度程序或更改其他计划任务设置，可以创建一个自定义的 `TaskScheduler` Bean 并将其注入到您的应用程序中。
