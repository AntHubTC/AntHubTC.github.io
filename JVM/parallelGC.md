# Parallel回收器：吞吐量优先

## 概述

- Hotspot的年轻代中除了拥有 ParNew收集器是基于并行回收的以外，Parallel Scavenge收集器同样也釆用了复制算法、并行回收和"stop the World“机制。
- 那么Parallel收集器的出现是否多此一举?
  - 和 ParNew收集器不同，Parallel Scavenge收集器的目标则是达到个可控制的吞吐量( Throughput)，它也被称为吞吐量优先的垃圾收集器。
  - 自适应调节策略也是Parallel Scavenge与 ParNew一个重要区别。
- 高吞吐量则可以高效率地利用CPU时间，尽快完成程序的运算任务，主要适合在后台运算而不需要太多交互的任务。因此，常见在服务器环境中使用。例如，那些执行批量处理、订单处理、工资支付、科学计算的应用程序。
- Parallel收集器在JDK1.6时提供了用于执行老年代垃圾收集的Parallel o1d收集器，用来代替老年代的 Serial Old收集器。
- Parallel old收集器采用了标记-压缩算法，但同样也是基于并行回收和Stop-the-Wor1d"机制。
- 在程序吞吐量优先的应用场景中，Parallel收集器和Parallel Old收集器的组合，在 Server模式下的内存回收性能很不错。
- 在Java8中，默认是此垃圾收集器。

```java
/**
* vm args: -XX:+PrintCommandLineFlags  可以看到 +XX:+UsexxxxxGC是使用的上面GC
* hotspot中，使用-XX:+UseParllelGC
*/
public class GCUseTest{
    public static void main(String[] args) {
        ArrayList<byte[]> list = new ArrayList();
        
        while(true){
            byte[] arr = new byte[100];
            list.add(arr);
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStacktrace();
            }
        }
    }
}
```

## 参数配置

- -xx:+ UseParallelGC 手动指定年轻代使用Parallel并行收集器执行内存回收任务-
- -xx:+ UseParallelOldGC 手动指定老年代都是使用并行回收收集器。
  - 分别适用于新生代和老年代。默认jdk8是开启的。
  - 上面两个参数，默认开启一个，另一个也会被开启。(互相激活)
- -xx:ParallelGCThreads 设置年轻代并行收集器的线程数。一般地，最好与CPU数量相等，以避免过多的线程数影响垃圾收集性能。
  - 在默认情况下，当CPU数量小于8个，ParallelGCThreads的值等于CPU数量。
  - 当CPU数量大于8个，ParallelGCThreads的值等于3+[5*CPU_Count]/8。
- -xx: MaxGCPauseMillis 设置垃圾收集器最大停顿时间(即STW的时间)。单位是毫秒。
  - 为了尽可能地把停顿时间控制在 MaxGCPauseMillis以内，收集器在工作时会调整Java堆大小或者其他一些参数。
  - 对于用户来讲，停顿时间越短体验越好。但是在服务器端，我们注重高并发，整体的吞吐量。所以服务器端适合Parallel，进行控制.
  - 该参数使用需谨慎。
- -XX:GCTimeRatio 垃圾收集时间占总时间的比例( = 1 / ( N + 1 ) )。用于衡量吞吐量的大小。
  - 取值范围(0， 100)。默认值99，也就是垃圾回收时间不超过1%。
  - 与前一个-XX: MaxGCPauseMillis 参数有一定矛盾性。暂停时间越长，Radio参数就容易超过设定的比例。
- -XX:+UseAdaptiveSizePolicy 设置Parallel Scavenge收集器具有**自适应调节策略**。
  - 在这种模式下，年轻代的大小、Eden和 Survivor的比例、晋升老年代的对象年龄等参数会被自动调整，已达到在堆大小、吞吐量和停顿时间之间的平衡点。
  - 在手动调优比较困难的场合，可以直接使用这种自适应的方式，仅指定虚拟机的最大堆、目标的吞吐量( GCTimeRatio)和停顿时间(MaxGCPauseMills)，让虚拟机自己完成调优工作。























