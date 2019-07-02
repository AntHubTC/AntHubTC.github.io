# Mapping

## 什么是Mapping

```bash
PUT /tc_id/_doc/7
{
  "first_name": "Jane7",
  "last_name": "smith7",
  "age": 13,
  "about": "I like to collect rock ablumns",
  "interests": [ "music" ]
}
GET /tc_id/_mapping
```

上面添加了文档后，es会自动创建了index， type， 以及type对应的mapping(dynamic mapping动态mapping)

什么是映射： mapping定义了type中的每个字段的数据类型以及这些字段如何分词等相关属性。

```json
{
  "tc_id" : {
    "mappings" : {
      "properties" : {
        "about" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "age" : {
          "type" : "long"
        },
        "first_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "interests" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "last_name" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
        "price" : {
          "type" : "long"
        },
        "title" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
      }
    }
  }
}
```

​	创建索引的时候,可以预先定义字段的关型以及相关属性,这样就能够把日期字段处理成日期,把数字字段处理成数字,把字符串字段处理字符串值等（手动指定防止系统动态映射没有达到你想要的效果）。

## **映射的分类**

1. 动态映射

   ​	当ES在文档中碰到一个以前没见过的字段时,它会利用动态映射来决定该字段的类型,井自动地对该字段添加映射。

   可以通过 dynamic设置来控制这一行为,它能够接受以下的选项：

   

   ES动态映射的规则：

   ​	true/false--->boolean

   ​	"asdfasdf"--->string

   ​	119--->long

   ​	12.31--->double

   ​	"1990-12-01"--->date

2. 手动映射

   ```bash
   PUT /lib6
   {
     "settings": {
       "number_of_shards": 3,
       "number_of_replicas": 0
     },
     "mappings": {
       "properties": {
           "title": {"type": "text"},
           "name": {"type": "text", "analyzer": "standard"},
           "publish_date": {"type": "date", "index": false},
           "price": {"type": "double"},
           "number": {"type": "integer"}
         }
     }
   }
   
   #老版本
   PUT /lib6
   {
     "mappings": {
       "books": { // books 指定的Type
           "properties": {
       	...
         }
       }
     }
   }
   
   GET /lib6
   ```

   

## **Mapping支持的数据类型**

1. 核心数据类型（Core datatypes）

   **字符型**：string， string类型包括 text和keyword。

   ​	text类型被用来索引长文本。在建立索引前会将这些文本进行分词，转化为词的组合，建立索引。允许es来检索这些词语，text类型不能用来排序和聚合。

   ​	keyword类型不需要进行分词，可以被用来检索过滤、排序和聚合，keyword类型字段只能用本身来进行检索。

   **数字型**：long，integer，short，byte，double，float

   **日期型**：date

   **布尔型**：boolean

   **二进制型**：binary

2. 复杂数据类型(Complex datatypes)

   **数组类型**(Array datatype)：数组类型不需要专门指定数组元素的type。例如：

   ​	字符型数组：["one", "tow"]

   ​	整形数组: [1, 2]

   ​	数组型数组: [1, [ 2, 3]] 等价于 [1, 2, 3]

   ​	对象数组：[{"name": "Mary", "age": 12}, {"name": "John", "age": 10}]

   **对象类型**(Object datatype):  &#95;objec&#95;用于单个JSON对象；

   **嵌套类型**(Nested datatype): &#95;_nested&#95; 用于JSON数组；

3. 地理位置类型(Geo datatypes)

   **地理坐标类型**(Geo-point datatype): &#95;geo&#95;point&#95; 用于经度纬度坐标；

   **地理坐标形状**(Geo-Shape datatype): &#95;geo&#95;shape&#95;用于类似多边形的复杂形状；

4. 特定类型(Specialised datatypes)

   **IPV4**类型(IPv4 datatype): &#95;ip&#95;用于IPV4地址；

   **Completion**类型(Completion datatype): &#95;completion&#95; 提供自动补全建议；

   **Token Count**类型(Token count datatype)：&#95;token&#95;count&#95;用于统计做了标记的字段的index数目，该值会一直增加，不会因为过滤条件而减少；

   **mapper-murmur3**类型： 通过插件，可以通过&#95;murmur3&#95;来计算index的hash值；

   **附加类型**(Attachment datatype)：采用mapper-attachments插件，可支持&#95;attachements&#95;索引，例如Microsoft Office格式，Open Document格式，ePub，HTML等。

在后面的_search查询的时候，除了keyword之外es默认是不进行分词的，所以其他类

型需要精确查询，不能分词匹配。



## Mapping支持的属性

"store": false // 是否单独设置此字段的是否存储而从&#95;source字段中分离，默认是false，只能搜索，不能获取值；

“index”：true // 分词，不分词是：false，设置成false，字段将不会被索引；

