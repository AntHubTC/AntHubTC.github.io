# Jenkins安装配置

​	Jenkins的基础安装非常简单，简单来说就是将官方下载的jenkins.war包丢到tomcat下的web-apps下运行就可以了，然后接下来就是安装插件和配置其它信息了。后续就不讲在tomcat中部署jenkins了。

### 传统jenkins的安装步骤

1. 在jenkins官网下载下jenkins.war包

2. 把jenkins.war放在Tomcat解压目录/webapps目录下

3. 修改URL地址的编码解码字符集

   ```bash
   vi /opt/tomcat/conf/server.xml
   # 添加URIEncoding的编码为UTF-8
   <connector port="8080" protocal="HTTP/1.1" connetionTimeout= "20000" redirectPort="8443" URIEncoding="UTF8" />
   ```

4. 接下来就和下面是用docker容器安装jenkins差不多了

### Docker安装Jenkins的步骤

#### Docker安装Jenkins并启动

```bash
# 拉取镜像  jenkins好像是docker维护的Jenkins      jenkins/jenkins应该是jenkins维护的jenkins
docker pull jenkins/jenkins:alpine
# jenkins端口暴露使用的8081和50000
docker run -it --name=ci_jenkins -p 8081:8080 -p 50000:50000 jenkins/jenkins:alpine /bin/sh
cd /usr/local/bin
./jenkins.sh
```

jenkins:2.60.3-alpine镜像说明：

- jenkins相关命令在/usr/local/bin

- war包在/usr/share/jenkins/jenkins.war

- jenkins主目录在/var/jenkins_home

#### 启动日志信息

**第一次启动下面信息比较有用**

![1569242656621](.\img\1569242656621.png)

#### 访问Jenkins浏览器控制台

第一次启动浏览器访问效果：

![1569242745774](.\img\1569242745774.png)

#### 解锁Jenkins

将上面日志中的密码贴入下面的输入框,然后继续

![1569242893186](.\img\1569242893186.png)

#### 自定义jenkins插件

![1569243534253](.\img\1569243534253.png)

​	这一步如果你对要用到的哪些插件都比较熟悉那么久可以自己选择要装的插件，否则使用Jenkins推荐的插件，甚至点x不安装任何插件，今后用到什么再装都是可以的。

![1569243728637](.\img\1569243728637.png)

然后后续可以配置用户，也可以不建立账户继续使用admin账户都是可以的。



### 安装特别慢解决办法

镜像：

https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

http://mirror.esuni.jp/jenkins/updates/update-center.json

http://mirror.xmission.com/jenkins/updates/update-center.json

![1569295330143](.\img\1569295330143.png)

上图配置在/var/jenkins_home/hudson.model.UpdateCenter.xml文件中。  



> 改这个配置需要重启

### 遇到的问题

​	插件反复的安装失败，在后续可以在插件管理中单独对安装失败的插件再次进行安装，反复还是不能安装成功的话可以在update-center.json找到这个插件，将url复制到迅雷中去下载，然后再Jenkins中安装hpi包。

​	最后，安装插件很不容易，形成镜像:

​	docker commit -a "tc1096648786" -m "jenkins" ci_jenkins tc1096648786/jenkins


## 全局工具配置

“Manage Jenkins”-> "Global Tool Configuration" 这里配置Jenkins使用的一些工具信息。比如下面是用了Maven，然后再里面配置了一个maven信息。

![1569322792675](.\img\1569322792675.png)

如果要为这个myMaven配置镜像，可

```bash
vi /var/jenkins_home/tools/hudson.tasks.Maven_MavenInstallation/myMaven/conf/settings.xml 
```

加入镜像配置：

```xml
        <mirror>      
            <id>alimaven</id>        
            <name>aliyun maven</name>       
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>     
            <mirrorOf>central</mirrorOf>   
        </mirror>   
        <mirror>                                                                        
            <id>maven</id>                                                              
            <name>central maven</name>                                                  
            <url>http://central.maven.org/maven2/</url>                                   
            <mirrorOf>central</mirrorOf>                                                 
        </mirror> 
```

使用日志：

![1569324566373](.\img\1569324566373.png)