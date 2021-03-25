# 面试疑问



## 我们想去哪？什么样的企业有前途？

在一个上升的线做一个努力的点

技术方面跟微服务,大数据,人工智能挂钩,都是好项目

业务方面跟金融,教育,健康医疗挂钩

## 企业一般如何考核面试者的？

1,第一印象的精神面貌

2,价值观  （例如：你未来几年的规划？）

3,技术栈的匹配程度(找人部门出需求-HR筛选简历…推给我们)

4,项目背景的匹配程度(技术+业务)

## 面试最大的技巧

​	实力！实力！实力！ 平时多积累！

​	没有真实的硬功夫，其他技巧都是花架子！

## 主动权思维

​	  如果面试过程中，能够把握自己主动权，就一定要拿到主动权。用主动权展示自己的能力。

### 面试前

​		准备好简历,简历只是一个敲门砖,同时也要展现你的优势点

简历要投其所好,需要提前做功夫

1,查看所应聘的公司岗位要求(技术范围)

2,分析公司所在的产品(业务范围)

如果之前所做的项目不能跟公司的产品匹配,那最起码技术栈要符合其要求。

### 面试中

1. 自我介绍，展示你的优势点，引导面试官问你准备好的问题。
2. 面试官喜欢的询问方式

**谈谈对某某技术的认识？**

​		针对现状存在什么问题,表达为什么用?(痛点),新技术方案是什么?及如何使用这三个角度把技术串起来回答

**还有吗？三连问**

如果回答不上了，就是说：我现在可能不起那么多东西了，能不能问一个具体的问题看我能不能答。

**额外建议**

建议:遇到不会的问题,不要耍小聪明,直接干脆回答之前工作没接触过。

建议:要坚定自己的技术方案,不要朝令夕改。

### 面试后-迭代闭环思维

1. 罗列面试中遇到的问题
2. 重新组织好回答，变成你的语言

### 好钢用在刀刃上

关注高频的问题+记录下其他问题

## 公司组织结构篇

### 公司的规模有多大？公司的主营产品有哪些？

天眼查企业、及公司的网站、招聘信息

### 团队的人员配比如何？

职能维度

1. 产品经理(需求分析员),原型图(关注业务流程)

2. 设计(原型图-》美感)

3. H5(设计图稿-》页面), Android,os

4. 后端团队(Java)

5. DBA

6. 测试团队(黑盒测试(测试用例)+白盒测试)

7. 运维团队(部罟上线)

   

   产品维度

   后端人员作为全局 leader

   产品经理1人

   UI 1人

   H5 2人

   java 4-6人

   测试 1-2人

   运维 2人

### 公司采用什么什么样的开发模式？前后端如何对接？

前后端分离的模式，后端复制接口开发。

接口文档（1、URL，2、请求方式，3、请求参数，4、返回参数，5、示例）

**一般采用swagger生成接口文档。**



## 服务篇

### 谈谈我们为什么要做服务化？

高井发系统架构的目标:高可用,高性能,高可扩展性

**单体架构:**

特点:适合小成本快速试错,模块之间的调用,是进程内的通信

**微服务架构:**

特点:适合业务复杂的拆分场景,更灵活做子系统升级等等,系统的之间通信,变成为进程间的通信

### 服务拆分的原则

一般我们根据业务的边界来拆分+共性的基础服务(短信,邮件,日志)
