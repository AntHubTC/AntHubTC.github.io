# Query查询

## 准备数据

```bash
PUT /lib3
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
        "name": {"type": "text"},
        "address": {"type": "text"},
        "age": {"type": "integer"},
        "interests": {"type": "text"},
        "birthday": {"type": "date"}
      }
  }
}

PUT /lib3/_doc/1
{
  "name": "zhaoliu",
  "address": "hei long jiang sheng tie ling shi",
  "age": 50,
  "birthday": "1970-12-12",
  "interests": "xi huan hejiu,duanlian,lvyou"
}
PUT /lib3/_doc/2
{
  "name": "zhaoming",
  "address": "bei jing hai dian qu qing he zhen",
  "age": 20,
  "birthday": "1998-10-12",
  "interests": "xi huan hejiu,duanlian,changge"
}
PUT /lib3/_doc/3
{
  "name": "lisi",
  "address": "bei jing hai dian qu qing he zhen",
  "age": 23,
  "birthday": "1998-10-12",
  "interests": "xi huan hejiu,duanlian,changge"
}
PUT /lib3/_doc/4
{
  "name": "wangwu",
  "address": "bei jing hai dian qu qing he zhen",
  "age": 26,
  "birthday": "1995-10-12",
  "interests": "xi huan biancheng,tingyinyue,lvyou"
}
PUT /lib3/_doc/5
{
  "name": "zhangsan",
  "address": "bei jing chao yang qu",
  "age": 29,
  "birthday": "1998-10-12",
  "interests": "xi huan tingyinyue,changge,tiaowu"
}
```



## 简单查询

```bash
# 搜索名字是lisi的文档
GET /lib3/_search?q=name:lisi
# 搜索兴趣有changge，并且排序按照年龄降序
GET /lib3/_search?q=interests:changge&sort=age:desc
```

理解返回数据结构：

```json
{
  "took" : 5,  // 这个表示耗时
  "timed_out" : false, // 是否超时
  "_shards" : { // 分片
    "total" : 3, // 3分片
    "successful" : 3, // 成功3个分配
    "skipped" : 0, // 跳过数量
    "failed" : 0 // 失败数量
  },
  "hits" : {
    "total" : { // 查询出的文档个数
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null, // 当前搜索相关度的匹配分数 值最大为1
    "hits" : [
      {
        "_index" : "lib3", //索引
        "_type" : "_doc", // 类型
        "_id" : "5", // 文档id
        "_score" : null, // 当前搜索相关度的匹配分数 值最大为1
        "_source" : { // 文档对应的值
          "name" : "zhangsan",
          "address" : "bei jing chao yang qu",
          "age" : 29,
          "birthday" : "1998-10-12",
          "interests" : "xi huan tingyinyue,changge,tiaowu"
        },
        "sort" : [
          29
        ]
      },
      {
        "_index" : "lib3",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : null,
        "_source" : {
          "name" : "lisi",
          "address" : "bei jing hai dian qu qing he zhen",
          "age" : 23,
          "birthday" : "1998-10-12",
          "interests" : "xi huan hejiu,duanlian,changge"
        },
        "sort" : [
          23
        ]
      },
      {
        "_index" : "lib3",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : null,
        "_source" : {
          "name" : "zhaoming",
          "address" : "bei jing hai dian qu qing he zhen",
          "age" : 20,
          "birthday" : "1998-10-12",
          "interests" : "xi huan hejiu,duanlian,changge"
        },
        "sort" : [
          20
        ]
      }
    ]
  }
}

```



## term查询terms查询

​	term query会去倒排索引中寻找确切的term，**它不知道分词器的存在**。这种查询适合keyword、numeric、date。

**term**：查询某个字段里含有某个关键词的文档。

**terms**：查询某个字段里含有多个关键字的文档。

```bash
# 查询name这个字段含有zhaoliu的文档
GET /lib3/_search
{
  "query": {
    "term": {
      "name": "zhaoliu"
    }
  }
}
#terms 可以指定多个关键词
# 查询兴趣有heijiu或changge的文档
GET /lib3/_search
{
  "query": {
    "terms": {
      "interests": ["hejiu", "changge"]
    }
  }
}
# 返回值从0开始，返回前2个文档。（可以用来分页）
GET /lib3/_search
{
  "from": 0,
  "size": 2,
  "query": {
    "terms": {
      "interests": ["hejiu", "changge"]
    }
  }
}
# 如果希望结果中含有版本号加上version
GET /lib3/_search
{
  "version": true,
  "query": {
    "terms": {
      "interests": ["hejiu", "changge"]
    }
  }
}
```

## match查询

**match** query知道分词器的存在，会对filed进行**分词操作**，然后再查询

```bash
GET /lib3/_search
{
  "query": {
    "match": {
      "name": "zhaoliu"
    }
  }
}
#会先分词再进行查询
GET /lib3/_search
{
  "query": {
    "match": {
      "name": "zhaoliu zhaoming"
    }
  }
}
GET /lib3/_search
{
  "query": {
    "match": {
      "age": 20
    }
  }
}
```

**match_all**:查询所有文档

```bash
# 查询所有文档
GET /lib3/_search
{
  "query": {
    "match_all": {
    }
  }
}
```

**multi_match**:  可以指定多个字段

```bash
# 从字段interests和name中查询含有changge的文档
GET /lib3/_search
{
  "query": {
    "multi_match": {
      "query": "changge",
      "fields": ["interests", "name"]
    }
  }
}
```

**match_phrase**:短语匹配查询

ElasticSearch引擎首先分析（analyze）查询字符串，从分析后的文本中构建短语查询，这意味着必须匹配短语中的所有分词，并且保证各个分词的相对位置不变。

```bash
# 短语查询， 单词顺序都必须一样
GET /lib3/_search
{
  "query": {
    "match_phrase": {
      "interests": "duanlian, changge"
    }
  }
}
```

**控制返回字段**