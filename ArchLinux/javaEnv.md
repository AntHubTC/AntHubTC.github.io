# java开发环境相关安装



## java

[archlinux切换openjdk版本](https://blog.csdn.net/xuejian__/article/details/129350683)

```shell
sudo pacman -S jdk11-openjdk
sudo pacman -S java-8-openjdk
# 查看系统安装的所有jdk版本
archlinux-java status
# 设置当前版本
archlinux-java set java-8-openjdk
```

## IDEA

```shell
# 下面两个需要一起安装
yay aur/intellij-idea-ultimate-edition-jre
yay aur/intellij-idea-ultimate-edition
```

## Pycharm

```bash
yay pycharm-community-edition
```



## **DataGrip**

```shell
yay datagrip
```

破解：

1.https://3.jetbra.in/ 中找到一个网站，然后可以下载包jetbra.zip，然后安装里面的说明安装

2.这一步[找个激活码](https://ideas.zngue.com/detail/1_1.html)