“analyzer”：“ik”// 指定分词器， 默认分词器为standard analyzer；

“boost”：1.23 // 字段级别的分数加权，默认值是:1.0；

"doc&#95;values":false // 对not&#95;analyzed字段，默认都是开启，分词字段不能使用，对排序和聚合能提升较大性能，节约内存；

“fielddata”:{"format": "disabled"} // 针对分词字段，参与排序或聚合时能提高性能，不分词字段统一建议使用 doc&#95;values

"fields":{"raw":{"type":"string", "index": "not&#95;analyzed"}} // 可以对一个字段提供多种索引模式，同一个字段的值，一个分词，一个不分词；

“ignore_above”: 100 // 超过100个字符的文本，将会被忽略，不被索引；

“include&#95;in&#95;all”: true // 设置是否此字段包含在&#95;all字段中，默认是true，除非index设置成no选项；

“index&#95;options”: "docs" // 4个可选参数docs（索引文档号），freqs（文档号+词频），positions（文档号+词频+位置，通常用来距离查询），offsets（文档号+词频+位置+偏移量，通常被使用在高亮字段） 分词字段默认是position，其它的默认是docs

“norms”:{"enable":true, "loading": "lazy"} // 分词字段默认配置，不分词字段；默认{"enable": false}, 存储长度因子和索引时boost，建议对需要参与评分的字段使用，会额外内存的消耗量。

"null&#95;value": "NULL" // 设置一些缺失字段的初始值， 只有string可以使用，分词字段的null值会被分词；

"position&#95;increament&#95;gap": 0 // 影响距离查询或近似查询， 可以设置在多值字段的数据上和分词字段上，查询时可指定slop间隔， 默认值100

"search_analyzer": "ik" // 设置搜索时的分词器， 默认值跟ananlyzer是一致的，比如index时用standard+ngram，搜索时用standard用来完成自动提示功能；

"similarity": "BM25" // 默认是TF/IDF算法，指定一个字段评分策略，仅仅对字符串型和分词类型有效；

"term&#95;vector": "no" // 默认不存储向量信息， 支持参数yes (term存储)， with&#95;positions (term+位置)，with&#95;offsets(term+偏移量)，with&#95;positions&#95;offsets(term+位置+偏移量)对快速高亮fast vector highlighter能提升性能，但开启又会加大索引体积，不适合大数据量使用

## dynamic mapping策略

dynamic：

1. true：遇到陌生字段就dynamic mapping
2. false：遇到陌生字段就忽略
3. strict：遇到陌生字段就报错

date_detection: 默认会按照一定格式识别date，比如yyyy-MM-dd

​	可以手动关闭某特type的date_detection:true/false

定制dynamic mapping template(type)：

```bash
# 模板
PUT /my_index
{
  "mappings": {
    "my_type": {
      "dynamic_templates": [{
        "en": {
          "match": "*_en",
          "match_mapping_type":"string",
          "mapping": {
            "type": "text",
            "analyzer": "english"
          }
        }
      }]
    }
  }
}
```



## 重建索引

​	一个field的设置是不能修改的,如果要修改一个field,那么应该重新按照新的 mapping,建立一个 index,然后将数据批量查询出来,重新用 bulk apl.写入到indext中。

​	批量查询的时候,建议来用 scroll api,并且采用多线程并发的方式来 reindex数据,每次 scroll就查询指定日期的一段数据,交给一个线程即可。

PUT /index1/ type1/4 (" content : " 1990-12-12}

GET /index1/type1/search

GET /index1 type1/mapping

#报错 PUT /index1/type1/4 ( "content ": "I am very happy "}

#字段类型一旦确定就不能修改了，要想修改字段的类型，只能是新建一个新的索引，新的索引的字段类型为string，把旧的索引中的数据再导入到新的索引中。

#但是， 如果新建一个索引，那么在应用程序中使用的是原有的索引，那么就会导致需要重新启动应用程序，为了不用重启应用，我们使用别名的方式。

PUT /index1/_alias/index2

#创建新的索引，把content的类型改为字符串

PUT /newindex {"mappings": {"type1": {"properties": {"content": {"type": "text"}}}}}

#把旧的索引中的数据再导入到新的索引中，有可能旧的索引中的数据量非常大。

#使用scroll方式批量查询数据

GET /index1/type1/_search?scroll=1m

{

​	"query": {"match_all":{}},

​	"sort": ['_doc'],

​	"size": 2

}

#然后使用bulk再批量添加到新的索引中。

POST /_bulk

{"index":{"_index":"newindex","_type":"type1", "_id": 1}}

{"content": "2019-08-09"}

#将新的索引和别名进行关联

POST /_aliases

{

​	"actions": [

​		{"remove": {"index": "index1",  "alias": "index2"}},

​		{"add": {"index": "newindex",  "alias": "index2"}}

​	]

}