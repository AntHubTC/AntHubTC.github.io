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

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.tasks.TaskSubmissionResponse;
import org.elasticsearch.common.bytes.BytesArray;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.VersionType;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.ReindexRequest;
import org.elasticsearch.index.reindex.RemoteInfo;
import org.elasticsearch.index.reindex.ScrollableHitSource;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.elasticsearch.search.sort.SortOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RunWith(JUnit4.class)
public class ReindexAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        ReindexRequest request = new ReindexRequest();
        // 设置源索引
        request.setSourceIndices("source1", "source2");
        // 设置目标索引
        request.setDestIndex("dest");
        // 设置目标版本类型
//        request.setDestVersionType(VersionType.EXTERNAL);
        //将optype设置为create将导致_reindex仅在目标索引中创建缺少的文档。所有现有文档都将导致版本冲突。默认optype是index。
//        request.setDestOpType("create");
        // 默认情况下，版本冲突会中止重新索引进程，但您可以用以下方法计算它们：
//        request.setConflicts("proced"); // proced 设置版本冲突时继续
        // 可以通过查询限制一下文档
//        request.setSourceQuery(new TermQueryBuilder("user", "kimchy"));
        // 也可以通过设置大小来限制已处理文档的数量。
//        request.setSize(10);
        // 默认情况下，reindex使用1000个批次。可以使用sourceBatchSize更改批大小。
//        request.setSourceBatchSize(100);
        // Reindex还可以通过指定管道来使用摄取功能。
//        request.setDestPipeline("my_pipeline");
        // 如果您需要源索引中的一组特定文档，则需要使用sort。如果可能的话，最好选择更具选择性的查询，而不是进行大小和排序。
//        request.addSortField("field1", SortOrder.DESC);
//        request.addSortField("field2", SortOrder.ASC);
        // 支持脚本来修改文档
//        request.setScript(
//                new Script(
//                        ScriptType.INLINE, "painless",
//                        "if (ctx._source.user == 'kimchy') {ctx._source.likes++;}",
//                        Collections.emptyMap()));

        /*
        ReindexRequest支持从远程ElasticSearch集群重新索引。使用远程群集时，应在RemoteInfo对象内指定查询，而不是使用SetSourceQuery。如果同时设置了远程信息和源查询，则会在请求期间导致验证错误。原因是远程ElasticSearch可能无法理解现代查询生成器生成的查询。远程集群支持一直工作到ElasticSearch 0.90，此后查询语言发生了变化。当访问旧版本时，用JSON手工编写查询更安全。
         */
