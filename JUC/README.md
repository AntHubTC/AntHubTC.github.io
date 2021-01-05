# JUC并发编程

## 多线程进阶=》JUC并发编程

### 什么是JUC

![image-20201123092030487](img/README/image-20201123092030487.png)

java.util工具包、包、分类。

业务：普通的线程代码Thread

Runnable： 没有返回值、效率相比Callable相对较低。

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

```
        Thread.sleep(1000);
        // 下面两个本质上都是执行的sleep
        TimeUnit.SECONDS.sleep(1); 
        TimeUnit.MINUTES.sleep(1);
```

## 并发和并行

并发： 多个线程操作同一个资源。

- cpu一核，模拟出多条线程。

并行：多个人一起走。

- cpu多核，多个线程可以同时进行。

```java
public class Test1 {
    public static void main(String[] args) {
        // 获取CPU的核数
        // CPU 密集型   IO密集型       System.out.println(Runtime.getRuntime().availableProcessors());
    }
}
```

并发编程的本质：充分利用CPU的资源。

## synchronized

## Lock锁

![image-20210104161242660](img/README/image-20210104161242660.png)

![image-20210104161312861](img/README/image-20210104161312861.png)

ReentrantLock部分源码：

```java
public class ReentrantLock implements Lock, java.io.Serializable {
	// .......
	public ReentrantLock() {
        sync = new NonfairSync();// 非公平锁
    }
    public ReentrantLock(boolean fair) {
        // 如果传入true，则是公平锁，否则是非公平锁
        sync = fair ? new FairSync() : new NonfairSync();
    }
    // .......
}
```

公平锁：十分公平：先来后到。

非公平锁：十分不公平，可以插队。



### Synchronized和Lock区别

1. synchronized是内置的java关键字，Lock是java类。
2. synchronized无法判断获取锁的状态，Lock可以判断是否获取到了锁。
3. synchronized会自动释放锁，Lock需要手动释放锁，如果不释放，会产生死锁。
4. synchronized线程1（获得锁，阻塞），线程2（等待，傻傻的等）；Lock就不一定等待下去。  lock.tryLock();
5. synchronized可重入锁，不可以中断，非公平；Lock锁，可重入锁，可以判断锁，非公平锁（可设置）。
6. synchronized适合锁少量代码同步问题，Lock锁适合大量的同步代码。



## 生产者和消费者问题

```java
package ceg1;

// synchronized版生产者消费者问题
public class Test5 {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.incr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();
    }
}

class Data {
    private int number = 0;

    public synchronized void incr() throws InterruptedException {
        if (number != 0) {
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"=>" + number);
        // 通知其它线程，我+1完毕了
        this.notifyAll();
    }

    public synchronized void decr() throws InterruptedException {
        if (number == 0) {
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"=>" + number);
        // 通知其它线程，我-1完毕了
        this.notifyAll();
    }
}
```

> 问题存在：如果两个线程没有问题，但是如果存在A B C D四个线程！怎么解决这个问题？

jdk中文API文档chm中，Object的wait方法有相关说明：

​		线程也可以唤醒，而不会被通知，终端或超时，即所谓的虚假唤醒，虽然这在实践中很少发生，但应用程序必须通过测试应该使线程被唤醒的条件来防范，并且如果条件不满足则继续等待。换句话说，等待应该总是出现在循环中，就像这样：

```java
synchronized (obj) {
	while (<condition does not hold>) {
        obj.wait(timeout);
        // Perform acton appropriate to condition
    }
}
```



修改后的代码:

```java
package ceg1;

// synchronized版生产者消费者问题
public class Test5 {
    public static void main(String[] args) {
        Data data = new Data();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.incr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.incr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "C").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "D").start();
    }
}

class Data {
    private int number = 0;

    public synchronized void incr() throws InterruptedException {
        while (number != 0) {
            this.wait();
        }
        number++;
        System.out.println(Thread.currentThread().getName()+"=>" + number);
        // 通知其它线程，我+1完毕了
        this.notifyAll();
    }

    public synchronized void decr() throws InterruptedException {
        while (number == 0) {
            this.wait();
        }
        number--;
        System.out.println(Thread.currentThread().getName()+"=>" + number);
        // 通知其它线程，我-1完毕了
        this.notifyAll();
    }
}
```



