## Dockerfile指令

**创建一个Dockerfile**

```bash
# first dockerfile
FROM ubuntu:14.04
MAINTAINER name "name@email"
RUN apt-get update
RUN apt-get install -y nginx
EXPOSE 80
```

**指令格式**

```bash
# Comment
INStTRUCTION argument
```

FROM <image>[:<tag>]

- 已经存在的镜像

- 基础镜像

- 必须是第一条非注释指令

MAINTAINER  作者名称 "作者邮箱"

指定镜像的作者信息，包含镜像的所有者和邮箱信息

RUN

```bash
指定当前镜像中运行的命令
shell模式
	RUN <command>
	默认shell  /bin/sh -c command
exec模式
	RUN ["executable", "param1", "param2"]
	可以指定其他shell RUN ["/bin/bash", "-c", "echo hello"]
```

EXPOSE <port> [<port>...]

```bash
指定运行该镜像的容器使用的端口
使用时仍需指定     -p port
也可以使用多个EXPOSE命令
```

> 虽然在镜像构建中，指定了暴露的端口号，在容器运行时，我们仍需要手动指定容器的端口映射。在Dockerfile中，使用EXPOSE指令来指定的端口只是来告诉该容器中的应用程序会使用特定的端口。但是出于安全的考虑，docker不会自动的打开端口，而需要在运行时在run命令中添加对端口的映射指令。

CMD

​		提供容器运行时默认的的命令，与前面的RUN命令类似，都是执行一个命令，但是RUN中指定的命令是在镜像构建中运行的，而CMD指令是在容器运行的时候运行的，并且当前我们使用docker run命令启动的时候，如果指定了容器运行时的命令，那么CMD中的指令会被覆盖，不会执行。

```bash
CMD ["executable", "param1", "param2"] (exec模式)
CMD command param1 param2 (shell模式)
CMD ["param1", "param2"] (作为ENTRYPOINT指令的默认参数)
```

ENTRYPOINT

```bash
ENTRYPOINT [ "executable", "param1", "param2"] (exec模式)
ENTRYPOINT command param1 param2   (shell模式)
默认不会被docker run中命令覆盖
可以使用 docker run entrypoint 覆盖
```

ADD、COPY

```bash
将文件/目录复制到Dockerfile构建的文件中，源地址，目标地址
ADD <src>…<dest>
ADD ["<src>"…"<dest>"]  (使用于文件路径中有空格的情况)

COPY <src>…<dest>
COPY ["<src>"…"<dest>"]  (使用于文件路径中有空格的情况)

ADD vs COPY
    ADD包含类似tar的解压功能
    如果单纯复制文件，Docker推荐使用COPY
```

VOLUME ["/data"]

```bash
用于向基于镜像创建的容器添加数据卷，共享数据/数据持久化
```

WORKDIR /path/to/workdir

```bash
在镜像创建新容器时，指定工作目录，一般使用绝对路径，相对路径会持续传递。

如果使用相对路径：
WORKDIR a
WORKDIR b
WORKDIR c
pwd
/a/b/c
绝对路径：
WORKDIR /a/b/c
```

ENV <key> <value>

ENV <key>=<value>…

```bash
用户设置环境变量, 构建过程中和运行过程中同样有效。
```

USER daemon

```bash
指定镜像运行的用户，默认为root

USER user      USER uid
USER user:group   USER uid:gid
USER user:gid     USER uid:group

# 例如
USER nginx
```

ONBUILD [INSTRUCTION]

```bash
为镜像添加触发器。
当一个镜像被其他镜像作为基础镜像时执行。
会在构建过程中插入指令。
```

