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
# 拉取镜像  这里是使用的alpine版本的。 allpine系统大小很小 
docker pull jenkins:2.60.3-alpine
# jenkins端口暴露使用的8081和50000
docker run -it --name=ci_jenkins -p 8081:8080 -p 50000:50000 jenkins:2.60.3-alpine /bin/sh
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

