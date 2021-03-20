# JVM监控及诊断工具-GUI篇

## 工具概述

使用上一章命令行工具或组合能帮您获取目标]ava应用性能相关的基础信息，但它们存在下列局限:

1. 无法获取方法级别的分析数据，如方法间的调用关系、各方法的调用次数和调用时间等(这对定位应用性能瓶颈至关重要)。
2. 要求用户登录到目标Java应用所在的宿主机上，使用起来不是很方便。
3. 分析数据通过终端输出，结果展示不够直观。

为此，JDK提供了一些内存泄漏的分析工具，如 jconsole， jvisualvm等，用于辅助开发人员定位问题，但是这些工具很多时候并不足以满足快速定位的需求。所以这里我们介绍的工具相对多一些、丰富一些。

**图形化综合诊断工具**

- JDK自带的工具

  - jconsole：JDK自带的可视化监控工具。查看Java应用程序的运行概况、监控堆信息、永久区(或元空间)使用情况、类加载情况等。

    位置：%JAVA_HOME%\bin\jconsole.exe

  - Visual VM：Visual VM是一个工具，它提供了一个可视界面，用于查看Java虚拟机上允许的基于Java技术的应用程序的详细信息。

    位置： %JAVA_HOME%\bin\jvisualvm.exe

  - JMC：Java Mission Control，内置Java Flight Recorder。能够以极低的性能开销收集Java虚拟机的性能数据。

- 第三方工具

  - MAT:MAT(Memory Analyzer Tool)是基于 Eclipse的内存分析工具，是一个快速、功能丰富的 Java heap分析工具，它可以帮助我们查找内存泄漏和减少内存消耗

    Eclipse的插件形式· Jprofiler:商业软件，需要付费。功能强大。

  - JProfiler：商业软件，需要付费。功能强大。 与VisualVM类似。

  - Arthas：Alibaba开源的Java诊断工具，深受开发者喜爱。

  - Btrace：Java运行时追踪工具。可以再不停机的情况下，跟踪指定方法调用、构造函数调用和系统内存等信息。

## jconsole

### 基本概述

- 从Java5开始，在JDK中自带的java监控和管理控制台。
- 用于对JVM中内存、线程和类等的监控，是一个基于JMX（java management extensions）的GUI性能监控工具。

官方教程：

https://docs.oracle.com/javase/7/docs/technotes/guides/management/jconsole.html

### 启动

```bash
>> jconsole
```

### 三种连接方式

**local:**

​		便用JConsole连接一个正在本地系统运行的JVM并且执行程序的和运行JConsole的需要是同一个用户，JConsole使用文件系统的授权通过RMI连接器连接到平台的Mbean服务器上，这种从本地连接的监控能力只有Sun的JDK具有。

**Remote:**

​		便用下面的URL通过RMI连接器连接到一个JMX代理，service:jmx:rmi:///jndi/rmi://hostName:portNum/jmxrmi。JConsole为建立连接，需要在环境变量中设置jmx.remote.credentials来指定用户名和密码，从而进行授权。

**Adavanced:**

​		使用一个特殊的URL连接JMX代理，一般情况使用自己定制的连接器而不是RMI提供的连接器来连接JMX代理，或者是一个使用JDK1.4的实现了JMX和 JMX Rmote的应用

## Visual VM

​		TODO:: 有时间继续学习！

## eclipse MAT

## JProfiler

## Arthas

官方文档： http://arthas.gitee.io/

[Arthas，一个JAVA项目分析/诊断工具在mac上的试用记录](https://www.deathearth.com/1345.html)

## Java Mission Control

## Btrace

## Flame Graphs（火焰图）

## IBM HeapAnalyzer

​	IBM *HeapAnalyzer* is a graphical tool for discovering possible Java heap leaks.





[JVM性能调优的6大步骤，及关键调优参数详解](https://zhuanlan.zhihu.com/p/58897189)