**JUC版生产者消费者问题：**

例如，假设我们有一个有限的缓冲区，它支持`put`和`take`方法。 如果在一个空的缓冲区尝试一个`take` ，则线程将阻塞直到一个项目可用; 如果`put`试图在一个完整的缓冲区，那么线程将阻塞，直到空间变得可用。 我们希望在单独的等待集中等待`put`线程和`take`线程，以便我们可以在缓冲区中的项目或空间可用的时候使用仅通知单个线程的优化。 这可以使用两个Condition实例来实现。

![image-20210105092526763](img/README/image-20210105092526763.png)



```java
package ceg1;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * JUC版生产者和消费者
 */
public class Test6 {
    public static void main(String[] args) {
        Data2 data = new Data2();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.incr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "A").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "B").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.incr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "C").start();
        new Thread(()-> {
            for (int i = 0; i < 10; i++) {
                try {
                    data.decr();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "D").start();
    }
}

class Data2 {
    private int number = 0;

    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();

    // condition.await(); 等待
    // condition.signalAll(); 唤醒

    public void incr() throws InterruptedException {
        lock.lock();
        try {
            while (number != 0) {
                condition.await();
            }
            number++;
            System.out.println(Thread.currentThread().getName()+"=>" + number);
            // 通知其它线程，我+1完毕了
            condition.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void decr() throws InterruptedException {
        lock.lock();
        try {
            while (number == 0) {
                condition.await();
            }
            number--;
            System.out.println(Thread.currentThread().getName()+"=>" + number);
            // 通知其它线程，我-1完毕了
            condition.signalAll();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

任何一个新的技术，绝对不是仅仅只是覆盖了原来的技术，优势和补充！

> Condition精准的通知和唤醒线程。

![image-20210105105238814](img/README/image-20210105105238814.png)

实现ABCD顺序执行：

```java
package ceg1;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * A执行完，执行B，B执行完执行C
 */
public class Test7 {
    public static void main(String[] args) {
        Data3 data = new Data3();

        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data.printA();
            }
        }, "A").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data.printB();
            }
        }, "B").start();
        new Thread(()->{
            for (int i = 0; i < 10; i++) {
                data.printC();
            }
        }, "C").start();
    }
}

class Data3 {
    private Lock lock = new ReentrantLock();

    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();
    private Condition condition3 = lock.newCondition();

    private int number = 1; // 1-A  2-B 3-C   A-》B-》C-》A....

