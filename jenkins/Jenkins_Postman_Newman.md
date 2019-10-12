# Jenkins+Postman+Newman持续接口回归测试

​		详细流程就不一一说明了，网上有很多教程，大体上来说就是Postman中导出现有的测试接口道json文件中，然后在jenkins中配置任务来执行Newman命令来执行这些接口请求。

所以也可以构造这样的流程：

​		本地==》SVN==》SVN钩子==》jenkins==》newman执行接口json==》得到测试报告    后续还可以项办法做一些将测试报告发到邮箱之类的操作。

参考文档：

​		[Jenkins+Postman持续集成搭建及使用](https://blog.csdn.net/u013440574/article/details/82708600)

​		[postman+jenkins+newman做接口测试的持续集成](https://blog.csdn.net/qq_41868500/article/details/87286273)

