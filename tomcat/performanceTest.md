# Tomcat性能调优

​		要进行性能优化，必须找到我们的现在的应用的性能是怎么样的，以及优化需要优化成什么样的指标，这个时候就需要借助性能测试工具对当前的系统的性能有一个了解。

## Tomcat性能测试

​		对于系统性能，用户最直观的感受就是系统的加载和操作时间，即用户执行某项操作的耗时。从更为专业的角度上讲，性能测试可以从以下两个指标量化。

1. 响应时间：某个操作的耗时。大多数情况下，我们需要针对同一个操作测试多次，以获取操作的平均响应时间。
2. 吞吐量：即在给定的时间内，系统支持的事务数量，计算单位为TPS。

通常情况下，我们需要借助一些自动化工具来进行性能测试，因为手动模拟大量用户的并发访问几乎是不可行的，而且现在市面上也有很多性能测试工具可以使用，如：Apache Beanch、Apache JMeter、WCAT、WebPolygraph、LoadRunner(前两个免费，后三个收费)。

### Apache Beanch

​	Apache Beanch（ab）是一款Apache Server基准的测试工具，用户测试Apache Server的服务能力（每秒处理请求数），它不仅可以用于Apache的测试，还可以测试Tomcat、Nginx、lighthttp、IIS等服务器。

### 安装

```bash
yum install httpd-tools
# apk add apache2-utils    alpine、ubuntu这些环境使用
```

### 查看版本号

```bash
ab -V
```

![1571127427159](.\img\1571127427159.png)

### 准备测试应用环境

​	过程简单，不再说明...

### 测试性能

```bash
# 总共1000次，每次并发发起100次。
ab -n 1000 -c 100 -p data.json -T application/json http://localhost:9000/course/search.do?page=1&pageSize=10
```

**参数说明**：

| 参数 | 含义描述                                         |
| :--- | :----------------------------------------------- |
| -n   | 在测试会话中所执行的请求个数，默认只执行一次请求 |
| -c   | 一次产生的请求个数，默认一次一个                 |
| -p   | 包含了需要POST的数据文件                         |
| -t   | 测试所进行的最大秒数，默认没有时间限制           |
| -T   | POST数据所需要使用的Content-Type头信息           |

**执行结果：**

```
/usr/local/tomcat/bin #  ab -n 1000 -c 100 -p data.json -T application/json http://localhost:9000/course/search.do?page=1&pageSize=10

This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        Apache-Coyote/1.1
Server Hostname:        localhost
Server Port:            8080

Document Path:          /course/search.do?page=1&pageSize=10
Document Length:        11151 bytes

Concurrency Level:      100
Time taken for tests:   0.502 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      11297000 bytes
HTML transferred:       11151000 bytes
Requests per second:    1992.08 [#/sec] (mean)
Time per request:       50.199 [ms] (mean)
Time per request:       0.502 [ms] (mean, across all concurrent requests)
Transfer rate:          21977.03 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0   26   9.5     26      54
Processing:     5   23   9.7     22      58
Waiting:        0   18  10.1     18      49
Total:         40   49   5.4     47      60

Percentage of the requests served within a certain time (ms)
  50%     47
  66%     48
  75%     52
  80%     55
  90%     59
  95%     59
  98%     60
  99%     60
 100%     60 (longest request)
```

**结果说明**

| 指标                                                         | 含义                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Server Software                                              | 服务器软件                                                   |
| Server Hostname                                              | 主机名                                                       |
| Server Port                                                  | 端口号                                                       |
| Document Path                                                | 测试的页面                                                   |
| Document Length                                              | 测试的页面大小                                               |
| Concurrency Level                                            | 并发数                                                       |
| Time take for tests                                          | 整个测试持续时间                                             |
| Complete requests                                            | 完成的请求数量                                               |
| Failed requests                                              | 失败的请求数量，这里的失败是指请求的连接服务器、发送数据、接收数据等环节发生异常，以及无响应后超时的情况。 |
| Write errors                                                 | 输出错误数量                                                 |
| Total transferred                                            | 整个场景中的网络传输量，表示所有请求的响应数据长度总和，包括每个http响应数据的头信息和正文数据的长度。 |
| HTML transferred                                             | 整个场景中的HTML内容传输量，表示所有请求的响应数据中正文数据的总和 |
| Requests per second                                          | 每秒钟平均处理的请求数（相当于LR中的每秒事务数）这便是我们重点关注的吞吐率，它等于：Complete requests   / Time taken for tests |
| Time per request                                             | 每个线程处理请求平均消耗时间（相当于LR中的平均事务响应时间）用户平均请求等待时间 |
| Transfer rate                                                | 平均每秒网络上的流量                                         |
| Percentage of the requests served within a certain time (ms) | 指定时间里，执行的请求百分比                                 |

