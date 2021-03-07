# JVM监控及诊断工具-命令行篇

## 概述

​		性能诊断是软件工程师在日常工作中需要经常面对和解决的问题，在用户体验至上的今天，解决好应用的性能问题能带来非常大的收益。

​		Java作为最流行的编程语言之一，其应用性能诊断一直受到业界广泛关注。可能造成Java应用出现性能问题的因素非常多，例如线程控制、磁盘读写、数据库访问、网络I/0、垃圾收集等。想要定位这些问题，一款优秀的性能诊断工具必不可少。

体会1：使用数据说明问题，使用知识分析问题，使用工具处理问题。

体会2：无监控、不调优!

## jps

​	查看正在运行的Java进程

​	jps（Java Process Status）：显示指定系统内所有的 HotSpot虚拟机进程(查看虚拟机进程信息)，可用于查询正在运行的虚拟机进程。

​	说明:对于本地虚拟机进程来说，进程的本地虚拟机ID与操作系统的进程ID是一致的，是唯一的。

它的基本语法为：

```
>> jps --help
illegal argument: --help
usage: jps [-help]
       jps [-q] [-mlvV] [<hostid>]

Definitions:
    <hostid>:      <hostname>[:<port>]
```

-q：仅仅显示LVMID(local virtual machine id)，即本地虚拟机唯一id。不显示主类的名称等

-l：输出应用程序主类的全类名或如果进程执行的是jar包，则输出jar完整路径

-m:输出虚拟机进程启动时传递给主类main()的参数

-v:列出虚拟机进程启动时的]VM参数。比如:-Xms20m -Xmx50m是启动程序指定的jvm参数。

说明：以上参数可以综合使用。

补充：

如果某Java进程关闭了默认开启的UsePerfData参数(即使用参数-XX:-UsePerfData)，那么jps命令(以及下面介绍的jstat)将无法探知该Java进程。

```
>> jps -lv 
41936 sun.tools.jps.Jps -Denv.class.path=.:/opt/jdk1.8.0_261/lib:/opt/jdk1.8.0_261/jre/lib: -Dapplication.home=/opt/jdk1.8.0_261 -Xms8m
33148 com.intellij.idea.Main -Xms128m -Xmx1482m -XX:ReservedCodeCacheSize=240m -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -ea -XX:CICompilerCount=2 -Dsun.io.useCanonPrefixCache=false -Djdk.http.auth.tunneling.disabledSchemes="" -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -Djdk.attach.allowAttachSelf=true -Dkotlinx.coroutines.debug=off -Djdk.module.illegalAccess.silent=true -Dawt.useSystemAAFontSettings=lcd -Dsun.java2d.renderer=sun.java2d.marlin.MarlinRenderingEngine -Dsun.tools.attach.tmp.only=true -javaagent:/home/tc/.jetbrains/jetbrains-agent-v3.2.0.0f1f.69e=6e68f9eb，f9fF1I/ygZI7Ff14sigGMZmZ7KJkhsM364o6exiukAqGORVXN1e4Fk4B8+hGSl5B+iLp9nIA2pSNhNGlxnDgSV3xC85CGVvWY9SWa+ECeWhJZ1+hitDPCNw5lKaRBnxIKhAfQ3aJl4S5WmrOkfKoIuz3UXVoX7hZGxofqQtzfuc -XX:ErrorFile=/home/tc/java_error_in_IDEA_%p.log -XX:HeapDumpPath=/home/tc/java_error_in_IDEA.hprof -Didea.vendor.name=JetBrains -Didea.paths.selector=IntelliJIdea2020.2 -Djb.vmOptionsFile=/home/tc/.config/JetBrains/IntelliJIdea2020.2/idea64.vmoptions -Didea.jre.check=true
```



## jstat

​	查看JVM统计信息

​	jstat(JVM Statistics Monitoring Too1)：用于监视虚拟机各种运行状态信息的命令行工具。它可以显动本地或者远程虚拟机进程中的类装载、内存、垃圾收集、JIT编译等运行数据。在没有GUI图形界面，只提供了纯文本控制台环境的服务器上，它将是运行期定位虚拟机性能问题的首选工具。常用于检测垃圾回收问题以及内存泄漏问题。

官网文档：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html

