# JVM运行时参数



## ReservedCodeCacheSize

参数：-XX:ReservedCodeCacheSize
含义：

    Reserved code cache size (in bytes) - maximum code cache size
    用于设置Code Cache大小，JIT编译的代码都放在Code Cache中，若Code Cache空间不足则JIT无法继续编译，并且会去优化，比如编译执行改为解释执行，由此，性能会降低

默认值：

![img](img/pmt-runtimeVmArgs/20170714113912760)

例：

    -XX:ReservedCodeCacheSize=50331648

等价参数：

    -Xmaxjitcodesize 