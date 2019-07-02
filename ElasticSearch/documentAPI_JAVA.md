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



## Index API

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
public class IndexAPIDemo extends ElasticSearchBaseTest {

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

​	这个api如果返回为true，这个时候这个文档存在，否则不存在。[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-exists.html)

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

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-delete.html)

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

## Update API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-update.html)

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.get.GetResult;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
    更新文档API允许使用一个脚本或者一部分文档更新一个存在的文档。
 */
@RunWith(JUnit4.class)
public class UpdateAPIDemo extends ElasticSearchBaseTest{
    @Test
    public void testOpByScript() {
        UpdateRequest request = new UpdateRequest("posts", "1");

        // map参数对象
        HashMap<String, Object> params = new HashMap<>();
        params.put("count", 4);

        // 构造执行脚本
        Script script = new Script(ScriptType.INLINE, "painless",
                "ctx._source.field += params.count", params);
        // 或者使用脚本  increment-字段，让某个字段加一个值
//        Script script = new Script(ScriptType.STORED, null, "increment-field", params);

        // 指定脚本请求
        request.script(script);

        // 同步执行
        try {
            UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.updateAsync(request, RequestOptions.DEFAULT, new ActionListener<UpdateResponse>() {
//            @Override
//            public void onResponse(UpdateResponse updateResponse) {
//                System.out.println(updateResponse.status());
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

    @Test
    public void testOpByPartialDoc () throws IOException {
        UpdateRequest request = new UpdateRequest("posts", "1");
        // 字符串方式构造json参数
//        String jsonString = "{" +
//                "\"updated\":\"2017-01-01\"," +
//                "\"reason\":\"daily update\"" +
//                "}";
//        request.doc(jsonString, XContentType.JSON);

        // map方式构造json参数
//        Map<String, Object> jsonMap = new HashMap<>();
//        jsonMap.put("updated", new Date());
//        jsonMap.put("reason", "daily update");
//        request.doc(jsonMap);

        // XContentBuilder 方式构造json参数
//        XContentBuilder builder = XContentFactory.jsonBuilder();
//        builder.startObject();
//        {
//            builder.timeField("updated", new Date());
//            builder.field("reason", "daily update");
//        }
//        builder.endObject();
//        request.doc(builder);

        // 通过键值对方式构造json参数  两两一组
        request.doc(
                "updated", new Date(),
                "reason", "daily update"
        );


        // 如果文档尚不存在，则可以使用upsert方法将某些内容定义为新文档 (可选)：
//        String jsonString = "{\"created\":\"2017-01-01\"}";
//        request.upsert(jsonString, XContentType.JSON);

        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println(response.status());
    }

    @Test
    public void optionalArgs () {
        UpdateRequest request = new UpdateRequest("posts", "1");
        // 可选参数
        {
            // 路由机制   https://blog.csdn.net/cnweike/article/details/38531997
            request.routing("routing");
            // 超时时间
            request.timeout("2s");
            request.timeout(TimeValue.timeValueSeconds(2L));
            // 刷新策略
            request.setRefreshPolicy("wait_for");
            request.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
            // 失败冲突重试次数
            request.retryOnConflict(3);
            // 禁用_source检索，默认是禁用的
            request.fetchSource(true);

            // 指定结果中含有某些域, 不包含哪些域
//            String[] includes = new String[] {"message", "*Date"};
//            String[] excludes = Strings.EMPTY_ARRAY;
//            FetchSourceContext fetchSourceContext =
//                    new FetchSourceContext(true, includes, excludes);
//            request.fetchSourceContext(fetchSourceContext);

            // 设置版本
//            request.version(1L);
            // 设置版本-新版本采用
//            request.setIfPrimaryTerm(1L);
//            request.setIfSeqNo(1L);
            // 空操作检测
            request.detectNoop(false);
            // 指示无论文档是否存在，脚本都必须运行，即如果文档不存在，脚本将负责创建文档。
            request.scriptedUpsert(false);
            // 指示如果部分文档尚不存在，则必须将其用作upsert文档。
            request.docAsUpsert(true);

            // 设置在继续更新操作之前必须处于活动状态的碎片副本数。
            request.waitForActiveShards(2);
            // can be ActiveShardCount.ALL, ActiveShardCount.ONE or ActiveShardCount.DEFAULT (default)
//            request.waitForActiveShards(ActiveShardCount.ALL);
        }
    }

    @Test
    public void responseAnalyse () {
        UpdateRequest request = new UpdateRequest("posts", "1");
        request.doc(
                "updated", new Date(),
                "reason", "daily update"
        );
        try {
            UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
            String index = response.getIndex();
            String id = response.getId();
            long version = response.getVersion();
            if (response.getResult() == DocWriteResponse.Result.CREATED) {
                // 处理文档创建了后干什么(upsert)
            } else if (response.getResult() == DocWriteResponse.Result.UPDATED) {
                // 文档更新了干点什么
            } else if (response.getResult() == DocWriteResponse.Result.DELETED) {
                // 文档删除了干点什么
            } else if (response.getResult() == DocWriteResponse.Result.NOOP) {
                // 处理文档不受更新影响的情况，即没有对文档执行任何操作（noop）。
            }

            GetResult result = response.getGetResult();
            if (result.isExists()) {
                String sourceAsString = result.sourceAsString();
                Map<String, Object> sourceAsMap = result.sourceAsMap();
                byte[] sourceAsBytes = result.source();
                String sourceStr = result.sourceAsString();
            } else {
                // 不存在做点什么
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
    }
}
```

## Term Vectors API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-term-vectors.html)

```java
package com.tc.test.document;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.core.TermVectorsRequest;
import org.elasticsearch.client.core.TermVectorsResponse;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RunWith(JUnit4.class)
public class TermVectorAPIDemo extends ElasticSearchBaseTest{
    @Test
    public void test1() {
        TermVectorsRequest request = new TermVectorsRequest("authors", "1");
        request.setFields("user");
        // 也可以为文档中不存在的生成
//        try {
//            XContentBuilder docBuilder = XContentFactory.jsonBuilder();
//            docBuilder.startObject();
//            docBuilder.field("user", "guest-user");
//            docBuilder.endObject();
//
//            TermVectorsRequest request = new TermVectorsRequest("authors",  docBuilder);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        // ===========可选参数
        // 省略文档计数、文档频率总和、总单词频率总和。
        request.setFieldStatistics(false);
        // 显示总单词频率和文档频率。
        request.setTermStatistics(true);
        // 省略输出位置
        request.setPositions(false);
        // 省略输出偏移
        request.setOffsets(false);
        // 省略输出payloads
        request.setPayloads(false);

        Map<String, Integer> filterSettings = new HashMap<>();
        filterSettings.put("max_num_terms", 3); // 最大单词个数
        filterSettings.put("min_term_freq", 1); // 最小词频
        filterSettings.put("max_term_freq", 10); // 最大词频
        filterSettings.put("min_doc_freq", 1); // 最小文档次数
        filterSettings.put("max_doc_freq", 100); // 最大文档次数
        filterSettings.put("min_word_length", 1); // 最小文档长度
        filterSettings.put("max_word_length", 10); // 最大文档长度

        // 单词根据tf-idf算法算出来的分数，过滤返回
        request.setFilterSettings(filterSettings);

        // 指定不同于字段的分析器
        Map<String, String> perFieldAnalyzer = new HashMap<>();
        perFieldAnalyzer.put("user", "keyword");
        request.setPerFieldAnalyzer(perFieldAnalyzer);

        // 实时
        request.setRealtime(false);
        // 路由值参数
        request.setRouting("routing");

        // 同步执行
        try {
            TermVectorsResponse response = client.termvectors(request, RequestOptions.DEFAULT);

            String index = response.getIndex();
//            String type = response.getType(); // 过时API
            String id = response.getId();
            boolean found = response.getFound();

            for (TermVectorsResponse.TermVector tv : response.getTermVectorsList()) {
                String fieldname = tv.getFieldName(); // 当前field的name
                int docCount = tv.getFieldStatistics().getDocCount(); // 获取文档的总数量
                long sumTotalTermFreq =
                        tv.getFieldStatistics().getSumTotalTermFreq(); // 获取当前field中的词频
                long sumDocFreq = tv.getFieldStatistics().getSumDocFreq(); // 获取文档的频率
                if (tv.getTerms() != null) {
                    List<TermVectorsResponse.TermVector.Term> terms =
                            tv.getTerms(); // 当前filed下的单词
                    for (TermVectorsResponse.TermVector.Term term : terms) {
                        String termStr = term.getTerm(); // 当前单词的名称
                        int termFreq = term.getTermFreq(); // 词频
                        int docFreq = term.getDocFreq(); // 文档词频
                        long totalTermFreq = term.getTotalTermFreq(); // 总词频
                        float score = term.getScore(); // 匹配度分数
                        if (term.getTokens() != null) {
                            List<TermVectorsResponse.TermVector.Token> tokens =
                                    term.getTokens(); // 获取tokens
                            for (TermVectorsResponse.TermVector.Token token : tokens) {
                                int position = token.getPosition(); // 单词的位置
                                int startOffset = token.getStartOffset(); // 单词的offset
                                int endOffset = token.getEndOffset(); // 单词的结束位置
                                String payload = token.getPayload(); // 单词体
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步操作
//        client.termvectorsAsync(request, RequestOptions.DEFAULT, new ActionListener<TermVectorsResponse>() {
//            @Override
//            public void onResponse(TermVectorsResponse termVectorsResponse) {
//                System.out.println(termVectorsResponse);
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
    }
}
```

