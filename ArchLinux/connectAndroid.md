# 连接Android手机



[将安卓手机通过mtp连接到archlinux上](https://blog.csdn.net/u014688887/article/details/128865615)



```bash
# 安装的archlinux缺少必要的组件，无法直接将手机通过数据线与电脑交换数据，这里记录archlinux安装必要包与手机进行数据交换
yay -S mtpfs jmtpfs libmtp
# 我不知道为啥，我做来这一步，手机连接好，手机切换到文件选项，这个时候就有来。

# 首先创建一个挂载设备的文件夹
mkdir ~/mtp
# 连接设备
sudo jmtpfs ~/mtp 

# GVFS （gnome files）
sudo pacman -S gvfs-mtp gvfs-gphoto2
# 其中gvfs-gphoto2 是对PTP提供支持

# 对KDE的KIO支持
# sudo pacman -S kio-extras

# 卸载设备
# 通常在文件管理器当中弹出是一种方法，下面使用命令行
sudo fusermount -u ~/mtp
# 后面的目录是你挂载的位置
```

