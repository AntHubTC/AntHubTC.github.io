# 遇到的问题

1. jmeter问题-关于http请求返回数据中文乱码解决方

   http请求除了中文地方乱码，其他都返回正确

   http请求页面，配置了 content encoding 为UTF-8，但还是为乱码

   改配置文件**jmeter.properties 文件**

   **找到#sampleresult.default.encoding=ISO-8859-1**

   **将注释去掉,改成如下:**

   **sampleresult.default.encoding=UTF-8**

   如果上面还不行，试一试下面的：

   在**http信息头管理器里**

   配置了 content-Type ：application/x-www-form-urlencoded**;charset=utf-8**

    