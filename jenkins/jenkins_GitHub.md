# Jenkins+GitHub持续集成部署

## 要点

​	Jenkins与GitHub配合实现持续集成需要注意一下几点：

1. Jenkins要部署到外网上，因为内网地址GitHub是无法访问到的。这一点可以通过租用阿里云等平台提供的云服务可以实现。

2. Jenkins所在的主机上需要安装Git，通过Git程序从GitHub上clone代码。

3. 在Jenkins内需要指定Git程序位置，和指定JDK、Mavne程序位置非常类似。

4. 在GitHub上使用每个Repository的WebHook方式远程触发Jenkins构建。

5. 在Jenkins内关闭”防止跨站点请求伪造“

   > 说明：这个文档操作很多和SVN集成是差不多的，所以这个文档主要讲解不同的操作的地方。

## 安装Git

先将git的tar源码包下载下来

```bash
# 安装编译git时需要的包
yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel
yum install -y gcc perl-ExtUtils-MakeMaker
# 删除已经有的git
yum remove git # 没有就不用执行
# Git官方下载Git最新tar包，移动到/usr/src目录下
cd /usrc/src
tar -zxvf git-2.9.3.tar.gz
# 编译安装
cd git-2.9.3
make prefix=/usr/local/git all
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc # 使配置生效
# 检查安装是否成功
git --version
```

## Jenkins配置GIt

![1569473217835](.\img\1569473217835.png)

## 在GitHub上添加WebHook

![1569473324259](.\img\1569473324259.png)

## 在Jenkins内关闭“防止跨站点请求伪造”

![1569473602248](.\img\1569473602248.png)