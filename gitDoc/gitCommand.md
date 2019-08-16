# git命令讲解

## git账户配置

```bash
# git 配置
git config --global # 基本不用，给整个计算机一次性设置，所有用户使用同样设置。
git config --system # 推荐，给当前计算机用户一次性设置
git config --local # 给当前项目一次性设置
# 上面三种有使用的优先级的 local > system > global

# git设置邮箱
git config --local user.name 'FallenGodCoder'
git config --local user.email '123123@qq.com'

# 删除配置信息
git config --local --unset user.name
git config --local --unset user.email
```

git账户local设置信息存放在.git/config文件中。

git账户system设置信息存放在~/.gitconfig文件中。

## git初始化本地仓库

```bash
git init # 初始化一个带工作目录的版本库
git init --bare # --bare 表示制作一个不带工作目录的纯版本库
```

## 添加文件到版本

```bash
git add 文件

# 下面是技巧说明： 比如说aa目录下我们修改很多个文件都是要添加的，这个时候我们可以使用以下方法，防止多次add
cd aa
git add .
```

## 暂存区移到工作区

```bash
git reset head <文件>...
# 或者使用
git rm --cached
```

## 撤销文件更改

```bash
git checkout -- 文件名称
```

## 提交文件

```bash
git commit -m '这里是提交的注释'
```

## 删除已提交文件

删除之后， 文件会被放到暂存区, 相当于给这个文件打了个标记，然后使用commit命令就彻底删除了。

```bash
git rm 文件
```

使用git rm命令和直接再操作系统里面del文件有什么不一样， 在操作系统里面del文件，该文件在git中没有放到暂存区中去，要使用git add一次文件才会将删除的文件添加到暂存区，然后再使用commit命令就从本地仓库中删除了。

**git 入门逆向操作：**

```bash
# 暂存区恢复到工作区
git reset head 文件
# 文件已经恢复到工作区，但是还是删除状态
# 重新检出该文件
git checkout -- 文件

# 上面这些命名其实使用git status查看文件状态的时候，会有提示你使用什么命令的。
```

## 查看管理的文件的状态

```bash
git status
```

## 重命名文件

重命名的本质操作是两个操作，先原来的文件复制一份改名添加到暂存区，然后将将原来那一份文件从暂存区删除。

```bash
git mv 文件名1  文件名2
git commit -m “重命名文件”
```

## 查看日志

```bash
git log 
git log -最近的次数    # 显示最近几次提交的日志信息
git log --stat      # 仅显示摘要选项
git log --pretty=oneline        # 定制记录格式
git log --pretty=format:"%h - %an , %ar : %s"
git log --graph     # 图像化分支和版本更新
```

## 创建密钥对

```bash
ssh-keygen -t rsa
# -t 指定密钥类型，默认是 rsa ，可以省略。
# -C 设置注释文字，比如邮箱。
# -f 指定密钥文件存储文件名。
# 还有其它参数，可以在网络上搜索学习

# 完毕后，在用户目录下有一个.ssh文件夹，里面存放了生成好的公钥和私钥
```

## 添加并推送远程仓库

```bash
# origin只是远程仓库的一个代号/标识
git remote add origin git@github.com:FallenGodCoder/learnGit.git
git push -u origin master
```

## 克隆远程仓库

```bash
git clone git@github.com:FallenGodCoder/learnGit.git
```

## 曾经提交的日志重写

```bash
# 修正最近一次的注释
git commit --amend -m '修正注释'

```

## git忽略文件

```bash
# 添加一个.gitignore文件
touch .gitignore
# 配置文件内容
vi .gitignore
# #注释
# 直接写文件可以忽略对应的文件
# 通配符
#      *任意字符
#      !排除文件
#      目录/ 目录中所有文件
#      dir/*.txt
#      dir/*/*.txt
#      dir/**/*.txt 任意级别目录
```

> 空目录：默认git就是忽略的

## git命令帮助

```bash
# git 基础帮助
git help
# 下面两个命令的结果内容可以使用git help 命令查看帮助，会打开一个网页
git help -a
git help -g
#例如add命令
git help add
# 从打开的网页看出，每一个命令的参数其实是特别多的，不过我们记住常用的就可以了。
```

![1565937432032](.\img\1565937432032.png)