```
>> jstat -help
Usage: jstat -help|-options
       jstat -<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]

Definitions:
  <option>      An option reported by the -options option
  <vmid>        Virtual Machine Identifier. A vmid takes the following form:
                     <lvmid>[@<hostname>[:<port>]]
                Where <lvmid> is the local vm identifier for the target
                Java virtual machine， typically a process id; <hostname> is
                the name of the host running the target Java virtual machine;
                and <port> is the port number for the rmiregistry on the
                target host. See the jvmstat documentation for a more complete
                description of the Virtual Machine Identifier.
  -t            可以在输出信息前加上一个程序启动的时间Timestamp。
  <lines>       Number of samples between header lines.
  <interval>    Sampling interval. The following forms are allowed:
                    <n>["ms"|"s"] 用于指定输出统计数据的周期
                Where <n> is an integer and the suffix specifies the units as 
                milliseconds("ms") or seconds("s"). The default units are "ms".
  <count>       Number of samples to take before terminating. 用于指定查询的总次数
  -J<flag>      Pass <flag> directly to the runtime system.
  -h<number>    可以再周期性显示表头
>> jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcmetacapacity
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcutil
-printcompilation
```

选项option可以由一下值构成：

- 类装载相关的：
  - -class：显示ClassLoader的相关信息：类的装载、卸载数量、总空间、类装载所消耗的时间等。
- 垃圾回收相关的：
  - -gc：显示与GC相关的堆信息。包括Eden区、两个 Survivor区、老年代永久代等的容量、已用空间、GC时间合计等信息
  - -gccapacity:显示内容与-gc基本相同，但输出主要关注Java堆各个区域使用到的最大、最小空间。
  - -gcutil:显示内容与-gc基本相同，但输出主要关注已使用空间占总空间的百分比。
  - -gccause:与-gcutil功能一样，但是会额外输出导致最后一次或当前正在发生的GC产生的原因。
  - -gcnew:显示新生代GC状况
  - gcnewcapacity:显示内容与-gcnew基本相同，输出主要关注使用到的最大、最小空间
  - geoid:显示老年代GC状况

```
>>jstat -class 33148
Loaded  Bytes  Unloaded  Bytes     Time   
 36592 74819.0        2     2.0      69.07
Loaded加载类的个数  Bytes加载类的字节数   unloaded卸载类的个数  Bytes卸载类的字节数  Time 花费总时长。
```

```
>>jstat -class -t 33148 1000 3
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time   
         1754.6  36592 74819.0        2     2.0      69.07
         1755.6  36592 74819.0        2     2.0      69.07
         1756.6  36592 74819.0        2     2.0      69.07
```

```
>>jstat -compiler 33148
Compiled编译数量 Failed编译失败数量 Invalid   Time编译耗时   FailedType失败类型  FailedMethod
   17567          7                0    61.80          1 java/util/HashSet  contains
```

```
>>jstat -printcompilation 33148
Compiled  Size  Type Method
   17600   1428    1 java/text/DecimalFormat expandAffix
```

```
jstat -gc 33148 1000 3
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
4352.0 4352.0  0.0   4191.1 34944.0  17291.5   310896.0   189519.4  255476.0 243146.9 36768.0 32658.2     87    1.454   0      0.000    1.454
4352.0 4352.0  0.0   4191.1 34944.0  17323.2   310896.0   189519.4  255476.0 243146.9 36768.0 32658.2     87    1.454   0      0.000    1.454
4352.0 4352.0  0.0   4191.1 34944.0  17418.0   310896.0   189519.4  255476.0 243146.9 36768.0 32658.2     87    1.454   0      0.000    1.454
表头解释：
S0C幸存者0区容量
S1C幸存者1区容量
S0U幸存者0区已经使用容量
S1U幸存者1区已经使用容量
EC伊甸园区总容量
EU伊甸园区已经使用容量
OC老年代总容量
OU老年代已经使用容量
MC方法去总容量
MU方法去已经使用容量
CCSC压缩类容量
CCSU压缩类已经使用容量
YGC发生Young GC次数
YGCT发生Young GC时间
FGC发生Full GC次数
FGCT发生Full GC时间
GCT总的GC时间
```

```
jstat -gcutil 33148 1000 2  主要关注占比。
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT   
  0.00   9.66  18.35  61.71  95.20  88.82     89    1.465     0    0.000    1.465
  0.00   9.66  18.35  61.71  95.20  88.82     89    1.465     0    0.000    1.465
```

```
jstat -gccause 33148 1000 10 关注发生gc原因
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT     GCT    LGCC                 GCC                 
  0.00   9.66  88.63  61.71  95.20  88.82     89    1.465     0    0.000    1.465 Allocation Failure   No GC
```

