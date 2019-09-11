## Windows安装Docker

在windows中安装docker要分不同的版本，**win7/win8**和**win10**两种不同安装方案。

具体的安装方法参照[runoob.com](https://www.runoob.com/docker/windows-docker-install.html)上的安装教程。



## 镜像加速(注意)

鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，我们可以需要配置加速器来解决，我使用的是网易的镜像地址：**http://hub-mirror.c.163.com**。

新版的 Docker 使用 /etc/docker/daemon.json（Linux） 或者 %programdata%\docker\config\daemon.json（Windows） 来配置 Daemon。

请在该配置文件中加入（没有该文件的话，请先建一个）：

```json
{
  "registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```

网上有说改成https://registry.docker-cn.com的，但是现在这个网址都ping不通，所以不能用了。

![1568128730721](.\img\1568128730721.png)