**重要指标**

| 参数                                              | 指标说明                                                     |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Requests per second                               | **吞吐率**：服务器并发处理能力的量化描述，单位是reqs/s，指的是在某个并发用户数下单位时间内处理的请求数。某个并发用户数下单位时间内能处理的最大请求数，称之为最大吞吐率。<br/> 这个数值表示当前机器的整体性能，值越大越好。 |
| Time per request                                  | **用户平均请求等待时间**：从用户角度看，完成一个请求所需要的时间。 |
| Time per request：accross all concurrent requests | **服务器平均请求等待时间**：服务器完成一个请求的时间         |
| Concurrency Level                                 | 并发用户数                                                   |

​		在真实测试的时候要多测试几次，去掉最大值和最小值，求一个平均值较好。

## Tomcat性能优化

### JVM参数调优

​		Tomcat是一款Java应用,那么JVM的配置便与其运行性能密切相关,而JVM优化的重点则集中在内存分配和GC策略的调整上,因为内存会直接影响服务的运行效率和吞吐量,JVM垃圾回收机制则会不同程度地导致程序运行中断。可以根据应用程序的特点,选择不同的垃圾回收策略,调整JVM垃圾回收策略,可以极大减少垃圾回收次数,提升垃圾回收效率,改善程序运行性能。

#### JVM内存参数

| 参数                 | 参数作用                                          | 优化建议                |
| -------------------- | ------------------------------------------------- | ----------------------- |
| -server              | 启动Server，以服务端模式运行                      | 服务端模式建议开启      |
| -Xms                 | 最小堆内存                                        | 建议与-Xmx设置相同      |
| -Xmx                 | 最大堆内存                                        | 建议设置为可用内存的80% |
| -XX:MetaspaceSize    | 元空间初始值                                      |                         |
| -XX:MaxMetaspaceSize | 元空间最大内存                                    | 默认无限                |
| -XX:MaxNewSize       | 新生代最大内存                                    | 默认16M                 |
| -XX:NewRatio         | 年轻代和老年代比值，取值为整数，默认为2           | 不建议修改              |
| -XX:SurvivorRatio    | Eden区与Survivor区大小的比值，取值为整数，默认为8 | 不建议修改              |

案例：

```shell
JAVA_OPTS="-server -Xms2048m -Xmx2048m -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m -XX:SurvivorRatio=8"
```

```shell
# 查看堆的使用情况
jmap -heap tomcat的进程id
```

#### GC策略

JVM垃圾回收性能有以下两个主要的指标：

- 吞吐量：工作时间（排除GC时间）占总时间的百分比，工作时间并不仅是程序运行时间，还包含内存分配时间。
- 暂停时间：测试时间段内，由垃圾回收导致的程序停止响应次数/时间。

在Sun公司推出的HotSpotJVM中，包含以下几种不同类型的垃圾收集器。

| 垃圾收集器                                       | 含义说明                                                     |
| ------------------------------------------------ | ------------------------------------------------------------ |
| 串行收集器<br/>(Serial Collector)                | 采用单线程执行所有的垃圾回收工作，适用于单核CPU服务器，无法利用多核硬件的优势 |
| 并行收集器<br />(Parallel Collector)             | 又称为吞吐量收集器，以并行的方式执行年轻代的垃圾回收，该方式可以显著降低垃圾回收的开销（指多条垃圾收集线程并行工作，但此时用户线程仍然处于等待状态）。适用于多处理器或多线程硬件上运行的数量较大的应用。 |
| 并发收集器<br />(Concurrent Collector)           | 以并发的方式执行大部分垃圾回收工作，以缩短垃圾回收的暂停时间。适用于那些响应时间优先于吞吐量的应用，因为该收集器虽然最小化了暂停时间（指用户线程与垃圾收集线程同时执行，但不一定是并行的，可能会交替进行），但是会降低应用程序的性能。(垃圾收集和工作线程同时进行) |
| CMS收集器<br />(Concurrent Mark Sweep Collector) | 并发标记清除收集器，适用于那些更愿意缩短垃圾回收暂停时间并且负担的起与垃圾回收共享处理器资源的应用。 |
| G1收集器<br />(Garbage-First Garbage Collecotr)  | 适用于大容量内存的多核服务器，可以在满足垃圾回收暂停时间目标的同时，以最大可能性实现高吞吐量（JDK1.7之后）。 |

