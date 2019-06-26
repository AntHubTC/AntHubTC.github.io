# 脚本支持

​	es中有内置的脚本支持，可以基于脚本实现复杂的操作。

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

