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
# 添加到暂存区和提交合二为一  (注意：工程的第一个文件不能这么用)
git commit -am '这是提交的注释'
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
git log --graph --pretty=oneline --abbrev-commit
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

## 分支

```bash
# 查看分支
git branch
# 创建分支
git branch 新分支名称
# 切换分支
git checkout 分支名
# 删除分支(不能删除当前分支)
#   细节： 如果在分支A中进行了写操作，但此操作局限在工作区中进行（没有add和commit）。在master中能够看到该操作。 否则如果进行了commit操作，则master无法观察到此文件。
git branch -d 分支名 # 分支未合并情况下，会提示你分支有未合并内容，不能删除
# 未合并，强行删除分支 大写D
git branch -D 分支名
# 创建新分支并切换
git checkout -b 分支名
# 分支合并  下面这样使用默认是fast forward，1.两个分支fast forward归于一点commit 2.没有分支信息（丢失分支信息）
git merge new_branch # 将new_branch合并到到当前分支
# 禁止fast fast forward。 1.两个分支不会归于一点commit（主动合并的分支会前进一步） 2.分支信息完整（不会丢失分支信息）
git merge --no-ff new_branch
# 查看各个分支最近一次提交
git branch -v
# 分支重命名
git branch -m master master2
```

合并的时候使用fast forward和不使用fast forward对比（主要是否有分支信息）。

![1565940655583](.\img\1565940655583.png)

## 解决文件冲突

```bash
# 如果文件有冲突, 先将文件内容改为正确的内容
# 解决冲突
git add xxxx  # 这里没有暂存区的概念，只是告知git，冲突已解决
git commit -m "xxxx"
```

## 版本穿梭

**版本回退**

```bash
git reset --hard HEAD^  # ^表示回退一次  ^^表示回退两次 以此类推
git reset --hard HEAD~n # 回退n此
git reset --har commit的sha1值 # 通过sha1值回退到某一个commit
```

**版本前进**

```bash
git reflog # 查看记录，记录了所有的操作
git reset --har commit的sha1只  #前进到任意一次  可以帮助我们实现“后悔药”，需要借助良好的日志习惯
```

## 游离状态

```bash
# 穿梭到过去  git checkout新用法
git checkout  过去提交sha1值
# git checkout 还可以用来切换分支
git checkout mybranch
git checkout master
```

版本穿梭到过去，这个时候就进入了游离的状态。这个时候你可以做的操作：

1. 修改后、必须提交

   修改后的文件只会存在于过去，不会影响到未来，这个时候就只有创建新分支，将改变在新分支中体现，然后如果要在未来体现，只有将这个新分支再次合并到现在最新的版本中去。

2. 创建分支的好时机

   ```bash
   # 创建分支方法
   git branch mybarnchName 在过去提交的记录sha1值
   ```


## stash保存现场

​	git**建议**在一个完整的功能或子功能没有开发完毕前，不要commit。另外git规定必须在没commit之前，不能checkout切换分支，如果没有将一个功能开发完毕就要切换分支，这个时候建议： 1.保存现场（临时保存不提交，stash） 2.切换分支

​	如果不同的分支，在同一个commit阶段(意思是两个分支最新相同)，在commit之前，可以checkout切换分支。

```bash
# 保存现场
git stash
# 再切换分支
git checkout branch_name
# 切回分支
git checkout master
# 查看保存的现场列表
git stash list
# 恢复现场
git stash pop # pop 将原来保存的现场删除，用于还原现场
git stash apply # apply 还原现场，不删除保存的现场
# 删除指定某个现场
git stash pop stash@{0} # stash@{0} 是现场列表最前面那个唯一标识
git stash apply stash@{0} # stash@{0} 是现场列表最前面那个唯一标识
# 手工删除现场
git stash drop stash@{0} # stash@{0} 是现场列表最前面那个唯一标识
```

## git标签

适用于整个项目，和具体分支没有关系。

```bash
# 打标签 git tag xxxx
git tag V1.0
# 打标签方式二
git tag -a v2.0 -m "relase tag" # -m 后面跟的注释
# 查看打的标签
git tag
# 删除标签
git tag -d 标签名
# 精确查询
git tag -l "V1.0"
# 模糊查询
git tag -l "V1*"
```

## blame责任

```bash
git blame a.txt # 查看a.txt的所有提交commit sha1值，以及每一行的作者。
```

## 差异性diff

diff命令本身不是git的命令，是linux的命令。git bash的MINGW本身支持linux命令。

```bash
diff a.txt b.txt # 文件内容差异性比较
diff -u a.txt b.txt # 内容比较  结果更详细
```

diff命令比较的是文件本身

git diff命令比较的是区里面的文件

```bash
# ###########暂存区和工作区#############
git diff # 暂存区和工作区的差异

# ###########对象区和工作区#############
git diff 提交的sha1值 # 对象区和工作区的差异
# 最新对象区和工作区的差异
git diff head  # 可以使用最新的sha1值，也可以使用head，因为head就是指向最新的。

# ###########对象区和暂存区#############
git diff --cached 提交的sha1值
git diff --cached HEAD  # 比较最新的
```



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