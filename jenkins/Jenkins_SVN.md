# Jenkins+SVN持续集成部署

## 系统结构总述

- 创建虚拟机安装Linux系统  （这里将的是将他们放在不同机器上）
  - Subversion服务器
  - Jenkins服务器
  - web服务容器所在服务器
- 版本控制系统子系统
  - Subversion服务器
  - 项目对应版本库
  - 版本库中钩子程序
- 持续集成子系统
  - JDK
  - Tomcat
  - Maven
  - Jenkins
    - 主体程序
    - SVN插件
    - maven插件
    - Deploy to Web Container插件
- 应用发布子系统
  - JDK
  - Tomcat

> ​	本文档练习是使用docker来搭建测试环境的，当然也可以使用虚拟机来搭建也是可以的，在持续集成这块操作基本是相同的。

## 版本控制系统子系统环境

```bash
# 这里我同样使用别人构建好的docker镜像，svn-server的具体安装就不从开始安装具体细说，如果从头搭建svn server可以参考网络其它文档。
# 由于我是搭建一个测试CI的这么一个系统，我就没有将SVN仓库挂出来。
# 完整命令： docker run --privileged=true --restart always --name ci_svnserver -d -v /home/svn:/var/opt/svn -p 3690:3690 garethflowers/svn-server
#	--privileged=true                  授予容器管理员权限，预防创建svn创库时提示权限不足
#    --restart always                    设置容器随宿主机开机自启
#    --name svn-server               设置容器name为svn-server，可自定义
#    -d                                         指定这个容器后台运行
#    -v /home/svn:/var/opt/svn    挂载宿主目录到容器目录

docker run -it --restart always --name ci_svnserver -p 3690:3690 garethflowers/svn-server /bin/sh
cd /var/svn
which svnadmin  # 检查svn命令

```

详细过程我们就省略了，这里记录一下版本库的访问账号密码

![1569228156268](.\img\1569228156268.png)

特别提示：svnserve.conf文件中anon-access一定要打开注释并设置为none

![1569228114866](.\img\1569228114866.png)



## 持续集成子系统环境

​	持续集成系统[参考这里](Jenkins_installConfig)。

## 应用发布子系统环境

```bash
# 拉取一个tomcat镜像下来
docker pull tomcat:7.0-jre8-alpine
# 新建启动一个容器
docker run -it --name=ci_tomcat -p 8080:8080 tomcat:7.0-jre8-alpine /bin/sh
# 启动后，默认工作目录在/usr/local/tomcat中
cd conf
vi tomcat-users.xml # 由于后面Jenkins会操作tomcat，需要用户密码才能，所以这里要创建用户
# =========tomcat-users.xml start=============
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<role rolename="manager-jmx"/>
<role rolename="manager-status"/>
<user username="tomcat_user" password="123456" roles="manager-gui,manager-script,manager-jmx,manager-status"/>
:wq
# =========tomcat-users.xml end=============
cd ../bin
./startup.sh
ctrl+p
ctrl+q  # 退出容器，并将容器变为守护式容器
# 这个时候访问映射的8080端口，就可以访问到容器中运行的tomcat服务。
curl 127.0.0.1:8080
# 也可以浏览器打开tomcat网页192.168.56.2:8080 在页面上你可以试一试那个准备的用户
```