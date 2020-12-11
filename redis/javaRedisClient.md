# Redis常见客户端框架比较

## Jedis,Redisson,Lettuce

Jedis api 在线网址：http://tool.oschina.net/uploads/apidocs/redis/clients/jedis/Jedis.html
redisson 官网地址：https://redisson.org/
redisson git项目地址：https://github.com/redisson/redisson
lettuce 官网地址：https://lettuce.io/
lettuce git项目地址：https://github.com/lettuce-io/lettuce-core

### 概念：

　　Jedis：是Redis的Java实现客户端，提供了比较全面的Redis命令的支持，
　　Redisson：实现了分布式和可扩展的Java数据结构。
　　*Lettuce：高级Redis客户端，用于线程安全同步，异步和响应使用，支持集群，Sentinel，管道和编码器。*

### 优点：

　　*Jedis：比较全面的提供了Redis的操作特性*
　　*Redisson：促使使用者对Redis的关注分离，提供很多分布式相关操作服务，例如，分布式锁，分布式集合，可通过Redis支持延迟队列*
　　*Lettuce：主要在一些分布式缓存框架上使用比较多*

### 可伸缩：

Jedis：使用阻塞的I/O，且其方法调用都是同步的，程序流需要等到sockets处理完I/O才能执行，不支持异步。Jedis客户端实例不是线程安全的，所以需要通过连接池来使用Jedis。

Redisson：基于Netty框架的事件驱动的通信层，其方法调用是异步的。Redisson的API是线程安全的，所以可以操作单个Redisson连接来完成各种操作

*Lettuce：基于Netty框架的事件驱动的通信层，其方法调用是异步的。Lettuce的API是线程安全的，所以可以操作单个Lettuce连接来完成各种操作*

### 结论：

*建议使用：Jedis + Redisson*