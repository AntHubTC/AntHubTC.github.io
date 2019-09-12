# Docker镜像与仓库

```bash
docker info 在可以查看docker相关的信息，其中可以看到镜像的存储位置。
```

## 镜像的相关操作

### 列出镜像

```bash
docker images [OPTIONS] [REPOSITORY]
    -a  --all=False 显示所有镜像
    -f  --filter=[] 显示时的过滤条件
    --no-trunc=false    不使用截断的形式显示命令
    -q  --quiet=false   只显示镜像的v-id
    
# 练习
dokcer images
dokcer images ubun*
docker images --no-trunc=true
docker images -a -q --no-trunc=true
```

### 查看镜像/容器

```bash
docker inspect [OPTIONS] CONTAINER|IMAGE[CONTAINER|IMAGE……]
	-f,--format=""
```

### 删除镜像

```bash
docker rmi [OPTIONS] IMAGE [IMAGE…]
-f  --force=false   强制删除镜像
--no-prune=false    保留删除镜像中未打标签的父镜像


# 练习
docker rmi ubuntu:12.04
docker rmi ac32342daaf
docker rmi ubuntu:12.04 ubuntu:precise
docker rmi $(docker images ubuntu -q)  # 高级实用，命令匹配返回多个镜像id
```

### 查找镜像

```bash
Docker Hub  https://hub.docker.com/
# docker search [OPTIONS] TERM
    --automated=false   只显示自动化构建的选项
    --no-trunc=false    以截断方式显示image id
    -s,--stars=0   设置显示结果的最低星级
    一次最多返回25个结果
# 练习
docker search ubuntu
docker search -s 3 ubuntu  # 查找3星以上的仓库
```

### 拉取镜像

```bash
docker pull [OPTIONS] NAME[:TAG]
    -a  --all-tags=false    下载仓库中所有标签镜像

提速
    使用--registry-mirror选项
        1.修改：vim /etc/default/docker  永久配置  windows中在用户目录下.docker目录下去找，也可以直接用提供的软件去改
        2.添加：DOCKER_OPTS = "--registry-mirror=http://MIRROR-ADDR"
```

> 如果没有配置国内的镜像仓库，你会发现获取镜像的时候非常缓慢。这时候可以通过--registry-mirror来指定国内的镜像  https://www.daocloud.io
>
> 1. https://docker.mirrors.ustc.edu.cn
> 2. http://f1361db2.m.daocloud.io   daocloud提供的
> 3. https://registry.docker-cn.com  这个我ping不通了
> 4. alicloud 阿里云也提供了docker加速器，不过比ustc更麻烦：不光要注册为阿里云的用户，还得加入开发者平台。不过捏着鼻子做完这些以后，它的服务还真是不错，基本1MB/s的pull速度(部分原因可能是因为我也在杭州吧)。配置方法跟daocloud类似，也是开通加速器以后给一个url。

### 推送镜像

```bash
docker push NAME[:TAG]
```

> 1. docker不会将整个镜像传到docker hub上，只会传送修改的部分到docker hub上。
> 2. 默认传到docker hub上的镜像是公有的，可以在网站上将镜像变成私有镜像，如果有更多的镜像需要改为私有镜像，可以使用docker hub提供的付费服务。

## 构建镜像

### 构建镜像的好处

- 保存对容器的修改，并再次使用
- 自定义镜像的能力

- 以软件的形式打包并分发服务及其运行环境

### 使用commit构建镜像

```bash
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
    -a  --author="" 指定镜像作者，一般：name@email
    -m  --message=""    提交信息
    -p  --pause=true    在commit过程中不暂停容器

    ********************demo***************
    # docker run -it -p 80 --name commit_test ubuntu /bin/bash
    # apt-get update
    # apt-get install -y nginx
    # exit
    # docker ps -l
    生成镜像
    # docker commit -a "summer" -m "nginx" commit_test summer258/commit_test1
    # docker images
    # docker run -d --name nginx_web -p 80 summer258/commit_test1 nginx -g "daemon off;"
    # docker ps
    # curl http://127.0.0.1:32770
```

### 使用dockerfile构建镜像

dockerfile文件就是包含一系列命令的文本文件。

```bash
docker build [OPTIONS] PATH | URL | -
        --force-rm=false
        --no-cache=false
        --pull=false
        -q  --quiet=false
        --rm=true
        -t  --tag=""  指定镜像的名字

    创建一个Dockerfile
        # first dockerfile
        FROM ubuntu:14.04     # 基础镜像
        MAINTAINER  name "name@email" # 作者
        RUN apt-get update # 运行的命令
        RUN apt-get install -y nginx # 运行的命令
        EXPOSE 80 # 暴露80端口

    ********************demo***************
    # mkdir -p dockerfile/df_test1
    # cd dockerfile/df_test1
    # vim Dockerfile
        # first dockerfile
        FROM ubuntu:14.04
        MAINTAINER  name "name@email"
        RUN apt-get update
        RUN apt-get install -y nginx
        EXPOSE 80
    # docker build -t='summer258/df_test1' .
    # docker run -d --name nginx_web2 -p 80 summer258/df_test1 nginx -g "daemon off;"
    # docker ps
    # curl http://127.0.0.1:32770
    ***************************************
```

## Docker的C/S模式

![命令方式操作](.\img\20190801111028168.png)

Remote API

RESTful风格的API
STDIN、STDOUT、STDERR

![RESTful风格的API](.\img\2019080111200989.png)

连接方式

unix:///var/run/docker.sock
tcp://host:port
fd://socketfd

![unix,tcp,fd方式交互](.\img\20190801111918280.png)

```bash
# ps -ef | grep docker
# docker version
# nc -U /var/run/docker.sock
GET /info HTTP/1.1
```

## Docker守护进程的配置和操作

### 查看守护进程

```bash
ps -ef | grep docker
status docker 
```

### 使用service命令管理

```bash
service docker start|stop|restart
```

### Docker的启动选项

```bash
docker -d [OPTIONS]
    -d 表示以守护进程形式运行

    运行相关：
    -D  --debug=false
    -e  --exec-drive="native"
    -g  --graph="/var/lib/docker"
    --icc=true
    -l  --log-level="info"
    --label=[]
    =p  --pidfile="/var/run/docker.pid"

    Docker服务器连接相关：
    -G,--group="docker"
    -H,--host=[]
    --tls=false
    --tlscacert="/home/sven/.docker/ca.pem"
    --tlscert="/home/sven/.docker/cert.pem"
    --tlskey="/home/sven/.docker/key.pem"
    --tlsverify=false

    RemoteAPI相关：
    --api-enable-cors=false

    存储相关：
    -s,--storage-drive=""
    --selinux-enabled=false
    --storage-opt=[]

    Registry相关：
    --insecure-registry=[]
    --registry-mirror=[]

    网络设置相关：
    -b,--bridge=""
    --bip=""
    --fixed-cidr=""
    --fixed-cidr-v6=""
    --dns=[]
    --dns-search=[]
    --ip=0.0.0.0
    --ip-forward=true
    --ip-masq=true
    --iptables=true
    --ipv6=false
    --mtu=0
```

docker启动配置文件：/etc/default/docker

```bash
DOCKER_OPTS = "……"
```

