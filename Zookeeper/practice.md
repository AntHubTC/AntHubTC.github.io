# ZooKeeper实战（开发重点）

## 分布式安装部署

​		为了学习安装简单方便，我将安装教程中配置的ZooKeeper配置做成了Docker镜像。

### 集群规划

​		采用三个节点的Zookeeper集群，分别是zk01、zk02、zk03。

```shell
# 现将zookeeper1制作成一个镜像
docker commit -a "1096648786@qq.com" -m "zookeeper" zookeeper1  tc1096648786/zookeeper
docker kill zookeeper1
docker rm zookeeper1
# --network-alias 仅仅支持自定义网络，所以这里要创建一个网桥
docker network create zk_net
# 准备zookeeper1
docker run -it -d --name zk01 --network zk_net --network-alias zk01 tc1096648786/zookeeper /bin/bash
# 准备zookeeper2
docker run -it -d --name zk02 --network zk_net --network-alias zk02 tc1096648786/zookeeper /bin/bash
# 准备zookeeper3
docker run -it -d --name zk03 --network zk_net --network-alias zk03 tc1096648786/zookeeper /bin/bash
# 查看容器
docker ps
```

```
CONTAINER ID        IMAGE                    COMMAND                  CREATED              STATUS              PORTS                   NAMES
eeb804c30c22        tc1096648786/zookeeper   "/bin/bash"              28 seconds ago       Up 28 seconds                               zookeeper3
8252d1eb4859        tc1096648786/zookeeper   "/bin/bash"              About a minute ago   Up About a minute                           zookeeper2
aad536f361be        ubuntu                   "/bin/bash"              4 days ago           Up 4 days                                   zookeeper1
```

### 配置服务器编号

```shell
# 在Zookeeper主目录下创建zkData
mkdir -p zkData
cd zkData
# 创建一个myid文件
touch myid
# 编辑myid文件，其它机器中分别为2和3
echo '1' > myid
cat myid
# 分别在另外两台机器上做上面的配置
```

### 配置zoo.cfg文件

```shell
vi zoo.cfg
# 修改数据存储路径配置
dataDir=/opt/zookeeper-3.4.14/zkData
# 增加如下配置
#######################cluster#########################
server.1=zk01:2888:3888
server.2=zk02:2888:3888
server.3=zk03:2888:3888
# server.A=B:C:D
# A 是一个数字，表示这个是第几号服务器    集群模式下配置一个文件myid，这个文件在dataDir目录下，这个文件里面有一个数据就是A的值，Zookeeper启动时读取此文件，拿到里面的数据与zoo.cfg里面的配置信息比较从而判断到底是哪个server。
# B 是这个服务器的ip地址
# C 是这个服务器与集群中的Leader服务器交换信息的端口
# D 是万一集群中的Leader服务器挂了，需要一个端口来重新选举，选出一个新的Leader，而这个端口就是用来执行选举时服务器相互通信的端口
```

### 集群操作

```bash
# 将zk01、zk02、zk03启动起来
cd ../bin
./zkServer.sh start
# 查看zk状态   从下图可以看出有2台的模式是follower，另一台是leader。
./zkServer.sh status
```

![1571885389813](.\img\1571885389813.png)

上图中如果你把leader停止了后在查看状态，那么会有新的leader被选举出来。

## 客户端命令行操作

| 命令基本语法     | 功能描述                                                     |
| ---------------- | ------------------------------------------------------------ |
| help             | 显示所有操作命令                                             |
| ls path [watch]  | 使用ls命令查看当前znode中所包含的内容                        |
| ls2 path [watch] | 查看当前节点数据并能看到更新次数等数据                       |
| create           | 普通创建<br />-s  含有序列<br />-e  临时（重启或者超时消失） |
| get path [watch] | 获得节点的值                                                 |
| set              | 设置节点的具体值                                             |
| stat             | 查看节点状态                                                 |
| delete           | 删除节点                                                     |
| rmr              | 递归删除节点                                                 |

1. 启动客户端

   ```shell
   ./zkCli.sh
   ```

2. 显示所有操作命令

   ```shell
   help
   ```

3. 查看当前znode中所包含的内容

   ```shell
   ls /
   ```

