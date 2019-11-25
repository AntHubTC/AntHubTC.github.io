## Zookeeper安装

## 本地模式安装

### 安装前准备

1. 安装JDK

   ```shell
   # vi ~/.bashrc
   export JRE_HOME=/opt/jre1.8.0_202
   export CLASSPATH=.:${JRE_HOME}/lib
   export PATH=${JRE_HOME}/bin:$PATH
   ```

2. 找到ZooKeeper对应版本的下载地址

    ```shell
    # 下载ZooKeeper安装文件
    wget https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.4.14/zookeeper-3.4.14.tar.gz
    # 解压
    tar -zxvf zookeeper-3.4.14.tar.gz -C /opt
chown root:root zookeeper-3.4.14
    chmod 755 zookeeper-3.4.14
    
    ```

### 配置修改

将zookeeper/conf这个路径下的zoo_sample.cfg修改为zoo.cfg

```shell
mv zoo_sample.cfg zoo.cfg
```

打开zoo.cfg文件，修改dataDir路径：

```shell
vi zoo.cfg
# 修改如下内容：
dataDir=/home/root/zookeeper/zkData
```

在/home/root/zookeeper/这个目录上创建zkData文件夹。

```shell
mkdir zkData
```

### 操作Zookeeper

#### 启动Zookeeper

```shell
# 启动服务端
cd /home/root/zookeeper/bin
./zkServer.sh start
# 启动客户端
./zkCli.sh
# 下面可以看出客户端可以执行的命令
ZooKeeper -server host:port cmd args
        stat path [watch]
        set path data [version]
        ls path [watch]
        delquota [-n|-b] path
        ls2 path [watch]
        setAcl path acl
        setquota -n|-b val path
        history 
        redo cmdno
        printwatches on|off
        delete path [version]
        sync path
        listquota path
        rmr path
        get path [watch]
        create [-s] [-e] path data acl
        addauth scheme auth
        quit 
        getAcl path
        close 
        connect host:port
```

#### 查看进程是否启动

```
jps  或 ps -ef | grep zookeeper
```

#### 查看状态

```shell
./zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /opt/zookeeper-3.4.14/bin/../conf/zoo.cfg
Mode: standalone
```

#### 启动客户端

```
./zkCli.sh
```

#### 退出客户端

```shell
[zk: localhost:2181(CONNECTED) 0] quit
```

#### 停止Zookeper

```
./zkServer.sh stop
```

### 配置参数解读

Zookeeper中的配置文件zoo.cfg中参数含义解读如下：

1. tickTime=2000：通信心跳数，Zookeeper服务器与客户端心跳时间，单位毫秒

   ​		Zookeeper使用的基本时间，服务器之间或客户端与服务器之间维持心跳的时间间隔，也就是每个tickTime时间就会发送一个心跳，单位为毫秒。

   ​		它用于心跳机制，并且设置最小的session超时时间为两倍心跳时间。（session的最小超时时间是2*tickTime）

2. initLimit=10， LF初始通信时限

   ​		集群中Follower跟随者服务器与Leader领导者服务器之间初始连接时能容忍的最多心跳数（tickTime的数量），用它来限定集群中的Zookeeper服务器连接到Leader的时限。

3. syncLimit=5：LF同步通信时限

   ​		集群中Leader与Follower之间的最大响应时间单位，假如响应超过sysncLimit *  tickTime，Leader认为Follower死掉，从服务器列表中删除Follower。

4. dataDir: 数据文件目录+数据持久化路径

   ​		主要用于保存Zookeeper中的数据。

5. clientPort=2181：客户端连接端口

   ​		监听客户端连接的端口。