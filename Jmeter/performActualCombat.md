# 性能测试实战

## 测试需求

​		测试20个用户访问http://www.51zxw.net 在负载达到30 QPS时平均响应时间。

> QPS： Query Per Second 每秒查询率。是一台查询服务器每秒能够处理的查询次数。在因特网上，作为域名系统服务器的性能经常用每秒查询率来衡量。

## 测试步骤

1. 添加线程组

   ![1581992518094](.\img\1581992518094.png)

   线程组主要三个参数：线程数、准备时长（Ramp-UP Period(in seconds)）、循环次数。

   - 线程数：虚拟用户数。一个虚拟用户占一个进程或线程。设置多少个虚拟用户在这里也就是设置多少个线程数。
   - 准备时长（单位为s）：设置的虚拟用户数需要多长时间全部启动。如果线程数为20，准备时长为10s，那么需要10秒钟启动20个线程。也就是每秒启动2个线程。
   - 循环次数：每个线程发送请求的次数。如果线程数为20，循环次数为5，那么每个线程发送5次请求。总请求数为20*5=100.如果勾选了“永远”，那么所有线程会一直发送请求，一直到选择停止运行脚本为止。

2. 添加HTTP请求

   ![添加HTTP请求](.\img\1581992217938.png)

   添加完成线程组后，在线程组上右键菜单(添加--->Sampler--->HTTP请求)选择HTTP请求。

   对于jmeter来说，取样器(Sampler)是与服务器进行交互的单元。

   一个取样器通常进行三部分的工作：

   向服务器发送请求；记录服务器的响应数据；记录相应时间信息

   一个HTTP请求有着许多的配置参数，下面将详细介绍：

   - **名称**：本属性用于标识一个取样器，建议使用一个有意义的名称。
   - **注释**：对于测试没有任何作用，仅用户记录用户可读的注释信息。
   - **服务器名称或IP** ：HTTP请求发送的目标服务器名称或IP地址。
   - **端口号**：目标服务器的端口号，默认值为80 。
   - **协议**：向目标服务器发送HTTP请求时的协议，可以是http或者是https ，默认值为http 。
   - **方法**：发送HTTP请求的方法，可用方法包括GET、POST、HEAD、PUT、OPTIONS、TRACE、DELETE等。
   - **Content encoding** ：内容的编码方式，默认值为iso8859
   - **路径**：目标URL路径（不包括服务器地址和端口）
   - **自动重定向**：如果选中该选项，当发送HTTP请求后得到的响应是302/301时，JMeter 自动重定向到新的页面。
   - **Use keep Alive** ： 当该选项被选中时，jmeter 和目标服务器之间使用 Keep-Alive方式进行HTTP通信，默认选中。
   - **Use multipart/from-data for HTTP POST** ：当发送HTTP POST 请求时，使用Use multipart/from-data方法发送，默认不选中。
   - **同请求一起发送参数** ： 在请求中发送URL参数，对于带参数的URL ，jmeter提供了一个简单的对参数化的方法。用户可以将URL中所有参数设置在本表中，表中的每一行是一个参数值对（对应RUL中的 名称1=值1）。
   - **同请求一起发送文件**：在请求中发送文件，通常，HTTP文件上传行为可以通过这种方式模拟。
   - **从HTML文件获取所有有内含的资源**：当该选项被选中时，jmeter在发出HTTP请求并获得响应的HTML文件内容后，还对该HTML进行Parse 并获取HTML中包含的所有资源（图片、flash等），默认不选中，如果用户只希望获取页面中的特定资源，可以在下方的Embedded URLs must match 文本框中填入需要下载的特定资源表达式，这样，只有能匹配指定正则表达式的URL指向资源会被下载。

