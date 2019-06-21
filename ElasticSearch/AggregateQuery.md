# 聚合查询aggs

## sum

```bash
# 聚合查询
# 求所有商品的总和
GET /lib6/_search
{
  "aggs": {
    "价格总和": {
      "sum": {
        "field": "price"
      }
    }
  }
}
```

## min

```bash
# 最小值
GET /lib6/_search
{
  "aggs": {
    "价格最小值": {
      "min": {
        "field": "price"
      }
    }
  }
}
```

## max

```bash
# 最大值
GET /lib6/_search
{
  "aggs": {
    "价格最大值": {
      "max": {
        "field": "price"
      }
    }
  }
}
```

## avg

```bash
GET /lib6/_search
{
  "aggs": {
    "价格平均值": {
      "avg": {
        "field": "price"
      }
    }
  }
}
```



## cardinality求基数

​	什么是基数？ `互不相同的数据的个数`

```bash
GET /lib6/_search
{
  "aggs": {
    "价格基数": {
      "cardinality": {
        "field": "price"
      }
    }
  }
}
```

## terms分组

```bash
GET /lib6/_search
{
  "aggs": {
    "价格分组": {
      "terms": {
        "field": "price"
      }
    }
  }
}
# 对那些喝酒兴趣的用户按年龄分组
GET /lib4/_search
{
  "query": {
    "term": {
      "interests": "喝酒"
    }
  },
  "aggs": {
    "喝酒的人年龄分组": {
      "terms": {
        "field": "age"
      }
    }
  }
}
# 每一组再算平均年龄， 并安装分组中的年龄进行排序。
GET /lib4/_search
{
  "query": {
    "term": {
      "interests": "喝酒"
    }
  },
  "aggs": {
    "喝酒的人年龄分组": {
      "terms": {
        "field": "age",
        "order": {
          "平均年龄": "asc"
        }
      },
      "aggs": {
        "平均年龄": {
          "avg": {
            "field": "age"
          }
        }
      }
    }
  }
}
```



## 组合查询

​	将之前学习的查询组合起来使用。

```bash
GET /lib3/_search
{
  "query": {
    "bool": {
      "must": [
        {"match": { "interests": "changge"}}
      ],
      "must_not": [
        {"match": { "interests": "lvyou"}}
      ],
      "should": [
        {"match": { "address": "bei jing"}},
        {"range": { "birthday": { "gte": "1996-01-01"}}}
      ]
    }
  }
}


GET /lib3/_search
{
  "query": {
    "bool": {
      "must": [
        {"match": { "interests": "changge"}}
      ],
      "must_not": [
        {"match": { "interests": "lvyou"}}
      ],
      "should": [
        {"match": { "address": "bei jing"}}
      ],
      "filter":{
        "bool": {
          "must": [
            {"range": {"birthday": {"gte": "1996-01-01"}}},
            {"range": {"age": {"gt": 23 }}}
          ],
          "must_not":[
            {"term": {"age": "50"}}
          ]
        }
      }
    }
  },
  "aggs": {
    "价格最大值": {
      "max": {
        "field": "price"
      }
    }
  }
}
```

