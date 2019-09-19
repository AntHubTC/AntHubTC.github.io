# Docker客户端和守护进程

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
ps -ef | grep docker
docker version
nc -U /var/run/docker.sock  # nc是linux下的命令
GET /info HTTP/1.1
```

## Docker守护进程的配置和操作

### 查看守护进程

```bash
ps -ef | grep docker
status docker # linux
```

### 使用service命令管理

```bash
# linux
service docker start|stop|restart 
# windows
net start | findStr Docker
net start/stop docker
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
DOCKER_OPTS = " -label:name=docker_server_1"
```

生效

```bash
sudo service docker restart
ps -ef | grep docker  # 这时候查看到参数已经应用到了docker的守护进程上
docker info   # 在labels中就能查看到之前所做的修改
```



### Docker的远程访问

​	  将Docker客户端和服务端配置到不用的机器上，实现docker客户端到服务端的远程访问。

**环境准备**

```bash
第二台安装Docker的服务器
修改Docker守护进程启动选项，区别服务器
保证Client API和Server API版本一致

# docker version
    查看版本API是否一致
```

**修改服务器端配置**

```bash
修改Docker守护进程启动项
-H  tcp://host:port
    unix:///path/to/socket
    fd://* or fd://socketfd
守护进程默认配置：
-H  unix:///var/run/docker.sock

vim /etc/default/docker
    DOCKER_OPTS = "-H tcp://0.0.0.0:2375"
    # 一般选择2375端口
重启服务 # service docker restart
ifconfig    获取本机IP地址
```

**远程访问**

```bash
curl http://服务器IP:配置port/info
```

**客户端远程访问**

```bash
修改客户端配置
使用Docker客户端命令选项
-H  tcp://host:port
    unix:///path/to/socket
    fd://* or fd://socketfd
客户端默认配置：
-H  unix:///var/run/docker.sock

# docker -H tcp://ip:port info

使用环境变量简化操作DOCKER_HOST
export DOCKER_HOST="tcp://ip:port"

将环境变量置空则返回本机服务
export DOCKER_HOST=""
```

**设置了远程访问模式后的服务端不再支持本机连接**

```bash
1.将本机作为远程客户端，通过DOCKER_HOST连接
2.修改本机配置，添加默认配置
vim /etc/default/docker
    DOCKER_OPTS = "-H tcp://0.0.0.0:2375 -H  unix:///var/run/docker.sock" # 可以指定多个远程服务
```

