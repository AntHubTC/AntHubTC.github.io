# SCRT的SFTP在WINDOWS与LINUX之间传输文件

使用SecureCRT软件ssh连接到ubuntu虚拟机。然后在SecureCRT上面打开SFTP会话，如下图所示：　　

![img](.\img\181203085577501.png)

## SFTP命令

### 查看命令帮助

​	进入到sftp命令窗口以后，就可以通过sftp命令来进行文件互传的操作。下面主要介绍一下sftp命令的含义。

```bash
sftp> help
Available commands:
ascii                          Set transfer mode to ASCII
binary                         Set transfer mode to binary
cd path                        Change remote directory to 'path'
lcd path                       Change local directory to 'path'
detail remote-path             Display system information about remote
                                 file or folder
ldetail local-path             Display system information about local
                                 file or folder
chgrp group path               Change group of file 'path' to 'group'
chmod mode path                Change permissions of file 'path' to 'mode'
chown owner path               Change owner of file 'path' to 'owner'
exit                           Quit sftp
help                           Display this help text
include filename               Include commands from 'filename'
                                 Alternate: < filename
get [-r][-a | -b] remote-path  Download file
                                 -r downloads directory recursively
                                 force ascii (-a) or binary (-b) mode
ln [-s] existingpath linkpath  Hardlink / symlink remote file
ls [options] [path]            Display remote directory listing
lls [options] [path]           Display local directory listing
mkdir path                     Create remote directory
lmkdir path                    Create local directory
mv oldpath newpath             Move remote file
lmv oldpath newpath            Move local file
open [user@]host[:port]        Connect to remote host
put [-r][-a | -b] local-path   Upload file
                                 -r uploads directory recursively
                                 force ascii (-a) or binary (-b) mode
pwd                            Display remote working directory
lpwd                           Print local working directory
quit                           Quit sftp
rename oldname newname         Rename remote file
lrename oldname newname        Rename local file
rmdir path                     Remove remote directory
lrmdir path                    Remove local directory
rm path                        Delete remote file
lrm path                       Delete local file
su username                    Substitutes the current user
                                 This is only supported with VShell for 
                                 Windows 3.5 or later.
type [transfer-mode]           Display or set file transfer mode
view remote-path               Download and open file
version                        Display protocol version
```

翻译过来就是：

```bash
sftp-- help 
可用命令： 
cd 路径                        更改远程目录到“路径” 
lcd 路径                       更改本地目录到“路径” 
chgrp group path               将文件“path”的组更改为“group” 
chmod mode path                将文件“path”的权限更改为“mode” 
chown owner path               将文件“path”的属主更改为“owner” 
exit                           退出 sftp 
help                           显示这个帮助文本 
get 远程路径                   下载文件 
ln existingpath linkpath       符号链接远程文件 
ls [选项] [路径]               显示远程目录列表 
lls [选项] [路径]              显示本地目录列表 
mkdir 路径                     创建远程目录 
lmkdir 路径                    创建本地目录 
mv oldpath newpath             移动远程文件 
open [用户@]主机[:端口]        连接到远程主机 
put 本地路径                   上传文件 
pwd                            显示远程工作目录 
lpwd                           打印本地工作目录 
quit                           退出 sftp 
rmdir 路径                     移除远程目录 
lrmdir 路径                    移除本地目录 
rm 路径                        删除远程文件 
lrm 路径                       删除本地文件 
symlink existingpath linkpath  符号链接远程文件 
version                        显示协议版本
```

### **常用命令**

```
cd 路径                        更改远程目录到“路径” 
lcd 路径                       更改本地目录到“路径” 
ls [选项] [路径]               显示远程目录列表 
lls [选项] [路径]              显示本地目录列表 
put 本地路径                   上传文件 
get 远程路径                   下载文件
```

这里在详细说明一下**远程目录**和**本地目录**。

远程目录：ls查看到的是ubuntu虚拟机上面的目录

本地目录：lls查看到的是windows实体机上面的目录。

### 上传和下载

"文件"--> "连接SFTP会话"或使用Alt+P快捷键快速连接SFTP：

put操作：windows->linux     注意put的目标目录必须具有写权限。

```
put  本地操作系统的文件（绝对or相对）
```

get操作：linux->windows

```
get 远程系统的文件（绝对or相对）
lls 查看本地系统当前目录位置
```

![1571130234206](.\img\1571130234206.png)

