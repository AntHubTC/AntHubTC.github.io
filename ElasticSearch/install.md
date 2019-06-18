# 基础环境搭建篇

## 安装JAVA 8

​	Elastic 需要 Java 8 环境。如果你的机器还没安装 Java，注意要保证环境变量`JAVA_HOME`正确设置。

.bashrc中配置JAVA的配置信息：

```shell
# 用户自定义
export JAVA_HOME=/opt/jre1.8.0_171
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

退出，让配置生效，运行：

```shell
source .bashrc
```



## 安装ElasticSearch

​	安装完 Java，就可以跟着[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/zip-targz.html)安装 Elastic。

将ELK这三个软件的安装包拷贝到/opt目录下，使用“tar -zxvf 包名”进行解压。
下面是/opt目录下的情况：

```
drwxr-xr-x. 6     10     143       211 3月  29 2018 jre1.8.0_171
-rwxr-x---. 1 root   root    346794062 6月  13 20:49 elasticsearch-7.1.1-linux-x86_64.tar.gz
-rwxr-x---. 1 root   root    167785446 6月  13 20:50 kibana-7.1.1-linux-x86_64.tar.gz
-rwxr-x---. 1 root   root    171222976 6月  13 20:50 logstash-7.1.1.tar.gz
```

说明：启动elasticsearch，由于Elasticsearch可以接收脚本到服务器上运行，该软件出于安全性考虑，不允许该程序在root用户下运行，这个时候需要为该程序创建独立的用户和用户组。

```
[root@localhost bin]# ./elasticsearch
[2019-06-14T09:47:16,102][WARN ][o.e.b.ElasticsearchUncaughtExceptionHandler] [localhost.localdomain] uncaught exception in thread [main]
org.elasticsearch.bootstrap.StartupException: java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:163) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:150) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:86) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:124) ~[elasticsearch-cli-7.1.1.jar:7.1.1]
        at org.elasticsearch.cli.Command.main(Command.java:90) ~[elasticsearch-cli-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:115) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:92) ~[elasticsearch-7.1.1.jar:7.1.1]
Caused by: java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Bootstrap.initializeNatives(Bootstrap.java:102) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Bootstrap.setup(Bootstrap.java:169) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Bootstrap.init(Bootstrap.java:325) ~[elasticsearch-7.1.1.jar:7.1.1]
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:159) ~[elasticsearch-7.1.1.jar:7.1.1]
        ... 6 more
[root@localhost bin]# groupadd esgroup
[root@localhost bin]# useradd esuser -g esgroup -p 123456
[root@localhost bin]# cd ../../
[root@localhost opt]# chown -R esuser:esgroup elasticsearch-7.1.1
```

启动elasticsearch

```shell
[root@localhost ~]# su esuser
[esuser@localhost root]$ cd /opt/elasticsearch-7.1.1/bin/
[esuser@localhost bin]$ nohup ./elasticsearch >>start.log 2>&1 &
```

测试下是否启动成功：

```shell
[esuser@localhost bin]$ curl http://127.0.0.1:9200
{
  "name" : "localhost.localdomain",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "XQxhY4YUQsWGfn6Ei-YTjQ",
  "version" : {
    "number" : "7.1.1",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "7a013de",
    "build_date" : "2019-05-23T14:04:00.380842Z",
    "build_snapshot" : false,
    "lucene_version" : "8.0.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 实现远程访问

```shell
[root@localhost elasticsearch-7.1.1]# cd config/
[root@localhost config]# vi elasticsearch.yml

node.name: node-1 前面的#打开
# ---------------------------------- Network -----------------------------------
#
# Set the bind address to a specific IP (IPv4 or IPv6):
#
# network.host: 127.0.0.1 这个只能本机访问
network.host: 0.0.0.0

cluster.initial_master_nodes: ["node-1"] 这里一定要这样设置，我就是这里没有这样设置出问题的，弄了好久

# 在最后加上这两句，要不然，外面浏览器就访问不了哈
http.cors.enabled: true
http.cors.allow-origin: "*"

:wq
```

## 可能会遇到的问题

**问题**： max file descriptors [4096] for elasticsearch process is too low, increase to at least [65536]

解决：

```
>su root
>vi /etc/security/limits.conf
* soft nofile 65536
* hard nofile 131072
* soft nproc 2048
* hard nproc 4096

:wq
```



**问题**：  max virtual memory areas vm.max_map_count_count [65530] is too low, increase to at least [655360]

  解决： 

```shell
>su root
>vi /etc/sysctl.conf
vm.max_map_count=655360

:wq
>sysctl -p   #使生效
```

**问题**：所有配置都正确，机器内能够访问curl http://192.168.56.21:9200/，但是外网还是不能够访问， 大概是防火墙没有关闭。

   解决：关闭防火墙：

```shell
systemctl stop firewalld.service
```



经过上诉问题的解决后，如果没有问题了就可以使用浏览器访问： http://192.168.56.21:9200/

![1560496179108](./img/1560496179108.png)