```
jstat -gc -t 33148 1000 10
Timestamp        S0C    S1C    S0U    S1U      EC       EU        OC         OU       MC     MU    CCSC   CCSU   YGC     YGCT    FGC    FGCT     GCT   
         3765.4 4352.0 4352.0 106.4   0.0   34944.0  32191.2   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3766.4 4352.0 4352.0 106.4   0.0   34944.0  32191.2   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3767.4 4352.0 4352.0 106.4   0.0   34944.0  32191.2   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3768.4 4352.0 4352.0 106.4   0.0   34944.0  32296.5   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3769.4 4352.0 4352.0 106.4   0.0   34944.0  32593.5   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3770.4 4352.0 4352.0 106.4   0.0   34944.0  32701.4   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3771.4 4352.0 4352.0 106.4   0.0   34944.0  32701.4   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3772.4 4352.0 4352.0 106.4   0.0   34944.0  32706.5   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3773.4 4352.0 4352.0 106.4   0.0   34944.0  32706.5   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
         3774.4 4352.0 4352.0 106.4   0.0   34944.0  32706.5   310896.0   191865.7  255476.0 243219.7 36768.0 32658.2     90    1.469   0      0.000    1.469
```

-t参数经验：我们可以比较Java进程的启动时间以及总GC时间(GCT列)，或者两次测量的间隔时间以及总GC时间的增量，来得出GC时间占运行时间的比例。如果该比例超过2%，则说明目前堆的压力较大;如果该比例超过9%，则说明堆里几乎没有可用空间，随时都可能抛出OOM异常。

## jinfo

​	jinfo(Configuration Info for Java)，实时查看和修改JVM配置参数

​	查看虚拟机配置参数信息，也可用于调整虚拟机的配置参数。

​	在很多情况下，Java应用程序不会指定所有的]ava虚拟机参数。而此时，开发人员可能不知道某一个具体的]ava虚拟机参数的默认值。在这种情况下，可能需要通过查找文档获取某个参数的默认值。这个査找过程可能是非常艰难的。但有了jinfo工具，开发人员可以很方便地找到Java虚拟机参数的当前值。

```
Usage:
    jinfo [option] <pid>
        (to connect to running process)
    jinfo [option] <executable <core>
        (to connect to a core file)
    jinfo [option] [server_id@]<remote server IP or hostname>
        (to connect to remote debug server)

where <option> is one of:
    -flag <name>         to print the value of the named VM flag 打印jvm参数
    -flag [+|-]<name>    to enable or disable the named VM flag 启用禁用jvm参数
    -flag <name>=<value> to set the named VM flag to the given value 设置jvm参数
    -flags               to print VM flags 打印所有jvm参数
    -sysprops            to print Java system properties 打印java系统属性
    <no option>          to print both of the above 打印jvm参数和java系统属性
    -h | -help           to print this help message 打印帮助信息
```

官网帮助文档：http://docs.oracle.com/en/java/javase/11/tools/jinfo.html

```
查看
jinfo -sysprops PID 可以查看System.getProperties()取得的参数
jinfo -flags PID 查看曾经赋值过值得一些参数
jinfo -flag 具体参数 PID  查看某个java进程的具体参数的值
修改
针对boolean类型  jinfo -flag [+|-] 具体参数 PID
针对非boolean类型 jinfo -flag 具体参数=具体参数值 PID
```

jinfo不仅可以查看运行时某一个Java虚拟机参数的实际取值，甚至可以再运行时修改部分参数，并使之立即生效。但是并非所有参数都支持动态修改。参数只有被标记为manageable的flag可用被实时修改。其实，这个修改能力是极其有限的。如何查看被标记为manageable的参数？

```
>> java -XX:+PrintFlagsFinal -version | grep manageable | awk '{print $2"="$4}'
CMSAbortablePrecleanWaitMillis=100
CMSTriggerInterval=-1
CMSWaitDuration=2000
HeapDumpAfterFullGC=false
HeapDumpBeforeFullGC=false
HeapDumpOnOutOfMemoryError=false
HeapDumpPath={manageable}
MaxHeapFreeRatio=100
MinHeapFreeRatio=0
PrintClassHistogram=false
PrintClassHistogramAfterFullGC=false
PrintClassHistogramBeforeFullGC=false
PrintConcurrentLocks=false
PrintGC=false
PrintGCDateStamps=false
PrintGCDetails=false
PrintGCID=false
PrintGCTimeStamps=false
```

**拓展：**

java -XX:+PrintFlagsIniitial  查看所有JVM参数启动的初始值。

java -XX:+PrintFlagsFinal 查看所有JVM参数最终值。

java -XX:+PrintCommandLineFlags 查看哪些已经被用户或者JVM设置过的详细的XX参数的名称和值。

### jmap

​	导出内存映像文件&内存使用情况

## jhat

​	JDK自带堆分析工具

## jstack

​	打印JVM中线程快照

## jcmd

​	多功能命令行

## jstatd

​	远程主机信息收集