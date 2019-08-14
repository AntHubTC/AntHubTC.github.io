# 搭建私有git服务器

​	在github上，只能使用公有的public仓库，在实际项目上通常代码是不允许公开的，虽然github有private，但是要收费，总的来说还是不怎么好。所以，要使用私有远程仓库，通常情况下是搭建属于自己的私有Git服务器。 

​	远程仓库实际上和本地仓库没啥不同,纯粹为了7x24小时开机并交换大家的修改Hub就是一个免费托管开源代码的远程仓库。但是对于某些视源代码如生命的商业公司来说,既不想公开源代码,又台不得给Git自b交保护费,那就只能自己搭建一台Git服务器作为私有仓库使用。

​	搭建Git服务器需要准各一台运行 Linux的机器,在此我们使用 Centos。以下为安装步骤：

1. 安装git服务环境准备

   yum -y install curl curl-devel zlib-devel openssl-devel perl cpio expat-devel gettext-devel gcc cc

2. 下载 git-2.5.0.tar.gz

   ```bash
   tar -zxvf git-2.5.0.tar.gz
   cd git-2.5.0
   autoconf
   ./configure
   make 
   make install
   # 添加用户  此命令执行后会创建/home/git目录作为git用户的主目录
   adduser -r -c 'git version control' -d /home/git -m git
   # 为用户设置密码
   passwd git
   su git
   whoami
   cd ~
   mkdir gitRepository
   cd gitRepository/
   # --bare 表示制作一个不带工作目录的纯版本库
   git init --bare
   # 到此，git服务器就搭建完毕了
   ```

3. 将本地仓库推送到服务器仓库

   ```bash
   # origin只是远程仓库的一个代号/标识      git:用户
   git remote add privateGit ssh://git@192.168.25.156/home/git/gitRepository
   git push -u privateGit master
   ```

   

