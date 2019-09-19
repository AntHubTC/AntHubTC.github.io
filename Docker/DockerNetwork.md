## Docker容器的网络连接

**查看网络设备**

ifconfig  # linux命令

​	在返回中能看到一个docker0网络设备，docker守护进程就是通过docker0为docker的容器提供网络连接的各种服务。

### Docker0设备是什么

- Linux的虚拟网桥
  - 可以设置IP地址
  - 相当于拥有一个隐藏的虚拟网卡

docker0的地址划分：

- IP：172.17.42.1    子网掩码： 255.255.255.0.0
- MAC:02:42:ac:11:00:00到02:42:ac:11:ff:ff
- 总共提供了65534个地址

![1568363687560](.\img\1568363687560.png)

```bash
安装网桥管理程序
yum -y install bridge-utils 或  apt -y install bridge-utils
tangcheng@ubuntu:~$ brctl
Usage: brctl [commands]
commands:
        addbr           <bridge>                add bridge
        delbr           <bridge>                delete bridge
        addif           <bridge> <device>       add interface to bridge
        delif           <bridge> <device>       delete interface from bridge
        hairpin         <bridge> <port> {on|off}        turn hairpin on/off
        setageing       <bridge> <time>         set ageing time
        setbridgeprio   <bridge> <prio>         set bridge priority
        setfd           <bridge> <time>         set bridge forward delay
        sethello        <bridge> <time>         set hello time
        setmaxage       <bridge> <time>         set max message age
        setpathcost     <bridge> <port> <cost>  set path cost
        setportprio     <bridge> <port> <prio>  set port priority
        show            [ <bridge> ]            show a list of bridges
        showmacs        <bridge>                show a list of mac addrs
        showstp         <bridge>                show bridge stp info
        stp             <bridge> {on|off}       turn stp on/off
    查看网桥设备
        # brctl show   # 其中docker0是docker默认的网桥
        ifconfig和docker network ls和ip addr show 都能看见docker0网桥的踪影
        
    自定义Docker0
    修改docker0地址
    $ sudo ifconfig docker0 192.168.200.1 netmask 255.255.255.0

自定义虚拟网桥

    添加虚拟网桥
        $ sudo brctl addbr br0
        $ sudo ifconfig br0 192.168.100.1 netmask 255.255.255.0
    更改docker守护进程的启动配置
        /etc/default/docker 中添加DOCKER_OPTS值
        -b=br0
```

### Docker容器的互联

**环境准备**

```bash
用于测试的Docker镜像Dockerfile：
    # ./cct/Dockerfile
    # container connection test
    FROM ubuntu:14.04
    RUN apt-get install -y ping
    RUN apt-get update
    RUN apt-get install -y nginx
    RUN apt-get install -y curl
    EXPOSE 80
    CMD /bin/bash

    # docker build -t summer258/cct .
```

**允许所有容器间互联**

```bash
默认设置
--icc=true  默认

启动第一个容器
# docker run -it --name cct1 summer258/cct
/# nginx
Ctrl+P Ctrl+Q

启动第二个容器
# docker run -it --name cct2 summer258/cct
/# ifconfig
Ctrl+P Ctrl+Q

inet addr:172.17.0.3

连接到第一个容器cct1
# docker attach cct1
/# ifconfig

inet addr:172.17.0.2

测试连接：ping 172.0.3

连接到第一个容器cct2
# docker attach cct2
测试连接：curl http://172.17.0.2

# 我们将一个容器停止然后再次重新启动的时候，容器的ip地址会发生变化。也就是容器的服务如果通过ip地址去暴露，那么这个服务是不可靠的，这个时候我们可以为其它的容器取一个别名。
--link
    # docker run --link=[CONTAINER_NAME]:[ALIAS] [IMAGE] [COMMAND]

启动第三个容器
# docker run -it --name cct3 --link=cct1:webtest summer258/cct
/# ping webtest

重启docker服务
    # systemctl restart docker
    # docker restart cct1 cct2 cct3 # 被链接的容器要先启动，否则要报错
    /# ping webtest
```

**拒绝所有容器间互联**

```bash
Docker守护进程的启动选项
    DOCKER_OPTS= " --icc=false"

# ubuntu
$ sudo vim /etc/default/docker
    DOCKER_OPTS = "--icc=false"
# centos
$ sudo vim /etc/docker/daemon.json
    {
        …
        “icc”:false,
        …
    }


$ sudo systemctl restart docker
$ ps -ef | grep docker
$ sudo docker restart cct1 cct2 cct3
$ sudo docker attach cct3
/# ping webtest
```

**允许特定容器间的连接**

```bash
Docker守护进程的启动选项
    --icc=false --iptables=true
    --link
# --icc 用来控制容器之间是否允许访问。 仅仅允许使用link配置的网络进行访问
# --iptables 允许docker容器将配置添加到linux中的iptables中。（iptables是linux中控制网络访问的重要组件）
# --link 为其它容器的网络配置一个别名

$ sudo iptables -F  # 将iptables中的内容清空
$ sudo iptables -L -n # 查看iptables的内容
```

### 容器与外部网络的连接

**ip-forward**

```bash
--ip-forward=true
    决定系统是否会转发流量

$ sudo sysctl net.ipv4.conf.all.forwarding
```

**iptables**

```bash
iptables是与Linux内核集成的包过滤防火墙系统，
几乎所有的Linux发行版本都会包含iptables的功能
```

![Alt](.\img\20190802105416694.png)

整体数据包分类：

- 发给防火墙本身的数据包	
- 需要经过防火墙的数据表

下图中的PREROUTING、INPUT、FORWARD、OUTPUT、POSTROUTING可以称为表，然后下面的mangle、nat、raw这些可以称为规则链。也就是“表”->“规则链”-> "规则"。

![1568887001289](.\img\1568887001289.png)

表间的优先顺序： raw>mangle>nat>filter

链间的匹配顺序：

- 入站数据：PREROUTING、INPUT
- 出站数据：OUTPUT、POSTROUTING
- 转发数据：PREROUTING、FORWARD、POSTROUTING

链内的匹配顺序

- 自上而下按顺序依次进行检查，找到相匹配的规则即停止（LOG选项表示记录相关日志）
- 若在该链中找不到相匹配的规则，则按该链的默认策略规则。