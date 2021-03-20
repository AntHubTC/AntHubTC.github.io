[简介](README)


<h4>内存与垃圾回收篇</h4>

* [相关工具介绍](toolSoft)
* [ JVM与Java体系结构](jvmAndJavaArch)
* [类加载子系统](classLoaderSubSystem)
* [运行时数据区概述及线程](runtimeDateAreaThread)
* [程序计数器](PCRegisters)
* [虚拟机栈](vmstack)
* [本地方法接口](nativeMethodInterface)
* [本地方法栈](nativeMethodStack)
* [堆](heap)
* [方法区](methodArea)
* [对象实例化内存布局与访问定位](objInstanceMemLayout)
* [直接内存](directMemory)
* [执行引擎](engine)
* [StringTable](stringTable)
* [垃圾回收概述](gcSummary)
* [垃圾回收相关算法](gcAlgorithm)
* [垃圾回收相关概念](gcConcept)
* [垃圾收集器](garbageCollector)
* [不同垃圾回收器概述](garbageCollectorKindResume)
* [serial回收器：串行回收](serialGC)
* [ParNew回收器：并行回收](parNewGC)
* [Parallel回收器：吞吐量优先](parallelGC)
* [CMS 回收器：低延迟](CMSGC)
* [G1回收器：区域化分代式](G1GC)
* [7种经典垃圾回收器总结](gcReport)
* [GC日志分析](gcLogAnalyse)
* [GC的新发展](gcFuture)
* [其他垃圾回收器](otherGC)

<h4>字节码与类的加载器</h4>

有时间继续看！讲的好！

<h4>性能监控与调优篇</h4>

[概述篇](pmt-summary)

[JVM监控及诊断工具-命令行篇](pmt-command)

[JVM监控及诊断工具-GUI篇](pmt-gui)

[JVM运行时参数](pmt-runtimeVmArgs)

[分析GC日志](pmt-analyseGCLog)

[OOM常见各种场景及解决办法](pmt-analyseOOMError)

[性能优化案例](pmt-case)

<h4>大厂面试篇</h4>

[快手三面（Java岗），意向已拿，盘点一下面试官都问了些啥？](https://www.jianshu.com/p/dde956b8c150)

暂时放这里：

[G1从入门到放弃](https://www.jianshu.com/p/548c67aa1bc0)

[一步步图解G1](https://blog.didispace.com/step-by-step-g1/)

[哪些情况会发生fullgc](https://blog.csdn.net/qq_35625303/article/details/79374964)

<h4>案例分析篇</h4>

[Memory Analyzer分析内存泄漏实战案例](https://blog.csdn.net/u012415035/article/details/82218322)

[JVM成长之路,记录一次内存溢出导致频繁FGC的问题排查及解决](https://blog.csdn.net/lxhandlbb/article/details/76695607?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=1328679.13208.16161666661208859&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control)

commons.lang低版本包导致的频繁fullgc问题

[一次线上JVM调优实践，FullGC40次/天到10天一次的优化过程](https://blog.csdn.net/cml_blog/article/details/81057966?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control)

[GC配置对性能的帮助（一）](http://www.360doc.com/content/14/0603/04/14935022_383306570.shtml)