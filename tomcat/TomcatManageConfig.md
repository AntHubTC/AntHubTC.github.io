# Tomcat管理配置

​		从早期的 Tomcat版本开始。,就提供了Web版的管理控制台,他们是两个独立的Web应用,位于 webapps目录下。 Tomcat提供的管理应用有用于管理的Host虚拟主机的host- manager和用于管理Web应用的manager。

## host-manager

​		Tomcat启动之后，可以通过 http://localhost:8080/host-manager/html 访可该Web应用。host- manager默认添加了访问权限控制，当打开网址时，需要输入用户名和密码(conf/ tomcat- users.xml中配置)。所以要想访问该页面，需要在conf/ tomcat- users.xam1中配置，并分配对应的角色：

1. admin-gui：用于控制页面访问权限
2. admin-script：用于控制以简单文本形式进行访问

配置如下：

```xml
<role rolename="admin-gui"/>
<role rolename="admin-script"/>
<user username="itcast" password="itcast" roles="admin-script,admin-gui"/>
```

登录：

![登录HostManager](.\img\1571107031661.png)

管理界面：

![1571107094188](.\img\1571107094188.png)



## manager

​		manager的访问地址为http://localhost:8080/manager，同样，manager也添加了页面访问控制，因此我们需要为登录用户分配角色为：

```xml
<role rolename="manager-gui"/>
<role rolename="manager-script"/>
<user username="itcast" password="itcast" roles="admin-script,admin-gui,manager-gui,manager-script"/>
```

界面：

![Tomcat Web App Manager](.\img\1571107579469.png)

![1571107797905](.\img\1571107797905.png)



**server-status**

![1571108054946](.\img\1571108054946.png)