# Postman之Newman命令执行测试环境搭建

官网有[文档介绍](https://learning.getpostman.com/docs/postman/collection_runs/command_line_integration_with_newman/);

## Newman简介

​		Newman：是一款基于Node.js开发的工具，作为Postman的命令行运行器，Newman可直接从命令行运行和测试Postman集合。它以可扩展性为基础构建，便于将其与持续集成服务器进行集成并构建系统。

​		Postman中的“Collection Runner”就需要安装Postman Newman工具。

## Newman应用环境搭建

安装环境所需：

- Node.js (不作介绍)
- npm/cnpm(不作介绍)
- newman

### 安装newman

```bash
# 以全局方式安装Newman，使其在系统中任意位置都可使用
npm install -g newman
# 查看安装的Newman版本
# newman-reporter-html是newman将结果导出html报告使用的工具
npm install -g newman-reporter-html
```

安装好newman之后，在Postman中的“Collection Runner”就可以使用了。

## Postman导出集合

![img](.\img\4866277-92a86ca9417a70ce.webp)

## Newman命令执行测试

```bash
newman run Postman_API_test.postman_collection.json -d data.json -r html
```


| 操作命令 | 作用                                                  |
| -------- | ----------------------------------------------------- |
| run      | 代表要执行的Postman脚本，即所导出的集合               |
| -d       | 表示要执行的数据，即其前导入Postman的json数据/csv数据 |
| -r       | 所生成的测试报告类型，如：html格式，json格式等        |

newman  -h 查看常用的[option]

newman run -h

![1570844857964](.\img\1570844857964.png)

​		在使用的时候根据实际情况选用参数，比如：在使用带参数的接口的时候，如果参数不能再数据文件中获取到，那么就要使用postman中配置好的环境变量。这个时候就要使用postman提供的环境变量导出功能将环境变量导出为文件，然后使用newman的-e或者-g(全局)参数选项。

## 测试报告

执行命令后，会生成一个newman文件夹，其内含有所生成的html测试报告。

![img](.\img\4866277-96c3f75e3a2ac577.webp)

Newman Report包含执行的概况（迭代次数、请求数、脚本数、断言数、失败数目、持续时长、总接受数据、平均响应时间）和具体每个API的执行情况

![img](.\img\4866277-a56a084d2a655904.webp)

除了支持html格式的报告生成，Newman还支持cli（默认），json等格式的报告

```bash
//方式1
newman run Postman_API_test.postman_collection.json -d data.json -r cli
//方式2 (默认cli格式)
newman run Postman_API_test.postman_collection.json -d data.json
```

![img](.\img\4866277-d50c51fa9e428b29.webp)

![img](.\img\4866277-e10527ff2227a7bd.webp)

```bash
# json格式
newman run Postman_API_test.postman_collection.json -d data.json -r json
```

![img](.\img\4866277-146a0b917ef86137.webp)





**提示**：以上所述的内容搭建自动化持续部署测试的基础，后面我会将整理一篇《Postman+Newman+jenkins持续集成部署测试》放在Jenkins的文档中去。



文档参考：

https://www.jianshu.com/p/b70ff4ffb4fc