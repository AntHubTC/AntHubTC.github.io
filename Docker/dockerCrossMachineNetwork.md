# Docker跨主机网络

## 使用网桥实现跨主机连接

**网络拓扑:**

![Alt](.\img\20190802151358850.png)

**环境准备：**

```bash
Mac OS X + Parallels
  两台Ubuntu 14.04 虚拟机
  安装网桥管理工具：
      apt-get install bridge-utils
  IP地址：Host1：10.211.55.3
          Host2：10.211.55.5
```

**网络配置：**

```bash
修改/etc/network/interfaces 文件
  auto br0
  iface br0 inet static
  address 10.211.55.3
  netmask 255.255.255.0
  gateway 10.211.55.1
  bridge_ports eth0
```

**Docker设置：**

```bash
修改/etc/default/docker文件
  -b 指定使用自定义网桥
      -b=br0
  --fixed-cidr限制IP地址分配范围
      IP地址划分：
      Host1：10.211.55.64/26
          地址范围：10.211.555.65~10.211.55.126
      Host2:192.168.59.126/26
          地址范围：10.211.55.129~10.211.55.190
```

**优点：**

​	配置简单，不依赖第三方软件

**缺点：**

- 与主机在同网段，需要小心划分IP地址
- 需要有网段控制权，在生产环境中不易实现
- 不容易管理
- 兼容性不佳

### 扩展

​		以上使用网桥的方法不太好，查看[这个文档](https://www.cnblogs.com/jsonhc/p/7823286.html)使用网桥的方法更好。

## 使用Open vSwitch实现跨主机容器连接

**Open vSwitch是什么？**

​		Open vSwitch是一个高质量、多层虚拟交换机，使用开源Apache2.0许可协议，由Nicira Networks开发，主要实现代码为可移植的C代码。它的目的是让大规模网络自动化可以通过编程扩展，同时仍然支持标准的管理接口和协议（例如NetFlow，sFlow，SPAN，RSPAN，CLI，LACP，8022.lag）

**原理：**

![Alt](.\img\20190802153203460.png)

**什么是GRE隧道？**

​		GRE：通用路由协议封装

  隧道技术（Tunneling）是一种通过使用互联网络的基础设施在网络之间传递数据的方式。使用随带传递的数据（或负载）可以使不同协议的数据帧或包。隧道协议将其它协议的数据帧或包重新封装然后通过隧道发送新的帧头提供路由信息，以便通过互联网传递被封装的负载数据。

**环境准备：**

```bash
Mac OS X + Virtualbox
  两台Ubuntu14.04虚拟机
  双网卡，Host-Only&NAT
  安装Open vSwitch：
      apt-get install openvswitch-switch
  安装网桥管理工具：
      apt-get install bridge-utils
  IP地址：Host1：192.168.59.103
          Host2：192.168.59.104
```

**操作：**

```bash
建立ovs网桥
  添加gre连接
  配置docker容器虚拟网桥
  为虚拟网桥添加ovs接口
  添加不同Docker容器网段路由

  主机：192.168.59.103
  查看ovs状态
  $ sudo ovs-vsctl show
  建立ovs网桥
  $ sudo ovs-vsctl add-br obr0
  添加gre接口
  $ sudo ovs-vsctl add-port obr0 gre0
  $ sudo ovs-vsctl set interface gre0 type=gre options:remote_ip=192.168.59.104
  $ sudo ovs-vsctl show

  建立本机docker需要使用的网桥
  $ sudo brctl addbr br0
  $ sudo ifconfig br0 192.168.1.1 netmask 255.255.255.0
  $ sudo brctl addif br0 obr0
  $ sudo brctl show

  配置docker，用新建的网桥代替docker0
  $ sudo vim /etc/default/docker
      DOCKER_OPTS="obr0"
  $ sudo service docker restart

  新建一个docker容器
  $ sudo docker run -it ubuntu /bin/bash
  /# ifconfig
      inet addr:192.168.1.2
  /# ping 192.168.59.104

  切换主机：192.168.59.104
  $ ifconfig
      inet addr:192.168.2.1
  启动一个docker容器
  $ sudo docker run -it ubuntu /bin/bash
  /# ifconfig
      inet addr:192.168.2.4
  /# ping 192.168.59.104

  切回主机：192.168.59.103
  /# ping 192.168.2.4
      ping不通，因为不同网段需要查找路由表来确定不同网段的网络地址
  $ route
  $ sudo ip route add 192.168.2.0/24 via 192.168.59.104 dev eth0

  $ sudo docker run -it ubuntu /bin/bash
  /# ping 192.168.2.4
```

## 使用weave实现跨主机容器连接

**weave是什么？**

> 语义：编织
> 建立一个虚拟的网络，用于将运行在不同主机的Docker容器连接起来
> https://www.weave.works/
> https://github.com/weaveworks/weave#readme

![Alt](.\img\20190802160953349.png)

**环境准备：**

```bash
 Mac OS X + Virtualbox
  两台Ubuntu14.04虚拟机
  双网卡，Host-Only&NAT
  IP地址：Host1：192.168.59.103
          Host2:192.168.59.104
```

**操作：**

```bash
安装weave
  启动weave
      $ weave launch
  连接不同主机
  通过weave启动容器

  主机：192.168.59.103
  $ sudo wget -O /usr/bin/weave https://raw.githubusercontent.com/zettio/weave/master/weave
  $ sudo chmod a+x /usr/bin/weave
  $ weave launch
  $ sudo docker ps -l

  切换主机：192.168.59.104
  重复安装操作
  $ sudo wget -O /usr/bin/weave https://raw.githubusercontent.com/zettio/weave/master/weave
  $ sudo chmod a+x /usr/bin/weave
  $ weave launch 192.168.59.103
  启动容器，将ID赋值给c2
  c2=$(weave run 192.168.1.2/24 -it ubuntu /bin/bash)
  $ echo $c2
  $ docker attach $ c2
  /# ifconfig
  多了一个网络设备ethwe，inet addr：192.168.1.2

  切换Host1:192.168.59.103
  $ weave run 192.168.1.10/24 -it --name wc1 ubuntu /bin/bash
  相同网段的IP地址
  $ sudo docker aatach wc1
  /# ifconfig
  增加wthwe，inet addr:192.168.1.10
  /# ping 192.168.1.2
  能够ping通
```

