# Jmeter

## 学习资源

​		https://www.bilibili.com/video/av34693639?p=1

## 介绍

​		Apache JMeter是Apache组织开发的基于Java的压力测试工具。用于对软件做压力测试，它最初被设计用于Web应用测试，但后来扩展到其他测试领域。 它可以用于测试静态和动态资源，例如静态文件、Java 小服务程序、CGI 脚本、Java 对象、数据库、FTP 服务器， 等等。JMeter 可以用于对服务器、网络或对象模拟巨大的负载，来自不同压力类别下测试它们的强度和分析整体性能。另外，JMeter能够对应用程序做功能/回归测试，通过创建带有断言的脚本来验证你的程序返回了你期望的结果。

## 文件目录介绍

- bin：可执行文件目录
  - jmeter.bat windows中的启动文件
  - jmeter.log 日志文件
  - jmeter.sh  linux中的启动文件
  - jemter.properties 配置文件
  - jmeter-server.bat  windows分布式测试要用到的服务器配置
  - jmeter-server linux分布式测试要用到的服务器配置
- docs: 接口文档目录
- extras：扩展插件目录
- lib：所用到的插件目录，里面全是jar包，Jmeter会自动在JMETER_HOME/lib和ext目录下寻找需要的类
- Licenses   jmeter证书目录
- printable_docs 用户使用手册

## 功能概要

![1581823646134](.\img\1581823646134.png)

Jmeter工具组成部分：

- 资源生成器：用于生成测试过程中服务器、负载机的资源代码。（Load Runner中的VuGen）
- 用户运行器：通常是一个脚本运行引擎，根据脚本要求模拟指定的用户行为。（LR中的Controller）
- 报表生成器：根据测试中实时地的数据生成报表，根据可视化的数据显示方式。（LR中的Analysis）
- 负载发生器：用于产生负载，通常以多线程或是多进程的方式模拟用户行为。（LR中的Load Generators）

1. Test Plan（测试计划）：用来描述一个性能测试，包含与本次性能测试所有相关的功能。也就是说，性能测试的所有的内容是基于一个计划的。（相当于LR中的测试场景）

2. Threads（Users）线程  用户

   - setup thread group

     一种特殊类型的ThreadGroup，可用于执行预测试操作。这些线程的行为完全像一个正常的线程组元件。不同的是，这些类型的线程执行测试前进行定期线程组的执行。类似LR中的init（）

   - teardown thread group

     一种特殊类型的ThreadGroup，可用于执行测试后动作。这些线程的行为完全像一个正常的线程组元件。不同的是，这些类型的线程执行测试结束后执行定期的线程组。类似LR中的end()

   - thread group(线程组)

     这个就是我们通常添加运行的线程。可以看做一个虚拟用户组，线程组中每个线程都可以理解为一个虚拟用户。线程组中包含的线程数量在测试执行过程中是不会发生改变的。类似LR中的action()

3. 测试片段(Test Fragment)

   测试片段元素是控制器上一个特殊的线程组，它在测试树上与线程组处于一个层级。它与线程组有所不同，因为它不被执行，除非它是一个模块控制器或者被控制器所引用时才会被执行。

   =========以下是线程组的8类可执行元件==========

4. 配置元件（Config Element）

   配置元件（Config Element）用于提供对静态数据配置的支持。如CSV Data Set Config可以将本地数据文件形成数据池（Data Pool）。

5. 定时器（Timer）

   定时器（Timer）用于操作之间设置等待时间，等待时间是性能测试中常用的控制器QPS的手段。类似LoadRunner里面的“思考时间”。Jmeter定义了Bean Shell Timer、Constant Throughput Timer、固定定时器等不同类型的Timer。

6. 前置处理器（Per Processor）

   用于在实际的请求发出之前对即将发出的请求进行特殊处理。例如，HTTP URL重写修饰符则可以实现URL重写，当URL中有session信息时，可以通过该处理器填充发出请求的实际sessionID。

7. 后置处理器（Post Processors）

   用于对Sampler发出请求后得到的服务器响应进行处理。一般用来提取响应中的特定的数据（类似LoadRunner测试工具中的关联概念）。

8. 断言（Assertions）

   断言用于检查测试中得到的响应数据是否符合预期数据，断言一般用来设置检查点，用以保证性能测试过程中的数据交互是否和预期一致。

9. 监听器（Listener）

   是用来对测试结果数据进行处理和可视化展示的一系列元件。图形结果、查看结果树、聚合报告。都是我们经常用到的元件。注意：这个监听器可不是用来监听系统资源的文件。

10. 取样器（Sample）

    取样器（Sample）是性能测试中向服务器发送请求，记录响应信息，记录响应时间的最小单元，JMeter原生支持多种不同的Sampler，如HTTP Request Sampler、FTP Request Sample、TCP Request Sample、JDBC Request Sampler等，每一种不同类型sampler可以根据设置的参数向服务器发出不同类型的请求。

11. 逻辑控制器

    逻辑控制器，包括两类元件，一类是用于控制test plan中sampler节点发送请求的逻辑顺序的控制器，常用的有 IF控制器、switch Controller、Runtime Controller、循环控制器等。另一类是用来组织可控制sampler节点，如 事务控制器、吞吐量控制器。

## Jmeter元件作用域和执行顺序

​		8类可执行元件（测试计划与线程组不属于可执行元件），这些元件中，取样器（sampler）是典型的不与其它元件发生交换作用的元件，逻辑控制器只对其子节点的取样器有效，而其它元件（配置元件、定时器、断言、监听器）需要与取样器（sampler）等元件交互。

​		在Jmeter中，元件的作用域是靠测试计划的树状结构中元件的父子关系来确定的，作用域的原则是：

- 取样器（sampler）元件不和其它元件相互作用，因此不存在作用域问题。
- 逻辑控制器（Logic Controller）元件只对其子节点中的取样器和逻辑控制器作用。
- 除取样器和逻辑控制器元件外，其它6类元件，如果是某个取样器的子节点，则该元件对其父子节点起作用。如果其父节点不是取样器，则其作用域是该元件父节点下的其它所有后代节点（包括子节点，子节点的子节点等）。

执行顺序：

1. 配置元件（Config Elements）
2. 前置处理程序（Per-processors）
3. 定时器（Timers）
4. 取样器（Sampler）
5. 后置处理程序（Post-processors）
6. 断言（Assertons）
7. 监听（LIsteners）

关于执行顺序，有两点需要注意：

​	前置处理器，后置处理器和断言等元件功能对取样器作用，因此，如果在它们的作用域内没有任何取样器，则不会执行。

​	如果在同一作用域内有多个同一类型的元件，则这些元件按照他们在测试计划中的上下顺序来执行。

Jmeter元件是可以通过拖动来改变它的作用域和执行顺序。



