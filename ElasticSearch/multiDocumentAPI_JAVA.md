# **Multi-document** API

​	使用 Java High Level REST Client 操作Elastsearch。[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-supported-apis.html)

## Bulk API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-bulk.html)

单个BulkRequest能够被是用来执行多个index，update或者delete操作。

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.bulk.*;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.ByteSizeUnit;
import org.elasticsearch.common.unit.ByteSizeValue;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@RunWith(JUnit4.class)
public class BulkAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        final BulkRequest request = new BulkRequest();
        // 设置了全局的操作索引，除非子索引设置了自己的操作索引，否则就是操作的这个索引。
//        BulkRequest defaulted = new BulkRequest("posts");

        request.add(
                new IndexRequest("bulkmod").id("1")
                        .source(XContentType.JSON, "field", "foo")
        );
        request.add(
                new IndexRequest("bulkmod").id("2")
                        .source(XContentType.JSON, "field", "bar")
        );
        request.add(
                new IndexRequest("bulkmod").id("3")
                        .source(XContentType.JSON, "field", "baz")
        );
        request.add(
                new DeleteRequest("bulkmod", "3")
        );
        request.add(
                new UpdateRequest("bulkmod", "2")
                    .doc(XContentType.JSON,"other", "test")
        );
        request.add(
                new IndexRequest("bulkmod").id("4")
                    .source(XContentType.JSON,"field", "baz")
        );

        // 超时时间
//            request.timeout("2s");
//            request.timeout(TimeValue.timeValueSeconds(2L));
        // 刷新策略
//            request.setRefreshPolicy("wait_for");
//            request.setRefreshPolicy(WriteRequest.RefreshPolicy.WAIT_UNTIL);
        // 设置在继续更新操作之前必须处于活动状态的碎片副本数。
//        request.waitForActiveShards(2);
        // can be ActiveShardCount.ALL, ActiveShardCount.ONE or ActiveShardCount.DEFAULT (default)
//            request.waitForActiveShards(ActiveShardCount.ALL);
        // 全局的通道，会被所有的子请求使用，除非子请求设置覆盖了该值。
//        request.pipeline("pipelineId");
        // 全局的路由设置值，会被所有的子请求使用，除非子请求设置覆盖了该值。
