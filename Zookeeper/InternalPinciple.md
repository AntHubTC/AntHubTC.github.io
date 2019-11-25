# Zookeeper内部原理

## 选举机制（面试重点）

1. 半数机制：集群中**半数以上**机器存活，集群可用。所以Zookeeper适合安装**奇数**台服务器。

   例如：

   ​		2台机器，2台存活，集群可用

   ​		**2台机器，1台存活，集群不可用**

   ​		3台机器，2，3台存活，集群可用

   ​		**3台机器，1台存活，集群不可用**

   ​		4台机器，3-4台存活，集群可用

   ​		**4台机器，2台存活，机器不可用**

   ​		5台机器，3-5台存活，集群可用

   ​		**5台机器，2台存活，机器不可用**

2. Zookeeper虽然在配置文件中并没有指定**Master和Slave**。但是，Zookeeper工作时，是有一个节点为Leader，其它则为Follower，Leader是通过内部的**选举机制**临时产生的。具体选举原理参照：

   [深入浅出Zookeeper（一） Zookeeper架构及FastLeaderElection机制](http://www.jasongj.com/zookeeper/fastleaderelection/)

   [深入浅出Zookeeper（二） 基于Zookeeper的分布式锁与领导选举](http://www.jasongj.com/zookeeper/distributedlock/)



## 节点类型

持久 （Persistent）：客户端和服务器端断开连接后，创建的节点不删除。

短暂（Ephemeral）：客户端和服务器端断开连接后，创建的节点自己删除。

(1) 持久化目录节点

​	客户端与Zookeeper断开连接后，该节点依旧存在。

(2) 持久化顺序编号目录节点

​	客户端与Zookeeper断开连接后，该节点依旧存在，只是ZooKeeper给该接待呢名称进行顺序编号。

(3) 临时目录节点

​	客户端与Zookeeper断开连接后，该节点被删除。

(4) 临时顺序编号目录节点

​	客户端与Zookeeper断开连接后，该节点被删除，只是Zookeeper给该节点名称进行顺序编号。



**说明**：创建ZNod时设置顺序标识，ZNode名称后会附加一个值，顺序号是一个单调递增的计数器，由父节点维护。

**注意**：在分布式系统中，顺序号可以被用于为所有的事件进行全局排序，这样客户端可以通过顺序号推断事件的顺序。



## Stat结构体

1. czxid - 建节点的事务zxid

   ​		每次修改ZooKeeper状态都会收到一个zxid形式的时间戳，也就是ZooKeeper事务ID。

   ​		事务ID是ZooKeeper中所有修改的次序。每个修改都有唯一的zxid，如果zxid1小于zxid2，那么zxid1在zxid2之前发生。

2. ctime - znode被创建的 毫秒数(从1970年开始)。

3. mzxid - znode最后更新的事务zxid。

4. mtime - znode最后修改的毫秒数(从1970年开始)

5. pZxid - znode最后更新的子节点zxid

6. cversion - znode子节点变化号，znode子节点修改次数。

7. dataversion - znode数据变化号

8. aclVersion - znode访问控制列表的变化号

9. ephemeralOwner - 如果是临时节点，这个是znode拥有着的session id。如果不是临时节点则是0。

10. **dataLength**  - znode的数据长度。

11. **numChildren** - znode子节点数量。

## 监听器原理（面试重点）

1. 监听原理详解：

   1. 首先要有一个main()线程
   2. 在main线程中创建Zookeeper客户端，这时就会创建两个线程，一个负责网络连接通信（connect），一个负责监听（listener）。
   3. 通过connect线程将注册的监听事件发送给Zookeeper。
   4. 在Zookeeper的注册监听器列表中将注册的监听事件添加到列表中。
   5. Zookeeper监听到有数据或者路径变化，就会将这个消息发送给listener线程。
   6. listener线程内容调用了process()方法。

2. 常见的监听

   1. 监听节点数据的变化

      get path [watch]

   2. 监听子节点增减的变化

      ls path [path]

![监听器原理](.\img\1571899104128.png)

## 写数据流程

![1571899641747](.\img\1571899641747.png)

