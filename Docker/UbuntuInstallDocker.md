# Ubuntu安装Docker

​	在官网中对于docker的安装描述的很详细，今后安装的时候最好更多参考[官网安装教程](https://docs.docker.com/install/linux/docker-ce/ubuntu/)，有各种操作系统的安装方法。

​	官网有提到，使用Ubuntu维护的版本是相对较老一点的，所以要最新的还是最好用官网的资源进行安装。

## Docker支持的Ubuntu版本

- Ubuntu Trusty 14.04 （LTS）(64-bit)

- Ubuntu Precise 12.04 (LTS)(64-bit)

- Ubuntu Raring 13.04 and Saucy 13.10 (64 bit)

## 安装前检查

1. 内核版本

   ​	uname -a 

   ​	或  cat /etc/issue

   ​	或 cat /proc/version

   如果内核版本不满足,要升级内核版本.

2. 检查Device Mapper

   ls -l /sys/class/misc/device-mapper

## 卸载老版本

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

## 安装离线Docker社区版

在[此处下载](https://download.docker.com/linux/ubuntu/dists/trusty/pool/stable/amd64/)ubuntu对应内核版本的安装包。

也可以在[这个网站](https://ubuntu.pkgs.org/19.04/docker-ce-edge-amd64/)上找到安装包。

首先将软件包传到服务器上

```bash
# 查看软件包依赖
sudo dpkg --info 软件包名.deb | grep Depends
# 可以提前安装好需要的软件包
# 直接按照docker
sudo dpkg -i 软件包名.deb
# 如果因为差包没有安装成功，尝试下面命令
sudo apt-get -f
# 经过上面命令修复后，就可以使用下面命令测试安装是否成功
sudo docker version
sudo docker run hello-world
sudo dcoker ps -l
```