    public void printA() {
        lock.lock();
        try {
            // 业务，判断-》执行-》通知
            while (number != 1) {
                condition1.await();
            }
            System.out.println(Thread.currentThread().getName()+"=>AAAAAA");
            // 唤醒，唤醒指定的人
            number = 2;
            condition2.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void printB() {
        lock.lock();
        try {
            // 业务，判断-》执行-》通知
            while (number != 2) {
                condition2.await();
            }
            System.out.println(Thread.currentThread().getName()+"=>BBBBB");
            // 唤醒，唤醒指定的人
            number = 3;
            condition3.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public void printC() {
        lock.lock();
        try {
            // 业务，判断-》执行-》通知
            while (number != 3) {
                condition3.await();
            }
            System.out.println(Thread.currentThread().getName()+"=>CCCCC");
            // 唤醒，唤醒指定的人
            number = 1;
            condition1.signal();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}
```

## 8锁现象

如何判断锁的是谁！永远的知道什么是锁，锁到底锁的是谁！

对象、Class。

```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 1、标准情况下，都不延时，两个线程先打印  发短信 还是 打电话？  先发短信后发打电话。
 * 2、sendSms延迟2秒，两个线程先打印  发短信 还是 打电话？  先发短信后发打电话。
 */
public class Test1 {
    public static void main(String[] args) {
        Phone phone = new Phone();

        new Thread(()->{
            phone.sendSms();
        }, "A").start();

//        try {
//            TimeUnit.SECONDS.sleep(2);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

        new Thread(()->{
            phone.call();
        }, "B").start();
    }
}

class Phone {
    // synchronized 锁的对象是该方法的调用者。
    // 两个方法用的是同一个锁，谁先拿到谁先执行。
    public synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }
}
```



```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 3、增加类一个普通方法！先执行发短信还是hello？
 */
public class Test2 {
    public static void main(String[] args) {
        Phone2 phone = new Phone2();

        new Thread(()->{
            phone.sendSms();
        }, "A").start();


        new Thread(()->{
            phone.hello();
        }, "B").start();
    }
}

class Phone2 {
    // synchronized 锁的对象是该方法的调用者。
    // 两个方法用的是同一个锁，谁先拿到谁先执行。
    public synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }

    // 这里没有锁，不是同步方法，不受锁的影响。
    public void hello() {
        System.out.println("hello");
    }
}
```

```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 4、两个对象，两个同步方法，发短信还是但电话？ 锁的手对象，所以两个对象各有一把锁，互不影响。
 */
public class Test3 {
    public static void main(String[] args) {
        Phone3 phone1 = new Phone3();
        Phone3 phone2 = new Phone3();

        new Thread(()->{
            phone1.sendSms();
        }, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(()->{
            phone2.call();
        }, "B").start();
    }
}

class Phone3 {
    // synchronized 锁的对象是该方法的调用者。
    // 两个方法用的是同一个锁，谁先拿到谁先执行。
    public synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }

    // 这里没有锁，不是同步方法，不受锁的影响。
    public void hello() {
        System.out.println("hello");
    }
}
```



```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 5、增加两个静态方法  发短信还是打电话     静态同步方法锁的是类对象
 */
public class Test4 {
    public static void main(String[] args) {
        Phone4 phone = new Phone4();

        new Thread(()->{
            phone.sendSms();
        }, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(()->{
            phone.call();
        }, "B").start();
    }
}

class Phone4 {
    public static synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public static synchronized void call() {
        System.out.println("打电话");
    }
}
```



```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 6、两个对象！增加两个静态的同步方法，先打印发短信还是打电话？
 */
public class Test5 {
    public static void main(String[] args) {
        Phone5 phone1 = new Phone5();
        Phone5 phone2 = new Phone5();

        new Thread(()->{
            phone1.sendSms();
        }, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(()->{
            phone2.call();
        }, "B").start();
        // 先短信 后 电话
    }
}

class Phone5 {
    public static synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public static synchronized void call() {
        System.out.println("打电话");
    }
}
```



```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 7、1个静态的同步方法，1一个普通的同步方法，一个对象，先打印 发短信还是打电话？
 */
public class Test6 {
    public static void main(String[] args) {
        Phone6 phone1 = new Phone6();

        new Thread(()->{
            phone1.sendSms();
        }, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(()->{
            phone1.call();
        }, "B").start();
        // 先短信 后 电话
    }
}

class Phone6 {
    public static synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }
}
```



```java
package ceg2;

import java.util.concurrent.TimeUnit;

/**
 * 8锁现象
 * 7、1个静态的同步方法，1一个普通的同步方法，一个对象，先打印 发短信还是打电话？
 */
public class Test7 {
    public static void main(String[] args) {
        Phone7 phone1 = new Phone7();
        Phone7 phone2 = new Phone7();

        new Thread(()->{
            phone1.sendSms();
        }, "A").start();

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new Thread(()->{
            phone2.call();
        }, "B").start();
        // 先短信 后 电话
    }
}

class Phone7 {
    public static synchronized void sendSms () {
        try {
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("发短信");
    }

    public synchronized void call() {
        System.out.println("打电话");
    }
}
```

小结：

new 锁的是this  具体的实例。

static 锁的是Class   唯一的类对象。

## 集合类不安全

> list线程安全

```java
package ceg3;

import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class ListTest {
    public static void main(String[] args) {
//        List<Integer> list = Arrays.asList(1, 2, 3, 4);
//        list.forEach(System.out::println);

        List<String> list = new ArrayList<>(); // ArrayList线程非安全
        /**
         * 解决方案：
         * 1、 List<String> list = new Vector<>();
         * 2、 List<String> list = Collections.synchronizedList(new ArrayList<>());
         * 3、 JUC List<String> list = new CopyOnWriteArrayList<>();
         */
        /**
         * CopyOnWriteArrayList
         * CopyOnWrite 写入时复制  COW  计算机程序设计领域的一种优化策略；
         * 多个线程调用的时候，list，读取的时候，固定的，写入（覆盖）
         * 在写入的时候避免覆盖，造成数据问题。
         * 读写分离
         *
         * CopyOnWriteArrayList  比Vector   NB在哪里？
         * 1、vector使用synchronized方式效率要低一点，CopyOnWriteArrayList使用lock锁
         * 2、写入时复制
         */

        for (int i = 1; i < 100; i++) {
            new Thread(()-> {
                list.add(UUID.randomUUID().toString().substring(0, 5));
                /*
                     使用ArrayList报错：  Exception in thread "93" java.util.ConcurrentModificationException
                 */
                System.out.println(list);
            }, String.valueOf(i)).start();
        }
    }
}
```

> set线程不安全

```java
package ceg3;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArraySet;

public class SetTest {
    public static void main(String[] args) {
        // Exception in thread "Thread-9" java.util.ConcurrentModificationException
//        Set<String> set = new HashSet<>();
//        Set<String> set = Collections.synchronizedSet(new HashSet<>());
        Set<String> set = new CopyOnWriteArraySet<>();

        for (int i = 1; i < 30; i++) {
            new Thread(()-> {
                set.add(UUID.randomUUID().toString().substring(0,6));
                System.out.println(set);
            }).start();
        }
    }
}
```

HashSet底层是什么？

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{

    //......
	private static final Object PRESENT = new Object();// 一个不变的对象
    public HashSet() {
        map = new HashMap<>();
    }
    //......
    // add set 本质就是map  key是无法重复的。
    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
    //......
}
```

> map不安全

```java
package ceg3;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class MapTest {
    public static void main(String[] args) {
        // map 是这样用的吗？默认等价于什么？
//        Map<String, String> map = new HashMap<>();
        // 回答： 如果使用无参构造，默认参数是：加载因子 0.75、初始化容量 16

        /*
             解决线程安全问题:
             1. Map<String, String> map = Collections.synchronizedMap(new HashMap<>());
             2. Map<String, String> map2 = new ConcurrentHashMap<>();
         */
        Map<String, String> map = new ConcurrentHashMap<>();

        for (int i = 1; i < 30; i++) {
            new Thread(()-> {
                map.put(Thread.currentThread().getName(),
                        UUID.randomUUID().toString().substring(0, 6));
                System.out.println(map);
            }, String.valueOf(i)).start();
        }

    }
}
```



## Callable

​		返回结果并可能引发异常的任务。 实现者定义一个没有参数的单一方法，称为call 。

​		Callable接口类似于Runnable ，因为它们都是为其实例可能由另一个线程执行的类设计的。 然而，A **Runnable不返回结果，也不能抛出被检查的异常**。

该Executors类包含的实用方法，从其他普通形式转换为Callable类。

1. 可以有返回值
2. 可以抛出异常
3. 方法不同，run()/call()

代码测试：

```java
package ceg4;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
//        Executors.callable(new Runnable() {
//            @Override
//            public void run() {
//                System.out.println("print");
//            }
//        });
//        new Thread(new Runnable()).start();
//        new Thread(new FutureTask<V>()).start();
//        new Thread(new FutureTask<V>( callable )).start();

        // 怎么启动callable
        MyThread thread = new MyThread();
        FutureTask futureTask = new FutureTask(thread);

        new Thread(futureTask, "A").start();
        new Thread(futureTask, "B").start();
        // call() 这个最后只打印了一次，结果被缓存  效率高

        // 这个get方法可能会产生阻塞！把他放到最后，或者使用异步通信来处理。
        Object o = futureTask.get();

        System.out.println("线程执行结果：" + o);
    }
}

class MyThread implements Callable<Integer> {

    @Override
    public Integer call() throws Exception {
        System.out.println("call()");

        return 1024;
    }
}
```

细节：

1. 有缓存
2. 结果可能需要等待，会阻塞！



## 常用辅助类

### CountDownLatch 

减法计数器

![image-20210105191021426](img/README/image-20210105191021426.png)

```java
package ceg4;

import java.util.concurrent.CountDownLatch;

// 计数器
public class CountDownLatchDemo {
    public static void main(String[] args) {
        final int TOTAL_NUM = 6;
        CountDownLatch countDownLatch = new CountDownLatch(TOTAL_NUM);

        for (int i = 1; i <= TOTAL_NUM; i++) {
            new Thread(()-> {
                System.out.println(Thread.currentThread().getName() + " Go out");
                countDownLatch.countDown(); // 数量-1
            }, String.valueOf(i)).start();
        }

        try {
            // 等待计数器归零，然后再往下执行
            countDownLatch.await();
            
            System.out.println("Close Door!");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

原理：

countDownLatch.countDown(); // 数量-1

countDownLatch.await(); // 等待计数器归零，然后再往下执行

每次有线程调用countDown()数量-1，如果计数器变成0,那么await就会被重新唤醒。

### CyclicBarrier

加法计数器

![image-20210105191109998](img/README/image-20210105191109998.png)

```java
package ceg4;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierTest {
    public static void main(String[] args) {
        /**
         * 集齐7颗龙珠召唤神龙
         */
        // 召唤龙珠的线程
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7, () -> {
            System.out.println("召唤神龙成功!");
        });

        for (int i = 1; i <= 7; i++) {
            final int temp = i;
            new Thread(()->{ // lambda能操作到i吗？
                System.out.println(Thread.currentThread().getName()+ "收集" + temp + "个龙珠");
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

### Semaphore

Semaphore:信号量

![image-20210105201934860](img/README/image-20210105201934860.png)

eg: 抢车位！   6车-------3个停车位置  一次只能进去3个，只有等车走了其他车才能进去。

```java
package ceg4;

import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

public class SemaphoreTest {
    public static void main(String[] args) {
        // 线程数量，停车位！   这个在限流里面使用比较多
        Semaphore semaphore = new Semaphore(3);

        for (int i = 1; i <= 6; i++) {
            new Thread(()-> {
//                semaphore.acquire(); 获得信号量
//                semaphore.release(); 释放信号量
                try {
                    semaphore.acquire();
                    System.out.println(Thread.currentThread().getName() + "抢到了车位");
                    // 车停了一段时间
                    TimeUnit.SECONDS.sleep((long) (Math.floor(Math.random()*5) + 2));
                    System.out.println(Thread.currentThread().getName() + "离开了车位");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release();
                }
            }, String.valueOf(i)).start();
        }
    }
}
```

某次运行结果：

```
1抢到了车位
2抢到了车位
3抢到了车位
3离开了车位
4抢到了车位
1离开了车位
5抢到了车位
2离开了车位
6抢到了车位
4离开了车位
5离开了车位
6离开了车位
```

**原理：**

semaphore.acuquire()  获得，假设如果已经满了，等待，等待释放为止！

semaphore.release() 释放，会将当前的信号量释放+1，然后唤醒等待的线程！

作用：多个共享资源互斥的使用！并发限流，控制最大的线程数！

## 读写锁

ReadWriteLock

![image-20210105203610380](img/README/image-20210105203610380.png)

