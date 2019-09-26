# Jenkins+SVN持续集成部署

## 环境准备

### 系统结构总述

- 创建虚拟机安装Linux系统  （这里将的是将他们放在不同机器上）
  - Subversion服务器
  - Jenkins服务器
  - web服务容器所在服务器
- 版本控制系统子系统
  - Subversion服务器
  - 项目对应版本库
  - 版本库中钩子程序
- 持续集成子系统
  - JDK
  - Tomcat
  - Maven
  - Jenkins
    - 主体程序
    - SVN插件
    - maven插件
    - Deploy to Web Container插件
- 应用发布子系统
  - JDK
  - Tomcat

> ​	本文档练习是使用docker来搭建测试环境的，当然也可以使用虚拟机来搭建也是可以的，在持续集成这块操作基本是相同的。

**本文档要完成下图中的自动化构建部署过程：**

![1569227138996](.\img\1569227138996.png)

### 版本控制系统子系统环境

```bash
# 这里我同样使用别人构建好的docker镜像，svn-server的具体安装就不从开始安装具体细说，如果从头搭建svn server可以参考网络其它文档。
# 由于我是搭建一个测试CI的这么一个系统，我就没有将SVN仓库挂出来。
# 完整命令： docker run --privileged=true --restart always --name ci_svnserver -d -v /home/svn:/var/opt/svn -p 3690:3690 garethflowers/svn-server
#	--privileged=true                  授予容器管理员权限，预防创建svn创库时提示权限不足
#    --restart always                    设置容器随宿主机开机自启
#    --name svn-server               设置容器name为svn-server，可自定义
#    -d                                         指定这个容器后台运行
#    -v /home/svn:/var/opt/svn    挂载宿主目录到容器目录

docker run -it --restart always --name ci_svnserver -p 3690:3690 garethflowers/svn-server /bin/sh
cd /var/svn
which svnadmin  # 检查svn命令
mkdir svnRespository
cd svnRespository/
svnadmin create apple
cd apple/conf/


vi svnserve.conf
# ========start==========
anon-access = none  # 特别提示：svnserve.conf文件中anon-access一定要打开注释并设置为none。 不允许匿名访问
auth-access = write 
password-db = passwd # 管理密码的
authz-db = authz # 管理授权的
:wq
# ========end==========


vi passwd # 用户密码配置
# ========start==========
[users]
tangcheng = 123456
:wq
# ========end==========

vi authz
# ========start==========
[/]
tangcheng = rw  # 这个账号读写权限
* =    # 其它账号没有任何权限
# ========end==========

svnserve -d -r /var/svn/svnRespository  # 默认端口3690
ctrl+p
ctrl+q
# 这时候，这个svn服务就可以使用了 svn://192.168.56.2:3690/apple
```

### 持续集成子系统环境

​	持续集成系统[参考这里](Jenkins_installConfig)。

### 应用发布子系统环境

```bash
# 拉取一个tomcat镜像下来
docker pull tomcat:7.0-jre8-alpine
# 新建启动一个容器
docker run -it --name=ci_tomcat -p 8080:8080 tomcat:7.0-jre8-alpine /bin/sh
# 启动后，默认工作目录在/usr/local/tomcat中
cd conf
vi tomcat-users.xml # 由于后面Jenkins会操作tomcat，需要用户密码才能，所以这里要创建用户
# =========tomcat-users.xml start=============
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<role rolename="manager-jmx"/>
<role rolename="manager-status"/>
<user username="tomcat_user" password="123456" roles="manager-gui,manager-script,manager-jmx,manager-status"/>
:wq
# =========tomcat-users.xml end=============
cd ../bin
./startup.sh
ctrl+p
ctrl+q  # 退出容器，并将容器变为守护式容器
# 这个时候访问映射的8080端口，就可以访问到容器中运行的tomcat服务。
curl 127.0.0.1:8080
# 也可以浏览器打开tomcat网页192.168.56.2:8080 在页面上你可以试一试那个准备的用户
```

## 准备部署的web工程

​	准备一个简单的web工程，并将这个工程提交到svn://192.168.56.2:3690/apple上。

![1569323126265](.\img\1569323126265.png)

## Jenkins配置任务

1. “jenkins” -> "New Item"，新建一个名为“apple”的“Freeestyle project”类型的任务项，然后“OK”。

