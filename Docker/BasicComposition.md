# Docker的基本组成

![1567604989868](.\img\1567604989868.png)

## Docker客户端/守护进程     

​	C/S架构  

​	本地/远程        Docker可以在本地访问，也可以在远程访问。

![1567603564134](.\img\1567603564134.png)

## Docker Image镜像

- 容器的基石（容器基于镜像启动和运行，镜像就好比容器的源代码，保存了容器启动的各种条件。）

- 层叠的只读文件系统。

- 联合加载union mount （一次加载多个文件系统，但是在外面看起来，只能看见一个文件系统，联合加载会将各层文件系统叠加到一起，这样最终的系统会包含底层文件和目录。一个镜像可以放到另一个镜像的顶部，对于下面的镜像称为父镜像，以此类推，最底部的镜像称为基础镜像）

  ![1567604166360](.\img\1567604166360.png)

## Docker Container容器

​	通过镜像启动  （docker容器是docker的执行单元，容器中可以运行用户的多个进程）

​	启动和执行阶段 （如果说docker镜像是docker生命周期的构建和打包阶段，那么容器就是启动和执行阶段）

​	写时复制 （docker容器在运行的时候，会在最顶部加载一个可读写的文件系统，也就是一个可写层，我们运行的程序就在这层中进行执行的，当docker第一次执行程序的时候，该层是空的，当文件系统发生变化的时候，这些变化都会应用到这一层上。比如，如果想要修改一个文件，这个首先会将该读写层下面的只读层复制到可写层，该文件的只读版本依然存在，只是被只读层中该文件的副本所隐藏，这就是docker的写时复制）

![1567604718449](.\img\1567604720781.png)

## Docker Registry 仓库

​	Docker使用仓库来保存用户构建的镜像，仓库分为公有和私有两种。Docker公司提供了一个公有的仓库名叫Docker Hub，我们可以在该网站注册账号，分享并保存自己的镜像，目前docker hub上已经有了非常丰富的镜像，我们可以在上查找我们可以使用的镜像，为我们节省更多构建镜像的时间。当然，我们可以建设自己私有的仓库。



## Docker相关技术简介

​	Docker依赖Linux内核中的一些特性，Namespaces命名空间和Control groups（cgroups）控制组。

### Namespaces命名空间

​	有点像编程语言的命名空间， 进行封装-->代码隔离

​	在操作系统，系统资源的隔离，进程、网络、文件系统...

- PID (Process ID)  进程隔离
- NET(Network)  管理网络接口
- IPC(InterProcess Communication) 管理跨进程通信的访问
- MNT(Mount) 管理挂载点
- UTS(Unix Timesharing System) 隔离内核和版本标识



### Control groups 控制组

​	用来分配资源；来源于google，Linux kernel 2.6.24@2007

- 资源限制
- 优先级设定
- 资源计量
- 资源控制



### Docker容器的能力

- 文件系统隔离：每个容器都有自己的root文件系统
- 进程隔离：每个容器都运行在自己的进程环境中
- 网络隔离：容器间的虚拟网络接口I和IP地址都是分开的
- 资源隔离和分组：使用cgroups将CPU和内存之类的资源独立分配给每个Docker容器