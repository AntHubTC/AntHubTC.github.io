# Parallel回收器：吞吐量优先

## 概述

- Hotspot的年轻代中除了拥有 ParNew收集器是基于并行回收的以外,Parallel Scavenge收集器同样也釆用了复制算法、并行回收和"stop the World“机制。
- 那么Parallel收集器的出现是否多此一举?
  - 和 ParNew收集器不同,Parallel Scavenge收集器的目标则是达到个可控制的吞吐量( Throughput),它也被称为吞吐量优先的垃圾收集器。
  - 自适应调节策略也是Parallel Scavenge与 ParNew一个重要区别。