2. 配置任务项的源代码从svn中检出：

   ![1569323488137](.\img\1569323488137.png)

3. 添加Maven构建步骤, 然后点击“save”

   ![1569323547694](.\img\1569323547694.png)

4. 然后在任务面板中点击新增的apple项。

   该面板中的workspace在没有第一次构建之前点进去是要报错的。

   ![1569323653593](.\img\1569323653593.png)

5. 点击“Build Now”，在构建任务中可以通过“Console Output”查看构建过程中产生的日志。

![1569323784942](.\img\1569323784942.png)

构建完毕后

![1569324801730](.\img\1569324801730.png)

在/var/jenkins_home/workspace/apple/target就能看见构建好的war包。

```bash
~/workspace/apple/target $ ls
apple  apple.war  classes  generated-sources  maven-archiver  maven-status
```

在workspace中也能找到构建好的war包

![1569324732149](.\img\1569324732149.png)

现在，我们已经可以通过jenkins任务将代码从远程仓库拉取到本地，并且将代码打成war包了，接下来就是将war包部署到容器中去。

## 继续配置Jenkins任务

添加“**Post-build Actions**”构建后的动作中选择“Deploy war/ear to a container”项。

> 注意，需要安装“Deploy to container”插件这个菜单中才会有这一项。

![1569325234941](.\img\1569325234941.png)

填入war包相关信息，然后部署的容器选择tomcat的对应版本。

![1569326215461](.\img\1569326215461.png)

添加tomcat访问凭证。

![1569326076722](.\img\1569326076722.png)

然后点击“save”。

然后重新对jenkins进行“Build Now”重新构建之后，那么war构建的结果应该就部署到tomcat中去了。

![1569326375753](.\img\1569326375753.png)

访问我们部署的网页: http://192.168.56.2:8080/apple/

![1569326411565](.\img\1569326411565.png)

## 远程触发Jenkins任务构建

继续配置上面的任务，从下图可以看到Jenkins提供很多中触发器，这里我们使用通过远程URL来触发任务。

在Authentication Token中填入验证的令牌，然后保存。这个时候我们就可以通过访问http://192.168.56.2:8081/job/apple/build?token=ABC_ABC_ABC_CBA 来启动任务，可以使用另一个浏览器访问试一下看下效果。

![1569326759505](.\img\1569326759505.png)

通过上面配置，这个时候知道怎么通知Jenkins了，接下来就是需要在svn中编写钩子程序来调用这个url。



## 编写svn钩子程序

​		在svn服务器上/var/svn/svnRespository/apple/hooks目录下存放的是在svn不同情况下触发的钩子脚本，其中post-commit.tmpl是表示在代码提交后执行的脚本，这个tmpl文件中在linux系统下可以使用linux的shell脚本去编写。

使用linux中的curl命令去访问地址。

```bash
# 在apline中(如果没有可以安装一下)
apk add curl
```

-X参数：指定请求方式

-v参数：显示响应结果

-u参数：携带用户名/密码

-H参数：携带请求消息头信息

curl -X post -v -u [Jenkins用户名]:[Jenkins用户密码] -H "请求消息头信息" http://[服务器ip地址]:[服务器端口]/job/[Jenkins项目名称]/build?token=[身份验证令牌]



将以下内容添加到post-commit中去，注意没有sh结尾的扩展名。

```bash
cp post-commit.tmpl post-commit  # 注意没有sh结尾的扩展名
# ================start====================
#!/bin/sh                                                     
# tirgger jenkins build task item                                    
curl -X post -v -u tc:123456 http://192.168.56.2:8081/job/apple/build?token=ABC_ABC_ABC_CBA
:wq
# ================start====================
chmod 755 post-commit # 注意加权限，否则是不能执行的
# 编写好后不用重启，这个时候就可以测试了。
```

## 测试验证

将代码改一改然后提交

![1569328728112](.\img\1569328728112.png)

​		提交后，能在jenkins控制台构建队列中会多出一项构建任务，直到完成，然后再访问tomcat部署的网页查看，已经能看到最新的代码变动了：

![1569328802650](.\img\1569328802650.png)

## 补充

​	如果发生Jenkins服务器从SVN服务器下载代码部署最新版的情况，那么久在SVN服务器的URL地址后加上@HEAD强制要求下载最新版。

![1569472340372](.\img\1569472340372.png)