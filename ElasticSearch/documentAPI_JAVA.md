# 文档API

​	使用 Java High Level REST Client 操作Elastsearch。[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-supported-apis.html)

## 基础学习测试工程

maven库依赖：

```xml
<dependencies>
        <!-- https://mvnrepository.com/artifact/org.elasticsearch.client/transport -->
        <!--新版本7以后不再推荐使用，到8版本后官方决定移除。 官方有相关迁移指南-->
<!--        <dependency>
            <groupId>org.elasticsearch.client</groupId>
            <artifactId>transport</artifactId>
            <version>7.1.1</version>
        </dependency>-->

        <!--新版本采用-->
        <!--
            官方JAVA API文档 https://artifacts.elastic.co/javadoc/org/elasticsearch/client/elasticsearch-rest-high-level-client/7.2.0/index.html
        -->
        <dependency>
            <groupId>org.elasticsearch.client</groupId>
            <artifactId>elasticsearch-rest-high-level-client</artifactId>
            <version>7.1.1</version>
        </dependency>
        
        <!-- https://mvnrepository.com/artifact/junit/junit -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

    </dependencies>
```



构建一个ElasticSearch测试基类，后面的测试学习都直接或间接继承这个类

```java
package com.tc.test.base;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.After;
import org.junit.Before;

import java.io.IOException;

public class ElasticSearchBaseTest {
    public RestHighLevelClient client;

    @Before
    public void before() {
        // 建立连接
        client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("192.168.56.21", 9200, "http")
                )
        );
    }

    @After
    public void after() {
        try {
            // 释放连接
            client.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## 索引API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-index.html)

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.rest.RestStatus;
import org.junit.Test;

import java.io.IOException;
import java.util.Date;

public class IndexDemo extends ElasticSearchBaseTest {

    @Test
    public void test1() {
        /*
            根据souce信息创建一个索引，并添加文档信息。
         */
        IndexRequest request = new IndexRequest("posts");
        /* 可选参数---start */
        {
            // 路由机制   https://blog.csdn.net/cnweike/article/details/38531997
//            request.routing("routing");
            // 超时时间
//            request.timeout("2s");
//            request.timeout(TimeValue.timeValueSeconds(2L));
            // 刷新策略
//            request.setRefreshPolicy("wait_for");
//            request.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            // 设置版本
//            request.version(1L);
            // 设置版本-新版本采用
//            request.setIfPrimaryTerm(1L);
//            request.setIfSeqNo(1L);
            // 版本类型
//            request.versionType(VersionType.EXTERNAL);
            // 设置操作类型
//            request.opType(DocWriteRequest.OpType.CREATE);
//            request.opType("create");
            // 管道名称
//            request.setPipeline("pipeline");
        }
        /* 可选参数---end */
        request.id("1");

        //  1、构造JSON对象----字符串形式
//        String jsonString = "{" +
//                    "\"user\":\"kimchy\"," +
//                    "\"postDate\":\"2013-01-30\"," +
//                    "\"message\":\"trying out Elasticsearch\"" +
//                "}";
//        request.source(jsonString, XContentType.JSON);

        // 2、构造JSON对象----Map形式
//        Map<String, Object> jsonMap = new HashMap<String, Object>();
//        jsonMap.put("user", "kimchy");
//        jsonMap.put("postDate", new Date());
//        jsonMap.put("message", "trying out Elasticsearch");
//        request.source(jsonMap);

        // 3、构造JSON对象----XContentBuilder对象形式   文档source提供一个XContentBuilder 对象，这是Elasticsearch内置帮助构造json内容的助手。
        try {
            XContentBuilder xContentBuilder = XContentFactory.jsonBuilder();
            xContentBuilder.startObject();
            {
                xContentBuilder.field("user", "kimchy");
                xContentBuilder.timeField("postDate", new Date());
                xContentBuilder.field("message", "trying out Elasticsearch");
            }
            xContentBuilder.endObject();
            request.source(xContentBuilder);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 4. 构造JSON对象----文档source提供键值对的方式来转换JSON。
//        request.source(
//                "user", "kimchy",
//                "postDate", new Date(),
//                "message", "trying out Elasticsearch"
//        );

        // 同步执行
        try {
            IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);
            // 返回的response对象中有一些返回的信息，可以通过下面操作进行获取：
            String index = indexResponse.getIndex();
            System.out.println("index:" + index);
            String id = indexResponse.getId();
            System.out.println("doc id:" + id);
            if (indexResponse.getResult() == DocWriteResponse.Result.CREATED) {
                // 创建成功做什么处理
            } else if (indexResponse.getResult() == DocWriteResponse.Result.UPDATED) {
                // 文档更新后做什么处理
            }
            ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
            if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
                // 处理成功分片成功数量小于分片总数量做什么处理
            }
            if (shardInfo.getFailed() > 0) {
                // 处理潜在的错误
                for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                    String reason = failure.reason();
                    System.out.println(reason);
                }
            }
        } catch (ElasticsearchException e) {
            if (e.status() == RestStatus.CONFLICT) {
                // 文档版本冲突, 或者创建的索引目前已经存在。
            }
        } catch (IOException e2) {
            e2.printStackTrace();
        }

        // 异步执行
//        client.indexAsync(request, RequestOptions.DEFAULT, new ActionListener<IndexResponse>() {
//            public void onResponse(IndexResponse response) {
//                DocWriteResponse.Result result = response.getResult();
//                System.out.println(result.getLowercase());
//            }
//            public void onFailure(Exception e) {
//                System.out.println("发生错误，进行处理...");
//                e.printStackTrace();
//            }
//        });


    }
}
```

