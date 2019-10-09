## 容器的基本操作

### 启动容器

[RUNOOB.COM](https://www.runoob.com/docker/docker-run-command.html)

```bash
docker run [OPTIONS] IMAGE [COMMAND][ARG...]
      run 在新容器中执行的命令
      
# 练习
docker run ubuntu echo 'Hello world'
```

### 启动交互式容器

```bash
docker run -i -t IMAGE /bin/bash
   -i --interactive=false   打开STDIN，用于控制台交互
   -t --tty=false 默认是false    docker为用户分配一个伪用户终端
   /bin/bash 这是表示载入容器后运行bash ,docker中必须要保持一个进程的运行，要不然整个容器就会退出。
这个就表示启动容器后启动bash。

# 练习1
docker run -i -t ubuntu /bin/bash
exit  # exit就可以退回原来的终端
# 练习2
docker pull alpine # alpine是微型linux操作系统，只有5M多
docker run -i -t alpine /bin/sh 

```

### 查看容器

能查看容器的CONTAINER ID，IMAGE，COMMAND，CREATED，STATUS，PORTS，NAMES信息。

```bash
docker ps [-a][-l]
     # 不跟任何参数，表示返回目前正在运行的容器
	-a 列出所有的容器
	-l 列出最新创建的容器

docker inspect 容器名/id  以json的形式展示容器详情信息

如何更改启动容器的名称，在启动容器的时候使用--name=""参数指定容器的名称。
```



### 重新启动停止的容器：

```bash
docker start [-i] 容器名/id
	-i 以交互的方式启动已经有的容器
docker stop 容器名/id
```



### 删除停止的容器

```bash
docker rm 容器名/id [容器名/id] ... 可以删除多个
```

> ​	不能删除正在运行的容器



### 容器操作技巧

​	在实战中发现，凡是涉及容器id的命令我们可以不用完全写完容器的id，只需要写一点点能够唯一标识我们要操作的容器就行，这样我们就不用每次去拷贝容器的id了。

### Run命令常用选项说明

```bash
-d, --detach=false， 指定容器运行于前台还是后台，默认为false
-i, --interactive=false， 打开STDIN，用于控制台交互
-t, --tty=false， 分配tty设备，该可以支持终端登录，默认为false
-u, --user=""， 指定容器的用户
-a, --attach=[]， 登录容器（必须是以docker run -d启动的容器）
-w, --workdir=""， 指定容器的工作目录
-c, --cpu-shares=0， 设置容器CPU权重，在CPU共享场景使用
-e, --env=[]， 指定环境变量，容器中可以使用该环境变量
-m, --memory=""， 指定容器的内存上限
-P, --publish-all=false， 指定容器暴露的端口
-p, --publish=[]， 指定容器暴露的端口
-h, --hostname=""， 指定容器的主机名
-v, --volume=[]， 给容器挂载存储卷，挂载到容器的某个目录
--volumes-from=[]， 给容器挂载其他容器上的卷，挂载到容器的某个目录
--cap-add=[]， 添加权限，权限清单详见：http://linux.die.net/man/7/capabilities
--cap-drop=[]， 删除权限，权限清单详见：http://linux.die.net/man/7/capabilities
--cidfile=""， 运行容器后，在指定文件中写入容器PID值，一种典型的监控系统用法
--cpuset=""， 设置容器可以使用哪些CPU，此参数可以用来容器独占CPU
--device=[]， 添加主机设备给容器，相当于设备直通
--dns=[]， 指定容器的dns服务器
--dns-search=[]， 指定容器的dns搜索域名，写入到容器的/etc/resolv.conf文件
--entrypoint=""， 覆盖image的入口点
--env-file=[]， 指定环境变量文件，文件格式为每行一个环境变量
--expose=[]， 指定容器暴露的端口，即修改镜像的暴露端口
--link=[]， 指定容器间的关联，使用其他容器的IP、env等信息
--lxc-conf=[]， 指定容器的配置文件，只有在指定--exec-driver=lxc时使用
--name=""， 指定容器名字，后续可以通过名字进行容器管理，links特性需要使用名字

--net="bridge"， 容器网络设置:
bridge 使用docker daemon指定的网桥
host //容器使用主机的网络
container:NAME_or_ID >//使用其他容器的网路，共享IP和PORT等网络资源
none 容器使用自己的网络（类似--net=bridge），但是不进行配置

--privileged=false， 指定容器是否为特权容器，特权容器拥有所有的capabilities
--restart="no"， 指定容器停止后的重启策略:
no：容器退出时不重启
on-failure：容器故障退出（返回值非零）时重启
always：容器退出时总是重启

--rm=false， 指定容器停止后自动删除容器(不支持以docker run -d启动的容器)
--sig-proxy=true， 设置由代理接受并处理信号，但是SIGCHLD、SIGSTOP和SIGKILL不能被代理
```



## 守护式容器

### 什么是守护式容器

- 能够长期运行
- 没有交互式会话
- 适合运行应用程序或服务

### 以守护式运行容器

```bash
docker run -i -t IMAGE /bin/bash
交互式下按ctrl+p然后按ctrl + q    退出交互式命令行，这样容器就会以交互式形式运行。
-i -t 可以缩写为-it

#练习
docker start -i 容器id
ctrl+p
ctrl+q
docker ps # 发现容器依旧在运行
docker attach 容器id
exit
docker ps  # 发现容器已经停止了
```

### 附加到运行中的容器

```bash
docker attach 容器名/id
```

### 启动守护式容器

```bash
docker run -d 镜像名 [COMMAND] [ARG…]
    -d  以后台运行方式启动
```

### 查看容器日志

```bash
docker logs [-f] [-t] [--tail] 容器名/id
    -f --follows=true|false 默认为false 
        一直跟踪日志变化并返回结果，Ctrl+C停止
    -t --timestamps=true|false 默认为false
        附加时间戳
    --tail ="all"
        返回结尾处日志，未指定则返回所有日志
# 其它详细参数了解  docker logs --help

# 练习
docker run --name dc1 -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
docker logs dc1 # 会返回所有的日志，不容易看出日志的价值
docker logs -t dc1 # 可以看到日志输出的时间
docker logs -f dc1 # 我们可以看到日志一直在更新   可以使用ctrl+c停止
docker logs -tf dc1 # 日志一直在更新并且有日期时间  可以使用ctrl+c停止
docker logs -tf --tail 10 dc1 # 只显示最新的10条日志
docker logs -tf --tail 0 dc1 # 只显示最新的日志(运行命令后产生的日志)
```

### 查看容器内进程

```bash
docker top 容器名/id

# 练习
docker top 7d
响应结果如：
PID                 USER                TIME                COMMAND
3996                root                0:00                /bin/bash
```

### 在运行中的容器内启动新进程

```bash
docker exec [-d][-i][-t] 容器名/id [COMMAND] [ARG…]

# 练习
docker exec -i -t dc1 /bin/bash
ctrl + p
ctrl + q
docker top dc1 # 这时候会发现多了一个进程
```

### 停止守护式容器

```bash
docker stop 容器名/id      # 发送信号后等待服务器停止
docker kill 容器名/id      # 直接停止容器
```

### 在linux下查看帮助文件

```bash
man docker-run
man docker-logs
man docker-top
man docker-exec
...
```

