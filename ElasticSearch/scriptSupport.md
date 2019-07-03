# 脚本支持

​	es中有内置的脚本支持，可以基于脚本实现复杂的操作。

​	ElasticStack在升级到5.0版本之后，带来了一个新的脚本语言，painless。这里说“新的“是相对与已经存在groove而言的。还记得Groove脚本的漏洞吧，Groove脚本开启之后，如果被人误用可能带来各种漏洞，为什么呢，主要是这些外部的脚本引擎太过于强大，什么都能做，用不好或者设置不当就会引起安全风险，基于安全和性能方面，所以elastic.co开发了一个新的脚本引擎，名字就叫Painless，顾名思义，简单安全，无痛使用，和Groove的沙盒机制不一样，Painless使用白名单来限制函数与字段的访问，针对es的场景来进行优化，只做es数据的操作，更加轻量级，速度要快好几倍，并且支持Java静态类型，语法保持Groove类似，还支持Java的lambda表达式。

​	网上有一篇专门介绍painless的博客 [elasticsearch painless最强教程](https://blog.csdn.net/u013613428/article/details/78134170/)

## 基于groovy脚本执行partial update

1.  修改年龄

   ```bash
   GET /lib3/_doc/4
   
   # 修改年龄
   POST /lib3/_update/4
   {
     "script": "ctx._source.age+=1"
   }
   ```

2. 修改名字

   ```bash
   # 修改名字
   POST /lib3/_update/4
   {
     "script": "ctx._source.name+=' hehe'"
   }
   ```

3. 添加爱好

   ```bash
   # 添加爱好  (前提：interests是数组)
   POST /lib3/_update/4
   {
     "script": {
       "source": "ctx._source.interests.add(params.tag)",
       "params": {
         "tag": "picture"
       }
     }
   }
   ```

4. 删除爱好

   ```bash
   # 删除爱好
   POST /lib3/_update/4
   {
     "script": {
       "source": "ctx._source.interests.remove(ctx_source.interests.indexOf(params.tag))",
       "params": {
         "tag": "picture"
       }
     }
   }
   ```

5. 删除文档

```bash
# 删除文档
POST /lib3/_update/4
{
  "script": {
    "source": "ctx.op=ctx._source.age==params.count?'delete':'none'",
    "params": {
      "count": 29
    }
  }
}
```

6.upsert操作

​	如果文档不存在会进行upsert初始化， 如果文档存在执行script中的操作。

```bash
GET /lib3/_update/4
{
  "script": "ctx._source.age+=1",
  "upsert": {
    "first_name": "Jane",
    "last_name": "Lucy",
    "age": 20,
    "about": "I like to collect rock albums",
    "interests": [
      "music"
    ]
  }
}
```

