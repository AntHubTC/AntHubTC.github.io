# Filter查询

filter是不计算相关性的，同时可以cache。 因此， filter速度要快于query查询

## 数据准备

```bash
POST /lib6/_bulk
{"index": {"_id": 1}}
{"price": 40, "itemID": "ID100123"}
{"index": {"_id": 2}}
{"price": 50, "itemID": "ID100124"}
{"index": {"_id": 3}}
{"price": 25, "itemID": "ID100125"}
{"index": {"_id": 4}}
{"price": 30, "itemID": "ID100126"}
{"index": {"_id": 5}}
{"price": null, "itemID": "ID100127"}
```

## 过滤查询

```bash
GET /lib6/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": {
          "price": 40
        }
      }
    }
  }
}

GET /lib6/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "terms": {
            "price": [25, 40]
          }
        }
      ]
    }
  }
}

GET /lib6/_search

# 为什么查询不出来，因为我们是使用动态映射创建的，ElasticSearch默认对text是开启分词的，所以查询不出来。使用id100123可以查询出来，是因为是转换成消息存储的。 可以手动建立mapping将index指定为false，表示不进行分词。
GET /lib6/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "itemID": "ID100123"
          }
        }
      ]
    }
  }
}

GET /lib6/_mapping
```

## bool过滤查询

可以实现组合过滤查询

格式：

{"bool": {"must": [],  "should": [], "must_no": []}}

must：必须满足的条件---and

should：可以满足也可以不满足的条件--or

must_not： 不需要满足的条件--not

```bash

# 价格是25或者itemID为1d100123, 一定不能有价格为30的文档
GET /lib6/_search
{
  "query": {
    "bool": {
      "should": [
        {"term": {"price": 25}},
        {"term": {"itemID": "id100123"}}
      ],
      "must_not": [
        {"term": {"price": 30}}
      ]
    }
  }
}
```

**bool嵌套**

​	类似and和or使用括号嵌套。

```bash

# 价格是25或者itemID为1d100123, 一定不能有价格为30的文档
GET /lib6/_search
{
  "query": {
    "bool": {
      "should": [
        {"term": {"itemID": "id100123"}},
        {
          "bool": {
            "must": [
              {"term": {"price": 40}},
              {"term": {"itemID": "id100124"}}
            ]
          }
        }
      ]
    }
  }
}
```



## 范围过滤

gt; >

lt; >

gte; >=

lte; <=

```bash
GET /lib6/_search
{
  "query": {
    "range": {
      "price": {
        "gt": 25,
        "lt": 50
      }
    }
  }
}
```



## 非空exists

```bash
GET /lib6/_search
{
  "query": {
    "bool": {
      "filter": {
        "exists": {
          "field": "price"
        }
      }
    }
  }
}
```

## 多index，多type查询

```bash
GET _search  查询所有
GET /lib3/_search
GET /lib3,lib4/_search
GET /*3,*4/_search
GET /lib3/user/_search    区分老版本
GET /lib3/user,items/_search 
GET /lib3,lib4/user,items/_search
GET /_all/_search 查询所有
GET /_all/user,items/_search
```

