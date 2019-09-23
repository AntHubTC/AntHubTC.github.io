# Docker数据卷

## 什么是数据卷（Data Volume）

- 数据卷是经过特殊设计的目录,可以绕过联合文件系统(UFS),为一个或多个容器提供访问。
- 数据卷设计的目的,在于数据的永久化,它完全独立与容器的生存周期,因此,Docker.不会在容器删除时删除其挂载的数据卷,也不会存在类似的垃圾收集机制,对容器引用的数据卷进行处理。

![Alt](.\img\20190802111712300.png)

数据卷（Data Volume）的特点

- 数据卷在容器启动时初始化，如果容器使用的镜像在挂载点包含了数据，这些数据会拷贝到新初始化的数据卷中。
- 数据卷可以在容器之间共享和重用。
- 可以对数据卷里的内容直接进行修改。
- 数据卷的变化不会影响镜像的更新。
- 卷会一直存在，及时挂载数据卷的容器已经被删除。

为容器添加数据卷

```bash
 $ sudo docker run -it -v ~/container_data:/data ubuntu /bin/bash
  /# ls

  $ sudo docker inspect 容器名/id
  可以查看Volume目录信息
```

为数据卷添加访问权限

```bash
$ sudo docker run -it -v ~/datavolume:/data:ro ubuntu /bin/bash
  ro：只读
```

使用Dockerfile构建包含数据卷的镜像

```bash
Dockerfile指令：VOLUME["/data"]
  不能映射到已经存在的文件目录，系统默认创建
```

## Docker的数据卷容器

### 什么是数据卷容器：

​	命名的容器挂载数据卷，其他容器通过挂载这个容器实现数据共享，挂载数据卷的容器，就叫做数据卷容器。

![Alt](.\img\20190802115901717.png)

### 挂载数据卷容器的方法

```bash
sudo docker run --volumes-from [CONTAINER NAME]
```

### 删除容器和数据卷的关系

- docker rm 容器    该命令只会删除容器，不会删除容器的数据卷
- docker rm -v  容器  改名了会删除容器，并且**有可能**删除数据卷（因为如果数据卷信息被多个容器正在使用，数据卷中的文件是不会删除的）

## Docker数据卷的备份和还原

### 数据备份方法

```bash
sudo docker run --volumes-from [container name] -v $(pwd):/backup[:wr] ubuntu tar cvf /backup/backup.tar [container data volume]
```

![Alt](.\img\2019080212104349.png)

### 数据还原方法

```bash
sudo docker run --volumes-from [container name] -v $(pwd):/backup[:wr] ubuntu tar xvf /backup/backup.tar [container data volume]
```

