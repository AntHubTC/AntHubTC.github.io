# flowable UI



## 下载资源

​	百度云盘 [下载地址](https://pan.baidu.com/s/14y6sqBNnO2jPxAeXHQq3gA?pwd=3qdj) 提取码:3qdj      热心网友分享的

## 资源说明

-- database 包含各种的数据库sql全量以及各版本的增量sql

-- docs floable的java doc文档

-- libs flowable的相关jar包，如果使用maven管理，那么这个就用不上了

-- wars 可以运行的jar包

​	-- flowable-ui 流程UI设计器

​	-- flowable-rest.war 可以使用rest api的接口访问形式操作flowable

![img](img/flowableUI/webp.webp)



## 安装部署

> 网络上好多是将war包放到Tomcat下启动的，这里通过jar启动感觉更方便一点。

```bash
java -jar flowable-ui.war
```

![image-20240426210433836](img/flowableUI/image-20240426210433836.png)

启动后，看关键字眼

```
o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path '/flowable-ui'
```

访问： http://localhost:8080/flowable-ui

![image-20240426211042909](img/flowableUI/image-20240426211042909.png)

输入默认的**账号/密码**：admin/test

![image-20240426211025887](img/flowableUI/image-20240426211025887.png)