//        request.routing("routingId");

        // 同步执行
        try {
            BulkResponse bulkResponse = client.bulk(request, RequestOptions.DEFAULT);
            // 解析返回
            for (BulkItemResponse bulkItemResponse : bulkResponse) {
                if (bulkItemResponse.isFailed()) {
                    BulkItemResponse.Failure failure = bulkItemResponse.getFailure();
                    System.out.println(failure.getMessage());
                    // 该项发生了错误, 这个时候...
                }
                DocWriteResponse itemResponse = bulkItemResponse.getResponse();

                switch (bulkItemResponse.getOpType()) {
                    case INDEX:
                    case CREATE:
                        IndexResponse indexResponse = (IndexResponse) itemResponse;
                        break;
                    case UPDATE:
                        UpdateResponse updateResponse = (UpdateResponse) itemResponse;
                        break;
                    case DELETE:
                        DeleteResponse deleteResponse = (DeleteResponse) itemResponse;
                }
            }

            // 如果有错
            if (bulkResponse.hasFailures()) {
                // ...处理
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.bulkAsync(request, RequestOptions.DEFAULT, new ActionListener<BulkResponse>() {
//            @Override
//            public void onResponse(BulkResponse responses) {
//                System.out.println(responses.status());
//            }
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
    }

    @Test
    public void bulkProcessor() {
        // This listener is called before and after every BulkRequest execution or when a BulkRequest failed
        BulkProcessor.Listener listener = new BulkProcessor.Listener() {
            @Override
            public void beforeBulk(long executionId, BulkRequest bulkRequest) {
                // This method is called before each execution of a BulkRequest
                // 在每次执行BulkRequest之前调用，此方法允许知道将在BulkRequest中执行的操作数。
                int numberOfActions = bulkRequest.numberOfActions();
                System.out.println("Executing bulk [" + executionId +"] with " + numberOfActions + " requests");
            }

            @Override
            public void afterBulk(long executionId, BulkRequest bulkRequest, BulkResponse bulkResponse) {
                // This method is called after each execution of a BulkRequest
                if (bulkResponse.hasFailures()) {
//                    logger.warn("Bulk [{}] executed with failures", executionId);
                } else {
//                    logger.debug("Bulk [{}] completed in {} milliseconds",
//                            executionId, bulkResponse.getTook().getMillis());
                }
            }

            @Override
            public void afterBulk(long executionId, BulkRequest bulkRequest, Throwable throwable) {
                // This method is called when a BulkRequest failed
//                logger.error("Failed to execute bulk", throwable);
            }
        };

        BulkProcessor.Builder bulkBuilder = BulkProcessor.builder(
                (request, bulkListener) -> client.bulkAsync(request, RequestOptions.DEFAULT, bulkListener),
                listener
        );

        // 根据当前添加的操作数设置刷新新批量请求的时间（默认值为1000，使用-1禁用它）
        bulkBuilder.setBulkActions(500);
        // 根据当前添加的操作大小设置刷新新批量请求的时间（默认为5MB，使用-1禁用它）
        bulkBuilder.setBulkSize(new ByteSizeValue(1L, ByteSizeUnit.MB));
        // 设置同时执行的并行请求数默认为1，使用0仅允许执行单个请求）
//        bulkBuilder.setConcurrentRequests(0);
        // 如果间隔通过，则设置刷新间隔刷新挂起的任何BulkRequest（默认为未设置）
//        bulkBuilder.setFlushInterval(TimeValue.timeValueSeconds(10L));

        bulkBuilder.setBackoffPolicy(BackoffPolicy
                .constantBackoff(TimeValue.timeValueSeconds(1L), 3));

        BulkProcessor bulkProcessor = bulkBuilder.build();

        bulkProcessor.add(
                new DeleteRequest("bulkmod", "3")
        );
        bulkProcessor.add(
                new UpdateRequest("bulkmod", "2")
                        .doc(XContentType.JSON,"other", "test")
        );

        try {
            // waitClose（）方法可用于等待所有请求处理完毕或指定的等待时间结束：
            boolean terminated = bulkProcessor.awaitClose(30L, TimeUnit.SECONDS);

        } catch (InterruptedException e) {
            e.printStackTrace();
        }

//        close被用于立即关闭 BulkProcessor
//        bulkProcessor.close();
        // awaitClose和close方法  这两种方法都会在关闭处理器之前刷新添加到处理器的请求，并且禁止向其添加任何新的请求。
    }
}
```



## Multi-Get API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-multi-get.html)

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.get.MultiGetItemResponse;
import org.elasticsearch.action.get.MultiGetRequest;
import org.elasticsearch.action.get.MultiGetResponse;
import org.elasticsearch.client.RequestOptions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Map;

import static org.hamcrest.CoreMatchers.containsString;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;

@RunWith(JUnit4.class)
public class MultiGetAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        MultiGetRequest request = new MultiGetRequest();
        request.add(new MultiGetRequest.Item("posts","1"));
        request.add(new MultiGetRequest.Item("posts", "5"));

        MultiGetRequest.Item multiGetRequstItem = new MultiGetRequest.Item("posts", "5");
        // Item 可选参数 start
// 禁用检索源 （就是结果中没有source, 默认结果中是含有source中）
//            multiGetRequstItem.fetchSourceContext(FetchSourceContext.DO_NOT_FETCH_SOURCE);

        // 指定结果中含有某些域, 不包含哪些域
//            String[] includes = new String[] {"message", "*Date"};
//            String[] excludes = Strings.EMPTY_ARRAY;
//            FetchSourceContext fetchSourceContext =
//                    new FetchSourceContext(true, includes, excludes);
//            multiGetRequstItem.fetchSourceContext(fetchSourceContext);

        // 为特定存储字段配置检索（要求在映射中单独存储字段）
//        multiGetRequstItem.storedFields("foo");
        // Item 可选参数 end
        // 偏好值
//        request.preference("some_preference");
        // 实时
//        request.realtime(false);
        // 在检索文档之前执行刷新（默认为false）
//        request.refresh(true);

        // 同步执行请求
        try {
            MultiGetResponse response = client.mget(request, RequestOptions.DEFAULT);
            System.out.println(response);

            MultiGetItemResponse firstItem = response.getResponses()[0];
            assertNull(firstItem.getFailure());
            GetResponse firstGet = firstItem.getResponse();
            String index = firstItem.getIndex();
            String id = firstItem.getId();
            if (firstGet.isExists()) {
                long version = firstGet.getVersion();
                String sourceAsString = firstGet.getSourceAsString();
                Map<String, Object> sourceAsMap = firstGet.getSourceAsMap();
                byte[] sourceAsBytes = firstGet.getSourceAsBytes();
            } else {

            }

            Exception e = firstItem.getFailure().getFailure();
            ElasticsearchException ee = (ElasticsearchException) e;
            // TODO status is broken! fix in a followup
            // assertEquals(RestStatus.CONFLICT, ee.status());
            assertThat(e.getMessage(),
                    containsString("version conflict, current version [1] is "
                            + "different than the one provided [1000]"));
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.mgetAsync(request, RequestOptions.DEFAULT, new ActionListener<MultiGetResponse>() {
//            @Override
//            public void onResponse(MultiGetResponse multiGetItemResponses) {
//                System.out.println(multiGetItemResponses);
//            }
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



## Reindex API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-reindex.html)

ReindexRequest能够将文档从一个或多个索引中拷贝到目标索引中。

它需要一个现有的源索引和一个可能存在也可能不存在的目标索引请求。reindex不尝试设置目标索引。它不会复制源索引的设置。您应该在运行重新索引操作之前设置目标索引，包括设置映射、碎片计数、副本等。

## Update By Query API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-update-by-query.html)

## Delete By Query API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-delete-by-query.html)

## Rethrottle API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-rethrottle.html)

## Multi Term Vectors API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-multi-term-vectors.html)