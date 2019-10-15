# Collection Runner

## 基本使用

​		“Collection Runner”是Postman的一个批量执行接口测试的功能，用于连续发起一个测试集下的所有接口，会得到一个基于Postman界面的测试报告。

​		[官方介绍](https://learning.getpostman.com/docs/postman/collection_runs/intro_to_collection_runs)非常详细，这里不再自己做一次记录。

![img](.\img\Collection_Run_Export_Results.png)



![1570860016940](.\img\1570860016940.png)



Postman可以基于数据集的测试，在脚本中可以使用"data.key"去访问数据。

## 并发测试

​		这个只能测试一次很多次请求，不能同时测试多次多个请求。

​		将Iterations的设置为一次要并发请求的个数，将Delay设置为0ms，表示所有请求一次性发出。

​		这种并发测试主要是测试响应码是不是200，看服务是否依旧持续可以正常访问。

![img](.\img\864087-20190225223541267-337672851.png)