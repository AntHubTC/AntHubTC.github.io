# ClassPathXmlApplicationContext上下文初始化



## 简单流程

![image-20211118143940546](img/ClassPathXmlApplicationContext/image-20211118143940546.png)

setConfigLocations中会将configLocations经过属性${}解析操作，如果内部有属性值会被替换。

## 刷新上下文refresh

1. prepareRefresh准备上下文刷新： 
   1）初始化属性资源，如果是Servlet类的容器，会初始化Servlet的配置属性。
   2）验证配置环境中设置了必须的属性
   3）再上下文中注册添加早期的应用程序监听器org.springframework.context.ApplicationListener。
2. 