4. 查看当前节点详细数据

   ```shell
   ls2 /
   [zookeeper]
   cZxid = 0x0
   ctime = Thu Jan 01 00:00:00 GMT 1970
   mZxid = 0x0
   mtime = Thu Jan 01 00:00:00 GMT 1970
   pZxid = 0x0
   cversion = -1
   dataVersion = 0
   aclVersion = 0
   ephemeralOwner = 0x0
   dataLength = 0
   numChildren = 1
   ```

5. 分别创建2个普通节点

   ```shell
   create /sanguo "jinlian"  # 创建节点，必须写数据，否则看不见内容
   ls /  # 在一个节点上创建，所有zk服务器上都能看见了
   create /sanguo/shuguo "lubei" # 多级目录
   ls /sanguo
   ```

6. 获得节点的值

   ```shell
   get /sanguo # 返回 jinlian
   get /sanguo/shuguo # 返回 liubei
   # liubei
   # cZxid = 0x200000005
   # ctime = Thu Oct 24 03:17:13 GMT 2019
   # mZxid = 0x200000005
   # mtime = Thu Oct 24 03:17:13 GMT 2019
   # pZxid = 0x200000005
   # cversion = 0
   # dataVersion = 0
   # aclVersion = 0
   # ephemeralOwner = 0x0
   # dataLength = 6
   # numChildren = 0
   ```

7. 创建短暂节点

   ```shell
   create -e /sanguo/wuguo "zouyu" # 创建短暂节点
   ls /sanguo
   # 将当前节点退出quit再启动就不会再由这个节点了
   quit
   ./zkCli.sh
   ls /sanguo  # 没有了短暂节点
   ```

8. 创建带序号的节点

   ```
   # 先创建一个普通的根节点
   create /sanguo/weiguo "caocao"
   # 创建带序号的节点 -s
   create -s /sanguo/weiguo/xiaoqiao "jinlian"
   create -s /sanguo/weiguo/daqiao "jinlian"
   create -s /sanguo/weiguo/diaocan "jinlian"
   ```

   ​		如果原来没有序号节点，序号从0开始依次递增。如果原节点下已有2个接待呢，则在排序时从2开始，以此类推。

9. 修改节点数据值

   ```shell
   set /sanguo/weiguo "simayi"
   get /sanguo/weiguo # 查看最新的值
   ```

10. 节点的值变化监听

    ```shell
    # 我们在zk02上监听，在zk01上修改。
    # zk02
    get /sanguo watch
    # zk01
    set /sanguo "jingjing"
    # zk02 显示监听到的变化
    # WATCHER::
    # 
    # WatchedEvent state:SyncConnected type:NodeDataChanged path:/sanguo
    # zk01
    set /sanguo "banzhang"
    # zk02
    # 没有任何变化  (由于Zookeeper注册一次监听只能监听一次变化, 要监听需重新注册)
    ```

11. 节点的子节点彼岸花监听（路径变化）

    ```shell
    # zk02
    ls /sanguo/weiguo watch
    # zk01
    create -s /sanguo/weiguo/banzhang "bz"
    # zk 02
    # WATCHER::
    # 
    # WatchedEvent state:SyncConnected type:NodeChildrenChanged path:/sanguo/weiguo
    # zk01
    create -s /sanguo/weiguo/banzhang "bz"
    # zk 02
    # 没有任何变化  (由于Zookeeper注册一次监听只能监听一次变化, 要监听需重新注册)
    ```

12. 删除节点

    ```shell
    #zk01
    delete /sanguo/weiguo/banzhang0000000008
    # delete 不能删除不为空的节点
    ```

13. 递归删除节点

    ```shell
    rmr /sanguo
    ```

14. 查看节点状态

    ```shell
    # 查看节点的状态
    stat /sanguo
    # cZxid = 0x200000004
    # ctime = Thu Oct 24 03:16:23 GMT 2019
    # mZxid = 0x200000012
    # mtime = Thu Oct 24 03:44:05 GMT 2019
    # pZxid = 0x20000000a
    # cversion = 4
    # dataVersion = 1
    # aclVersion = 0
    # ephemeralOwner = 0x0
    # dataLength = 8
    # numChildren = 2
    ```

## 代码API应用



