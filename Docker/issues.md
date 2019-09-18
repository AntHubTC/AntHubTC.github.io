# 遇到的一些问题

## 问题一

​	说是这个是一个问题，更应该说是一个注意事项。docker在windows操作系统中和virtualBox在使用Hyper-V上是冲突的。docker在windows中是需要Hyper-V支持的，VirtualBox在windows不需要Hyper-V支持，在使用这两款软件的时候如果不满足上面的内容都会报错。

![1568724013895](.\img\1568724013895.png)

## 问题二

![1568722965434](.\img\1568722965434.png)

这个问题的导致原因有多种情况，下面是部分情况的总结:

- docker的守护进程运行的用户和当前用户不是同一个用户，这个时候切换到对应用户就可以了

- 守护进程没有启动     service start docker

- windows下也遇到过这种情况，好像是重新了docker好像就可以了

  