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

## jmap

​	导出内存映像文件&内存使用情况。

**基本情况：**

​	jmap(JVM Memory Map)：作用一方面是获取dump文件(堆转储快照文件，二进制文件)，它还可以获取目标]ava进程的内存相关信息，包括]ava堆各区域的使用情况、堆中对象的统计信息、类加载信息等。开发人员可以在控制台中输入命令“jmap -help”查阅jmap工具的具体使用方式和一些标准选项配置。

官方帮助文档：https://docs.oracle.com/en/java/javase//11/tools/jmap.html

**基本语法：**
    jmap [option] \<pid\>
        (to connect to running process)
    jmap [option] \<executable \<core\>
        (to connect to a core file)
    jmap [option] [server_id@]\<remote server IP or hostname\>
        (to connect to remote debug server)

-dump 生成Java堆转储快照：dump文件。 特别的: -dump:live 只保存堆中的存活对象

-heap 输出整个堆空间的详细信息，包括GC的使用、堆配置信息，以及内存的使用信息等

-histo 输出堆中对象的统计信息，包括类、实例数量和合计容量。特别的: -histo:live只统计堆中的存活对象

-permstat 以 Classloader为统计口径输出永久代的内存状态信息。**仅 linux/ solaris平台有效**

-finalizerinfo 显示在 F-queue中等待Finalizer线程执行finalize方法的对象。**仅 linux/solaris平台有效**

-F 当虚拟机进程对-dump选项没有任何响应时，可使用此选项强制执行生成dump文件。**仅lnux/ solaris平台有效**

-h | -help 显示jmap工具使用的帮助命令

-J \<flag\> 传递参数给jmap启动的jvm

**使用1：导出内存镜像文件**

Heap Dump又叫堆存储文件，指一个Java进程在某个时间点的内存快照。Heap Dump在触发内存快照的时候会保存此刻的信息如下：

- All Objects

  Class，fields，primitive value and references

- All Classs

  ClassLoader，name，super class，static fields

- Garbage Collection Roots

  Objects defined to be reachable by the JVM

- Thread stack and Local variables

  The call-stacks of threads at the moment of the snapshot，and per-frame information about local objects.

  说明：

  1. 通常在写Heap Dump文件前会触发一次Full GC，所以heap dump文件里保存的都是Full GC后留下的对象信息。
  2. 由于生成dump文件比较耗时，因此大家需要耐心等待，尤其是大内存镜像生成dump文件则需要耗费更长时间来完成。

手动方式：

​		jmap -dump:format=b，file=\<filename.hprof\> \<pid\>

​		jmap -dump:live，format=b，file=\<filename.hprof\> \<pid\>

自动方式：

​	-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=\<filename.hprof\>

**使用2：显示堆内存相关情况**

jmap -heap pid     gc线程数、堆配置信息、堆使用情况. 

jmap -histo   内存中java对象占用情况。

**使用3：其它作用**

jmap -permstat pid 查看系统的Classloader信息

jmap -finalizerinfo 查看堆积在finalizer队列中的对象

**小结**

​	由于jmap将访问堆中的所有对象，为了保证在此过程中不被应用线程干扰，jmap需要借助安全点机制，让所有线程停留在不改变堆中数据的状态。也就是说，由jmap导出的堆快照必定是安全点位置的。这可能导致基于该堆快照的分析结果存在偏差。

举个例子，假设在编译生成的机器码中，某些对象的生命周期在两个安全点之间，那么1ive选项将无法探知到这些对象。

另外，如果某个线程长时间无法跑到安全点，jmap将一直等下去。与前面的 jstat则不同，垃圾回收器会主动将 jstat所需要的摘要数据保存至固定位置之中，而jstat只需直接读取即可。

## jhat

​	jhat(JVM Heap Analysis Tool)，JDK自带堆分析工具

​	sun JDK提供的jhat命令与jmap命令搭配使用，用于分析jmap生成的heap dump文件(堆转储快照)。jhat内置了一个微型的HTTP/HTML服务器，生成dump文件的分析结果后，用户可以在浏览器中查看分析结果(分析虚拟机转储快照信息)。

​	使用了jhat命令，就启动了一个http服务，端口是7000.即http://localhost:7000/就可以在浏览器里分析。

​	说明：jhat命令在JDK9、JDK10中已经被删除，官方建议用 VisualVM代替。 

基本语法：jhat [option] [dumpfile] 更详细用法查看jhat --help

## jstack

​	jstack(JVM Stack Trace)打印JVM中线程快照。

​	jstack用于生成虚拟机指定进程当前时刻的线程快照(虛拟机堆栈跟踪)。线程快照就是当前虚拟机内指定进程的每一条线程正在执行的方法堆栈的集合。

​	生成线程快照的作用:可用于定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间等待等问题。这些都是导致线程长时间停顿的常见原因。当线程出现停顿时，就可以用 stack显示各个线程调用的堆栈情况。

官方帮助文档：

https://docs.oracle.com/en/java/javase/11/tools/jstack.html

在thread dump中，要留意下面几种状态

- **死锁，Deadlock（重点关注）**
- **等待资源，Waiting on condition（重点关注）**
- **等待获取监视器，Waiting on moitor entry（重点关注）**
- **阻塞，Blocked（重点关注）**
- 执行中，Runnable
- 暂停，Suspended

> jstack <pid> 

## jcmd

​	多功能命令行

​	在]DK1.7以后，所增了一个命令行工具jcmd。它是一个多功能的工具，可以用来实现前面除了jstat之外所有命令的功能。比如：用它来导出堆、内存使用、查看]ava进程、导岀线程信息、执行GC、JVM运行时间等。

官网帮助文档：https://docs.oracle.com/en/java/javase/11/tools/jcmd.html

jcmd拥有jmap的大部分功能，并且在Oracle的官方网站上也推荐使用jmd命令替代jmap命令。

**基本语法：**

​	jcmd -l 列出所有jcmd进程。

​	jcmd pid help 针对指定的进程，列出支持的所有命令。

​	jcmd pid 具体命令  显示指定进程的指令命令的数据。

```
具体命令：
The following commands are available:
Compiler.CodeHeap_Analytics
Compiler.codecache
Compiler.codelist
Compiler.directives_add
Compiler.directives_clear
Compiler.directives_print
Compiler.directives_remove
Compiler.queue
GC.class_histogram 类柱状图
GC.class_stats
GC.finalizer_info
GC.heap_dump  生成dump文件
GC.heap_info
GC.run
GC.run_finalization
JFR.check
JFR.configure
JFR.dump
JFR.start
JFR.stop
JVMTI.agent_load
JVMTI.data_dump
ManagementAgent.start
ManagementAgent.start_local
ManagementAgent.status
ManagementAgent.stop
Thread.print    打印进程信息，和jstack类似
VM.class_hierarchy
VM.classloader_stats
VM.classloaders
VM.command_line
VM.dynlibs
VM.flags JVM flag信息
VM.info
VM.log
VM.metaspace
VM.native_memory
VM.print_touched_methods
VM.set_flag
VM.stringtable
VM.symboltable
VM.system_properties 系统属性
VM.systemdictionary
VM.uptime
VM.version
help
```



## jstatd

​	远程主机信息收集

​	之前的指令只涉及到监控本机的]ava应用程序，而在这些工具中，一些监控工具也支持对远程计算机的监控(如jps、jstat)。为了启用远程监控，则需要配合使用 jstatd工具。命令 jstatd是一个RMI服务端程序，它的作用相当于代理服务器，建立本地计算机与远程监控工具的通信。 jstatd服务器将本机的Java应用程序信息传递到远程计算机。





