//        request.setRemoteInfo(
//                new RemoteInfo(
//                        "http", remoteHost, remotePort, null,
//                        new BytesArray(new MatchAllQueryBuilder().toString()),
//                        user, password, Collections.emptyMap(),
//                        new TimeValue(100, TimeUnit.MILLISECONDS),
//                        new TimeValue(100, TimeUnit.SECONDS)
//                )
//        );

        // 同步执行
        try {
            BulkByScrollResponse bulkResponse =
                    client.reindex(request, RequestOptions.DEFAULT);

            TimeValue timeTaken = bulkResponse.getTook(); // 总耗时
            boolean timedOut = bulkResponse.isTimedOut(); // 检测请求超时
            long totalDocs = bulkResponse.getTotal();// 总文档处理数量
            long updatedDocs = bulkResponse.getUpdated(); // 更新的文档数量
            long createdDocs = bulkResponse.getCreated(); // 创建的文档数量
            long deletedDocs = bulkResponse.getDeleted(); // 删除的文档数量
            long batches = bulkResponse.getBatches(); // 已执行的批数
            long noops = bulkResponse.getNoops(); // 跳过的文档数量
            long versionConflicts = bulkResponse.getVersionConflicts(); // 文档版本冲突的数量
            long bulkRetries = bulkResponse.getBulkRetries(); // 请求必须重试批量索引操作的次数
            long searchRetries = bulkResponse.getSearchRetries(); // 请求必须重试搜索操作的次数
            TimeValue throttledMillis = bulkResponse.getStatus().getThrottled();//  此请求自身已阻塞的总时间，不包括当前处于休眠状态的限制时间
            TimeValue throttledUntilMillis = // 任何当前节气门休眠的剩余延迟或0（如果不休眠）
                    bulkResponse.getStatus().getThrottledUntil();
            List<ScrollableHitSource.SearchFailure> searchFailures = // 搜索阶段失败
                    bulkResponse.getSearchFailures();
            List<BulkItemResponse.Failure> bulkFailures = // 批量索引操作期间失败
                    bulkResponse.getBulkFailures();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.reindexAsync(request, RequestOptions.DEFAULT, new ActionListener<BulkByScrollResponse>() {
//            @Override
//            public void onResponse(BulkByScrollResponse bulkByScrollResponse) {
//                System.out.println(bulkByScrollResponse);
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });

//        try {
//            TaskSubmissionResponse taskSubmissionResponse = client.submitReindexTask(request, RequestOptions.DEFAULT);
//            String taskId = taskSubmissionResponse.getTask();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }
}
```



## Update By Query API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-update-by-query.html)

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.support.IndicesOptions;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.TermQueryBuilder;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.ScrollableHitSource;
import org.elasticsearch.index.reindex.UpdateByQueryRequest;
import org.elasticsearch.script.Script;
import org.elasticsearch.script.ScriptType;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RunWith(JUnit4.class)
public class UpdateByQueryAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        UpdateByQueryRequest request = // 参数指定索引
                new UpdateByQueryRequest("source1", "source2");
        // 默认情况下，版本冲突将中止UpdateByQueryRequest进程，但您可以使用以下方法来替代它：
        //        request.setConflicts("proceed");
        // 你可以添加一个查询限制文档
//        request.setQuery(new TermQueryBuilder("user", "kimchy")); // user这个field查询kimchy
        // 也可以通过设置大小来限制已处理文档的数量。
//        request.setSize(10);
        // 设置批次数量
//        request.setBatchSize(100);
//        request.setPipeline("my_pipeline");
        // 脚本
        request.setScript(
                new Script(
                        ScriptType.INLINE, "painless",
                        "if (ctx._source.user == 'kimchy') {ctx._source.likes++;}",
                        Collections.emptyMap()));
        // 可以使用带设置块的切片滚动来并行化：
//        request.setSlices(2);
        // 使用滚动参数控制“搜索上下文”保持活动的时间。
//        request.setScroll(TimeValue.timeValueMinutes(10));
        // 设置routing
//        request.setRouting("=cat");

//        request.setTimeout(TimeValue.timeValueMinutes(2));
//        request.setRefresh(true);
//        request.setIndicesOptions(IndicesOptions.LENIENT_EXPAND_OPEN);

        try {
            BulkByScrollResponse bulkResponse =
                    client.updateByQuery(request, RequestOptions.DEFAULT);

            TimeValue timeTaken = bulkResponse.getTook();
            boolean timedOut = bulkResponse.isTimedOut();
            long totalDocs = bulkResponse.getTotal();
            long updatedDocs = bulkResponse.getUpdated();
            long deletedDocs = bulkResponse.getDeleted();
            long batches = bulkResponse.getBatches();
            long noops = bulkResponse.getNoops();
            long versionConflicts = bulkResponse.getVersionConflicts();
            long bulkRetries = bulkResponse.getBulkRetries();
            long searchRetries = bulkResponse.getSearchRetries();
            TimeValue throttledMillis = bulkResponse.getStatus().getThrottled();
            TimeValue throttledUntilMillis =
                    bulkResponse.getStatus().getThrottledUntil();
            List<ScrollableHitSource.SearchFailure> searchFailures =
                    bulkResponse.getSearchFailures();
            List<BulkItemResponse.Failure> bulkFailures =
                    bulkResponse.getBulkFailures();
        } catch (IOException e) {
            e.printStackTrace();
        }

//        client.updateByQueryAsync(request, RequestOptions.DEFAULT, new ActionListener<BulkByScrollResponse>() {
//            @Override
//            public void onResponse(BulkByScrollResponse bulkByScrollResponse) {
//                System.out.println(bulkByScrollResponse);
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
//        waitForTime(50000L);
    }
}
```



