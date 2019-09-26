# portainer.io

​	[官方网站](https://www.portainer.io)

## 介绍

Portainer是个轻量级的Docker管理面板，和Rancher这种重量级选手没法比，Portainer倾向于单机的管理(后来发现能够添加多个单机节点切换着管理)，当然，在Docker搞出Swarm之后Portainer也借此实现了集群管理。

使用官方提供的Demo预览一下

地址: http://demo.portainer.io/
用户名: admin
密码: tryportainer

![img](.\img\15212209155062.jpg)

## 安装

​	[官方教程](https://www.portainer.io/installation/)

```bash
$ docker volume create portainer_data
$ docker run -d -p 8000:8000 -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer
```





