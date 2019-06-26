## 文档的核心元数据

1. _index

   说明了一个文档存储在哪个索引中

   同一个索引下存放的是相似的文档(文档的field多数是相同的)

   索引名必须是小写的,不能以下划线开头,不能包括逗号

2. _type (7.x开始已经移除)

   表示文档属于索引中的哪个类型

   一个索引下只能有一个type

   类型名可以是大写也可以是小写的,不能以下划线开头,不能包括逗号

3. _id

   文档的唯一标识,和索引,类型组合在一起唯一标识了一个文档

   可以手动指定值,也可以由es来生成这个值

## 文档id生成方式

1. 手动指定

   PUT /inex/type/66

   通常是把其它系统的已有数据导入到es中。

2. 由es生成id值

   POST /index/type

   es生成的id长度为20个字符，使用的是base64编码，URL安全，使用的是GUID算法，分布式下并发生成id时不会冲突。

## _source元数据分析

其实就是我们在添加文档时request body中的内容

指定返回的结果含有哪些字段

GET /index/_doc/1?_source=name

## 改变文档内容原理解析

替换方式：

1. 全部替换

   PUT /lib/user/4

   {

   ​     .....

   }

   ![1561514586174](./img/1561514586174.png)

	es内部会将原来的文档标记为删除状态，使用新的文档，es会在合适的时间将标记为delete的文档进行删除。

2. 部分替换

POST  /lib/user/4/_update

{

​     'doc': {

​		some field....

​	}

}

![1561514755818](./img/1561514755818.png)

post方式发生并发索冲突的可能性降低。使用上更新使用post比put好。

3. 删除文档

   将文档标记为delete状态，es在合适的时间会将该文档删除。

## 更新文档对并发问题的处理

​	当出现并发问题的时候，es内部是使用乐观锁，使用version来解决并发所问题。

**retry_on_conflict**

​	如果更新失败，会重新获取文档数据和版本信息进行更新，retry_on_conflict表示重试次数。

```
POST /lib3/_update/4>retry_on_conflict=3&version=5
```



## 文档数据路由原理

1. 文档路由到分片上

   ​	一个索引由多个分片构成，当添加、删除、修改一个文档时，es就需要决定这个文档存储在那个分片上，这个过程就称为数据路由(routing)。

2. 路由算法

   > shard=hash(routing) % number_of_primary_shards

   示例：一个索引，3个primary shard
   (1). 每次增删改查时，都有一个routing值，默认是文档的_id值；

   (2). 对这个routing值使用哈希函数进行计算；

   (3). 计算出的值再和主分片个数取余数。余数肯定在. 0----(number_of_primary - 1)之间，文档就在对应的shard上。

   routing值默认是文档的_id的值，也可以手动指定一个值，手动指定对于负载均衡以及提高批量读取的性能都有帮助。

3. primary shard个数一旦确定就不能修改了。

## 文档操作ES内部原理

![1561520741830](./img/1561520741830.png)

##  写一致性原理和quorum机制

1.  任何一个增删改操作都可以跟上一个参数consistency

   可以给该参数指定的值：

   ​	one：（primary shard）只要有一个primary shard是活跃的就可以执行。

   ​	all：（all shard）所有的primary shard和replica都是活跃的才能执行。

   ​	quorum：（default）默认值，大部分shard是活跃的才能执行（例如共有6个shard，至少有3个shard是活跃的才能执行写操作）。

2. quorum机制：多数shard都是可用的

   int((primary + number_of_replica)/2) + 1

   例如：3个primary shard，1个replica，就是int((3+1)/2)+1=3，至少3个shard是活跃的。

   注意：可能出现shard不能分配齐全的情况。

   比如： 1个primary shard，1个replica，就是int((1+1)/2)+1=2，但是如果只有一个节点，因为primary shard和replica不能再一个节点上，所以仍然不能进行写操作。

   再举例：1个primary shard，3个replica， 2个节点，就是int((1+3)/2)+1=3

   最后：当最活跃的shard的个数没有达到要求时，es默认会等待一分钟，如果在等待的期间活跃的shard的个数没有增加，则显示timeout。

   put /index/_doc/id?timeout=60s    注意加上时间单位



## 文档查询内部原理

**第一步**：查询请求发给任意一个节点,该节点就成了coordinating node协调节点，该节点使用路由算法算出文档所在的 primary shard。

**第二步**：协调节点把请求转发始 primary shard也可以转发给 replica shard(使用轮询调度算法( Round- Robin Scheduling），把请求平均分配至 primary shard和 replica shard)；

**第三步**：处理请求的节点把结果返回给协调节点，协调节点再返回给应用程序

**特殊情况**：请求的文档还在建立素引的过程中, primary shard上存在,但 replica shard上不存在,但是请求被转发到了 replica shard上,这时就会提示找不到文档。



## 查询结果分析

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 3,
    "successful" : 3,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.2876821,
    "hits" : [
      {
        "_index" : "lib3",
        "_type" : "_doc",
        "_id" : "5",
        "_score" : 0.2876821,
        "_source" : {
          "name" : "zhangsan",
          "address" : "bei jing chao yang qu",
          "age" : 29,
          "birthday" : "1998-10-12",
          "interests" : "xi huan tingyinyue,changge,tiaowu"
        }
      }
    ]
  }
}
```

took: 查询耗费的时间，单位是毫秒。

_shards: 共请求了多少个shard。

total：查询出的文档总个数。

max_score：本次查询中，相关度分数的最大值，文档和此次查询的匹配度越高，_score的值越大，排位越靠前。

_score： 文档匹配度分数。

hits：默认查询前10个文档。

time_out: 是否超时，通过设置的超时时间判定。

```bash
GET /lib3/_search?timeout=10ms
```