## Delete By Query API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-delete-by-query.html)

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.DeleteByQueryRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;

@RunWith(JUnit4.class)
public class DeleteByQueryAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        DeleteByQueryRequest request =
                new DeleteByQueryRequest("source1", "source2");

        // 默认情况下，版本冲突将中止UpdateByQueryRequest进程，但您可以使用以下方法来替代它：
        //        request.setConflicts("proceed");
        // 你可以添加一个查询限制文档
//        request.setQuery(new TermQueryBuilder("user", "kimchy")); // user这个field查询kimchy
        // 也可以通过设置大小来限制已处理文档的数量。
//        request.setSize(10);
        // 设置批次数量
//        request.setBatchSize(100);
//        request.setPipeline("my_pipeline");

        // 可以使用带设置块的切片滚动来并行化：
//        request.setSlices(2);
        // 使用滚动参数控制“搜索上下文”保持活动的时间。
//        request.setScroll(TimeValue.timeValueMinutes(10));
        // 设置routing
//        request.setRouting("=cat");

//        request.setTimeout(TimeValue.timeValueMinutes(2));
//        request.setRefresh(true);
//        request.setIndicesOptions(IndicesOptions.LENIENT_EXPAND_OPEN);

        // 同步执行
        try {
            BulkByScrollResponse bulkResponse =
                    client.deleteByQuery(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.deleteByQueryAsync(request, RequestOptions.DEFAULT, new ActionListener<BulkByScrollResponse>() {
//            @Override
//            public void onResponse(BulkByScrollResponse bulkByScrollResponse) {
//                System.out.println(bulkByScrollResponse);
//            }
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
//        waitForTime(5000L);
    }
}
```



## Rethrottle API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-rethrottle.html)



## Multi Term Vectors API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-document-multi-term-vectors.html)

```java
package com.tc.test.multiDocument;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.core.MultiTermVectorsRequest;
import org.elasticsearch.client.core.MultiTermVectorsResponse;
import org.elasticsearch.client.core.TermVectorsRequest;
import org.elasticsearch.client.core.TermVectorsResponse;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.List;

@RunWith(JUnit4.class)
public class MultiTermVectorsAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() throws IOException {
        MultiTermVectorsRequest request = new MultiTermVectorsRequest();
        TermVectorsRequest tvrequest1 =
                new TermVectorsRequest("authors", "1");
        tvrequest1.setFields("user");
        request.add(tvrequest1);

        XContentBuilder docBuilder = XContentFactory.jsonBuilder();
        docBuilder.startObject().field("user", "guest-user").endObject();
        TermVectorsRequest tvrequest2 =
                new TermVectorsRequest("authors", docBuilder);
        request.add(tvrequest2);

//        TermVectorsRequest tvrequestTemplate =
//                new TermVectorsRequest("authors", "fake_id");
//        tvrequestTemplate.setFields("user");
//        String[] ids = {"1", "2"};
//        MultiTermVectorsRequest mtvr =
//                new MultiTermVectorsRequest(ids, tvrequestTemplate);

        // 同步执行
        MultiTermVectorsResponse response =
                client.mtermvectors(request, RequestOptions.DEFAULT);

        // 解析响应
        List<TermVectorsResponse> tvresponseList =
                response.getTermVectorsResponses();
        if (tvresponseList != null) {
            for (TermVectorsResponse tvresponse : tvresponseList) {
            }
        }


        // 异步执行
//        client.mtermvectorsAsync( request, RequestOptions.DEFAULT, new ActionListener<MultiTermVectorsResponse>() {
//                    @Override
//                    public void onResponse(MultiTermVectorsResponse multiTermVectorsResponse) {
//
//                    }
//
//                    @Override
//                    public void onFailure(Exception e) {
//
//                    }
//                });
//        waitForTime(5000L);
    }
}
```

