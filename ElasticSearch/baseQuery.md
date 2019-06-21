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

```bash
# 控制返回文档中只包含name
GET /lib3/_search
{
  "_source": "name", 
  "query": {
    "match_all": {}
  }
}
GET /lib3/_search
{
  "_source": ["name", "age"], 
  "query": {
    "match_all": {}
  }
}
# 包含includes和排除excludes，两者一般只同时出现一个
GET /lib3/_search
{
  "_source": {
    "includes": "na*",
    "excludes": [ "address", "interests"]
  }, 
  "query": {
    "match_all": {}
  }
}
```

**order排序**

​	asc升序   desc降序

```bash
GET /lib3/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "age": {
        "order": "asc"
      }
    }
  ]
}
```

**前缀匹配查询**

```bash
# 前缀匹配
GET /lib3/_search
{
  "query": {
    "match_phrase_prefix": {
      "name": "zhao"
    }
  }
}
```

**范围查询**

range:实现范围查询

参数： from, to, include_lower, include_upper, boost

include_lower: 是否包含范围的左边界， 默认是true

include_upper: 是否包含范围的右边界，默认是true

```bash
GET /lib3/_search
{
    "query": {
      "range": {
        "age": {
          "from": 10,
          "to": 20,
          "include_lower": true,
          "include_upper": true
        }
      }
    }
}
# 这个是Kibana提示的语法，估计上面的方式官方不推荐
GET /lib3/_search
{
    "query": {
      "range": {
        "age": {
          "gte": 10,
          "lte": 20
        }
      }
    }
}
```

### wildcard查询

允许使用通配符*和?来进行查询

*