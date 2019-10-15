# Tomcat集群

## 简介

​	由于单台Tomcat的承载能力是有限的，当我们的业务系统用户量比较时，单台Tomcat是扛不住的，这个时候，就需要搭建Tomcat集群，而且目前比较流行的做法就是通过Nginx来实现Tomcat集群的负载均衡。

![1571113527140](.\img\1571113527140.png)

## 准备Tomcat

在服务器上，安装两台tomcat，然偶分别修改Tomcat服务器的端口号：

```
旧端口号 ------->tomcat1 ------> tomcat2
8005 ---------> 8015 ---------> 8025
8080 ---------> 8888 ---------> 9999
8009 ---------> 8019 ---------> 8029
```

如果要测试效果，就将两个tomcat的管理首页面的内容改一改就可以看出效果了。

## 安装配置Nginx

在当前服务器上，安装Nginx，然后再配置Nginx，配置nginx.conf：

```nginx
upstream serverpool {
    server localhost:8888;
    server localhost:9999;
}

server {
    listen 99;
    server_name localhost;
    
    # 后端搜索服务
    location / {
        proxy_pass http://serverpool/; # proxy_pass 反向代理
    }
}
```

## 负载均衡策略



### 轮询

​		最基本的配置方法它是 upstream模块默认的负载均默认策略。每个请求会按时间顺序逐一分配到不同的后端服务器。

```nginx
upstream serverpool {
    server localhost:8888;
    server localhost:9999;
}
```

参数说明：

| 参数         | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| fail_timeout | 与max_fails结合使用                                          |
| max_fails    | 设置在fail_timeout参数设置的时间内最大失败次数,如果在这个时间内,所有针对该服务器的请求都失败了,那么认该服务器会被认为是停机了 |
| fail_time    | 服务器会被认为停机的时间长度，默认为10s                      |
| backup       | 标记该服务器为备用服务器。当主服务器停止时，请求会被发送到它这里 |
| down         | 标记服务器永久停机了                                         |



### weight权重

​		权重方式，在轮询策略的基础上制定轮询的几率。

```nginx
upstream serverpool {
    server localhost:8888 weight=3;
    server localhost:9999 weight=1;
}
```

weight参数用于指定轮询几率，weight的默认值为1；weight的数组与访问比率成正比。

此策略比较适合服务器的硬件配置差别比较大的情况。



### ip_hash

​		指定负载均衡器按照基于客户端IP的分配方式,这个方法确保了相同的客户端的请求一直发送到相同的服务器,以保证 session会话。这样每个访客都固定访问一个后端服务器,可以解決 session不能跨服务器的问题。

```nginx
upstream serverpool {
    ip_hash;
    server localhost:8888 weight=3;
    server localhost:9999 weight=1;
}
```



## Session共享方案

​		在Tomcat集群中,如果应用需要用户进行登录,那么这个时候,用于 tomcat做了负载均衡,则用户登录并访问应用系统时,就会出现问题。

![1571115506142](.\img\1571115506142.png)

解决上述问题，有以下几种方案：

### ip_hash 策略

​		一个用户发起的请求,只会请求到 tomcat1上进行操作,另一个用户发起的请求只在 tomcat2上进行操作。那么这个时候,同一个用户发起的请求,都会通过 nginx的 ip_hash策略,将请求转发到其中的一台 Tomcat上。

### session复制

1. 在所有的Tomcat的conf/server.xml配置如下:

   ```xml
   <Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster"/>
   ```

2. 在Tomcat部署的应用程序中添加如下配置：

   ```xml
   <distributable/>
   ```

3. 配置完毕之后，再次启动两个Tomcat服务。看效果：

![1571121004457](.\img\1571121004457.png)

​		上述方案，官网有提示适用于较小的集群环境（节点数不超过4个），如果集群的节点数比较多的话，通过这种广播的形式来完成Session的复制，会消耗大量的网络带宽，影响服务的性能。官网好像还提供了跟复杂的`DeltaManager` 加 `BackupManager`方案，可以查看[官方文档](http://tomcat.apache.org/tomcat-8.5-doc/cluster-howto.html)了解。

### SSO-单点登录

​		单点登录（Single Sign On），简称为SSO，是目前比较流行的企业业务整合的解决方案。SSO的定义是在多个应用系统中，用户只需要登录一次就可以访问所有互相信任的应用系统，也是用来解决集群环境Session共享的方案之一。

![1571121388390](.\img\1571121388390.png)

资料参考：

​		[基于Redis的单点登录](https://blog.csdn.net/qq_22172133/article/details/82291112)

​		[简易版单点登录实现](https://www.jianshu.com/p/644d3c204391)

​		[简单使用REDIS实现SSO单点登录](https://www.cnblogs.com/baiyujing/p/8325154.html)