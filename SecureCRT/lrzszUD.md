# lrzsz实现上传下载

## 安装

```
yum -y install lrzsz
# 或者 sudo apt-get install lrzsz
# 或者 http://www.ohse.de/uwe/software/lrzsz.html下载源码包编译安装
```

## 下载

```
sz 远程主机上的文件
```

## 上传

```
rz
# 然后再弹框中选择要上传的文件
```

![img](.\img\1476641-20180927173536163-92754935.png)



**提示**：这个程序是支持拖拽上传的，在SecureCRT和Xshell中key将文件拖拽到窗口按照提示即可完成上传。

> ​		单独用rz会有两个问题：上传中断、上传文件变化（md5不同），解决办法是上传时用rz -be，并且去掉弹出的对话框中“Upload files as ASCII”前的勾选。
>
> -b binary 用binary的方式上传下载，不解释字符为ascii
>
> -e 强制escape 所有控制字符，比如Ctrl+x，DEL等