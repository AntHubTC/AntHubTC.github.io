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
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;

@RunWith(JUnit4.class)
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

    /**
     * 让主线程等待一会儿(用于异步执行操作)
     * @param time
     */
    public void waitForTime(long time) {
        try {
            Thread.sleep(time);
        } catch (InterruptedException e) {
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
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Date;


@RunWith(JUnit4.class)
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
        // 让主线程等待一会儿，让异步操作有足够的时间执行完毕
//        waitForTime(50000L);
    }
}

```

## GET API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-get.html)

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.RequestOptions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Map;

@RunWith(JUnit4.class)
public class GetAPIDemo extends ElasticSearchBaseTest {

    @Test
    public void test1() {
        GetRequest request = new GetRequest("posts", "1");
        // 同步执行
        try {
            GetResponse response = client.get(request, RequestOptions.DEFAULT);
            System.out.println(response.getSource());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void test2() {
        GetRequest request = new GetRequest("posts", "1");
        /* 可选参数 start */
        {
            // 禁用检索源 （就是结果中没有source, 默认结果中是含有source中）
//            request.fetchSourceContext(FetchSourceContext.DO_NOT_FETCH_SOURCE);

            // 指定结果中含有某些域, 不包含哪些域
//            String[] includes = new String[] {"message", "*Date"};
//            String[] excludes = Strings.EMPTY_ARRAY;
//            FetchSourceContext fetchSourceContext =
//                    new FetchSourceContext(true, includes, excludes);
//            request.fetchSourceContext(fetchSourceContext);

            // 设置路由值
//            request.routing("routing");
            // 偏好设置
//            request.preference("preference");
            // 设置实时标识，默认为true
//            request.realtime(false);
            // 在检索文档之前执行刷新（默认为false）
//            request.refresh(true);
            // 设置版本
//            request.version(1L);
            // 设置版本-新版本采用
//            request.setIfPrimaryTerm(1L);
//            request.setIfSeqNo(1L);
        }
        /* 可选参数 end */

        // 异步执行请求
        client.getAsync(request, RequestOptions.DEFAULT, new ActionListener<GetResponse>() {
            @Override
            public void onResponse(GetResponse getResponse) {
                String index = getResponse.getIndex();
                System.out.println("index:" + index);
                String id = getResponse.getId();
                System.out.println("doc id:" + id);

                if (getResponse.isExists()) {
                    Map<String, Object> source = getResponse.getSource();
                    System.out.println(source);

                    long version = getResponse.getVersion();
                    String sourceAsString = getResponse.getSourceAsString();
                    Map<String, Object> sourceAsMap = getResponse.getSourceAsMap();
                    byte[] sourceAsBytes = getResponse.getSourceAsBytes();
                } else {
                    /*
                    处理找不到文档的方案。请注意，尽管返回的响应具有404状态代码，但返回的是有效的getResponse，而不是引发异常。这样的响应不包含任何源文档，并且其isExists方法返回false。
                     */
                }
            }

            @Override
            public void onFailure(Exception e) {
                e.printStackTrace();
            }
        });

        // 让主线程等待一会儿，让异步操作有足够的时间执行完毕
        waitForTime(50000L);
    }
}
```

## Exists API

​	这个api如果返回为true，这个时候这个文档存在，否则不存在。

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public class ExistsAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        GetRequest request = new GetRequest("posts", "1");
        // 不获取出_source
        request.fetchSourceContext(new FetchSourceContext(false));
        // 禁用获取出存储域
        request.storedFields("_none_");

        // 同步执行请求
//        try {
//            boolean flag = client.exists(request, RequestOptions.DEFAULT);
//            System.out.println("是否存在:" + flag);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        // 异步执行请求
        client.existsAsync(request, RequestOptions.DEFAULT, new ActionListener<Boolean>() {
            @Override
            public void onResponse(Boolean flag) {
                System.out.println("是否存在：" + flag);
            }

            @Override
            public void onFailure(Exception e) {
                e.printStackTrace();
            }
        });

        // 让主线程等待一会儿，让异步操作有足够的时间执行完毕
        waitForTime(50000L);
    }

```

## Delete API

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.TimeValue;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;

@RunWith(JUnit4.class)
public class DeleteAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        DeleteRequest request = new DeleteRequest("posts", "1");

        // 设置路由值
//        request.routing("routing");
        // 设置超时时间
//        request.timeout(TimeValue.timeValueMinutes(2));
//        request.timeout("2m");
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
        // 同步执行
        try {
            DeleteResponse response = client.delete(request, RequestOptions.DEFAULT);
            // 返回的response对象中有一些返回的信息，可以通过下面操作进行获取：
            String index = response.getIndex();
            System.out.println("index:" + index);
            String id = response.getId();
            System.out.println("doc id:" + id);
            if (response.getResult() == DocWriteResponse.Result.NOT_FOUND) {
                // 没找到做什么处理
            } else if (response.getResult() == DocWriteResponse.Result.DELETED) {
                // 已经删除做什么处理
            }
            ReplicationResponse.ShardInfo shardInfo = response.getShardInfo();
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
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.deleteAsync(request, RequestOptions.DEFAULT, new ActionListener<DeleteResponse>() {
//            @Override
//            public void onResponse(DeleteResponse deleteResponse) {
//                System.out.println(deleteResponse.status());
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
        // 让主线程等待一会儿，让异步操作有足够的时间执行完毕
//        waitForTime(50000L);
    }
}
```