3. 设置QPS限制

   ​			本次性能测试的需求中提到测试的目的是“了解51zxw首页在负载达到30 QPS时的响应时间”，因此需要控制向51zxw首页发送请求的负载为30QPS。

   　　一种可行的方法是逐步调整测试计划中的线程计算的数量以及为取样器（Sampler）添加定时器（Timer），以使HTTP取样器发出的请求的QPS保持在20个左右。但这种方法耗时耗力，需要经过多次尝试才能达到；另一方法，完全通过设置定时器来控制QPS，一旦取样器的响应时间发生改变（网络环境发生改变），就需要重新调整定时器的等待时间。

   ​	Jmeter提供了一个非常有用的定时器，称为Constant Throughput Timer（常数吞吐量定时器），该定时器可以方便地控制给定的取样器发送请求的吞吐量。

   Sampler上右键菜单(add--->Timer--->Constant Throughput Timer)

   ![1581994084866](.\img\1581994084866.png)

   Constant Throughput Timer的主要属性介绍：

   ​	Target throughput(in samples per minute)：每分钟的吞吐量。  30(QPS)* 60s(1分钟) = 1800

   Calculate Throughput based on:         （这里选择活跃线程  all active threads）

   - This thread only ：控制每个线程的吞吐量，选择这种模式时，总的吞吐量为设置的 target Throughput 乘以总线程的数量。
   - All active threads ： 设置的target Throughput 将分配在每个活跃线程上，每个活跃线程在上一次运行结束后等待合理的时间后再次运行。活跃线程指同一时刻同时运行的线程。
   - All active threads in current thread group ：设置的target Throughput将分配在当前线程组的每一个活跃线程上，当测试计划中只有一个线程组时，该选项和All active threads选项的效果完全相同。
   - All active threads （shared ）：与All active threads 的选项基本相同，唯一的区别是，每个活跃线程都会在所有活跃线程上一次运行结束后等待合理的时间后再次运行。
   - All active threads in current thread group （shared ）：与All active threads in current thread group 基本相同，唯一的区别是，每个活跃线程都会在所有活跃线程的上一次运行结束后等待合理的时间后再次运行。

   如上图，该元件作用于访问51zxw，设置定时器的Target throughput为1800/分钟(30 QPS)，设置Calculate Throughput based on的值为All active threads。

   当然，Constant Throughput Timer只有在线程组中的线程产生足够多的request的情况下才有意义，因此，即使设置了Constant Throughput Timer的值，也可能由于现场组中的线程数量不够，或是定时器设置不合理等原因导致总体的QPS不能达到预期目标。

4. 添加监视器

   ​		脚本的主要部分设置完成后，需要通过某种方式获得性能测试中的测试结果，在本例中，我们关心的是请求的响应时间。

   　　Jmeter 中使用监听器元件收集取样器记录的数据并以可视化的方式来呈现。Jmeter有各种不同的监听器类型，因为上HTTP请求，我们可在添加聚合报告，更为直观的查看测试结果。

   　　添加聚合报告，右键点击取样器，在弹的菜单（添加--->监听器--->聚合报告）中选择聚合报告。

   ​		添加查看结果树，右键点击取样器，在弹得菜单（添加--->监听器--->查看结果树）

5. 运行

   ​	点击工具栏的“运行按钮”。

   Ctrl+R 执行测试计划
   Ctrl+E 清空执行结果

6. 查看结果

聚合报告中表格列的含义：

- Label：每个JMeter的element（例如Http Request）都有一个Name属性，这里显示的就是Name属性的值。
- #samples：表示你这次测试中一共发出了多少个请求，如果模拟10个用户，每个用户迭代10次，那么这里显示100。
- Average：平均响应时间----默认情况下是单个Request的平均响应时间，当使用了Transaction Controller时，也可以是以Transaction为单位显示平均响应时间。
- Median：中位数，也就是50%用户的响应时间。
- 90%Line：90%用户的响应时间。
- Min：最小响应时间。
- Max：最大响应时间。
- Error%：本次测试中出现错误的请求的数量/请求的总户数。
- Throughput：吞吐量----默认情况下表示每秒完成的请求数（Requesst per Second），当使用了Transaction Controller，也可以表示类似LoadRunner的Transaction per Second数。
- KB/sec：每秒从服务器端接收到的数据量，相当于LoadRunner中的Throughput/Sec。

![1581995738099](.\img\1581995738099.png)