​		不同的应用程序,对于垃圾回收会有不同的需求。JVM会根据运行的平台、服务器资源配置情兄选择合适的垃圾收集器、堆内存大小及运行时编译器。如无法满足需求,参考以下准则:

A. 程序数据量较小,选择串行收集器。

B. 应用运行在单核处理器上且没有暂停时间要求，可交由JVM自行选择或选择串行收集器。

C. 如果考虑应用程序的峰值性能,没有暂停时间要求,可以选择并行收集器。

D. 如果应用程序的响应时间比整体吞吐量更重要,可以选择并发收集器。

![串行和并行垃圾收集器示意图](.\img\1571279908598.png)

#### Tomcat配置垃圾回收策略

1. 在tomcat/bin/catalina.sh中，加入如下配置：

   ```properties
   # 这里主要配置了基于rmi的jmx远程访问信息，以便后面的jconsole进行访问
   JAVA_OPTS=" -Djava.rmi.server.hostname=192.168.192.138 -Dcom.sun.management.jmxremote.port=8999 -Dcom.sun.management.jmxremote.rmi.port=8999 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false"
   ```

2. 打开jconsole，查看远程的tomcat的概要信息。

   ![1571282328142](.\img\1571282328142.png)

#### GC参数

| 参数                    | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| -XX:+UseSerialGC        | 启用串行收集器                                               |
| -XX:+UseParallelGC      | 新生代启用并行垃圾收集器，配置了该选项，那么-XX:+UseParallelOldGC默认启用 |
| -XX:+UseParallelOldGC   | 老年代FullGC采用并行收集，默认禁用。如果设置了-XX:UseParallelGC则自动启用 |
| -XX:+UseParNewGC        | 新生代采用并行收集器，如果设置了 -XX:+UseConcMarkSweepGC选项，自动启用 |
| -XX:ParallelGCThreads   | 新生代及老年代垃圾回收使用的线程数。默认依赖于JVM使用的CPU个数。 |
| -XX:+UseConcMarkSweepGC | 对于老年代，启动CMS垃圾收集器。当并行收集器无法满足应用的延迟需求是，推荐使用CMS或G1收集器。<br />启用该选项后，-XX:+UseParNewGC自动启用。 |
| -XX:+UseG1GC            | 启用G1收集器。G1是服务器类型的收集器。用于多核、大内存的机器。它在保存高吞吐量的情况下，高概率满足GC暂停时间的目标。 |

​		我们也可以在测试的时候，将JVM参数调整之后，将GC的信息打印出来，便于为我们进行参数调整提供依据，具体参数如下：

| 选项                                  | 描述                                                   |
| ------------------------------------- | ------------------------------------------------------ |
| -XX:+PrintGC                          | 打印每次GC的信息                                       |
| -XX:+PrintGCApplicationConcurrentTime | 打印最后一次暂停之后所经过的时间，即响应并发执行的时间 |
| -XX:+PrintGCApplicationStoppedTime    | 打印GC时应用暂停时间                                   |
| -XX:+PrintGCDateStamps                | 打印每次GC的时间戳                                     |
| -XX:+PrintGCDetails                   | 打印每次GC的详细信息                                   |
| -XX:+PrintGCTaskTimeStamps            | 打印每个GC工作线程任务的时间戳                         |
| -XX:+PrintGCTimeStamps                | 打印每次GC的时间戳                                     |

在bin/catalina.sh的脚本中，追加如下配置：

```properties
JAVA_OPTS="-XX:+UseConcMarkSweepGC -XX:+PrintGCDetails"
```



### Tomcat配置调优

