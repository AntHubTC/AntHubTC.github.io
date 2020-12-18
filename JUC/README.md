# JUC并发编程

## 多线程进阶=》JUC并发编程

### 什么是JUC

![image-20201123092030487](img/README/image-20201123092030487.png)

### 进程和线程

> 线程、进程，如果不能使用一句话说出来的技术，不扎实！

进程：一个程序，QQ.exe，网易云音乐.exe，程序是指令的集合；

一个进程往往可以包含多个线程，至少包含一个主线程。

java默认有几个线程？2个  main，GC

对于java而言：Thread、Runnable、Callable。

java真的可以自己开启线程吗？直接开不了，它是去调用start0的native方法，由虚拟机底层去和操作系统交互开启。

### 线程的状态

```java
public enum State {
    // 新生
    NEW,
	// 可运行
    RUNNABLE,
	// 阻塞
    BLOCKED,
	// 等待
    WAITING,
    // 超时等待
    TIMED_WAITING,
	// 停止
    TERMINATED;
}
```

### wait和sleep区别

1. 来自不同的类； wait => Object; sleep => Thread;
2. 关于锁的释放：wait会释放锁，sleep不会释放锁。
3. 使用范围不同：wait必须在同步代码块中，sleep可以在任何地方睡眠。

### Lock锁

