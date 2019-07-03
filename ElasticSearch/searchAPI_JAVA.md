[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/_search_apis.html)

## 查询API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-search.html)

```java
package com.tc.test.searchapi;

import com.tc.test.base.ElasticSearchBaseTest;
import org.apache.lucene.search.TotalHits;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.ShardSearchFailure;
import org.elasticsearch.action.support.IndicesOptions;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.MultiBucketsAggregation;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.bucket.terms.TermsAggregationBuilder;
import org.elasticsearch.search.aggregations.metrics.Avg;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightField;
import org.elasticsearch.search.sort.FieldSortBuilder;
import org.elasticsearch.search.sort.ScoreSortBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.elasticsearch.search.suggest.SuggestionBuilder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RunWith(JUnit4.class)
public class SearchAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        // 习惯看英文文档后，你会发现官网的英文文档真的不错。
        SearchRequest searchRequest = new SearchRequest();
        // 可以指定一个索引
//        SearchRequest searchRequest = new SearchRequest("posts");

        searchRequest.indices("posts");

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());

        searchRequest.source(searchSourceBuilder);

        // 可选参数 start
        {
            // 路由值
//            searchRequest.routing("routing");
            // 设置IndiceOptions控制如何解析不可用索引以及如何展开通配符表达式
//            searchRequest.indicesOptions(IndicesOptions.lenientExpandOpen());
            // 使用首选参数，例如执行搜索以首选本地碎片。默认值是在碎片之间随机化。
//            searchRequest.preference("_local");
        }
        // 可选参数 end

        // 同步执行
        try {
            SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);
            System.out.println(response);

            RestStatus status = response.status();
            TimeValue took = response.getTook();
            Boolean terminatedEarly = response.isTerminatedEarly();
            boolean timedOut = response.isTimedOut();

            int totalShards = response.getTotalShards();
            int successfulShards = response.getSuccessfulShards();
            int failedShards = response.getFailedShards();
            for (ShardSearchFailure failure : response.getShardFailures()) {
                // failures should be handled here
            }

            SearchHits hits = response.getHits();
            TotalHits totalHits = hits.getTotalHits();
            // the total number of hits, must be interpreted in the context of totalHits.relation
            long numHits = totalHits.value;
            // whether the number of hits is accurate (EQUAL_TO) or a lower bound of the total (GREATER_THAN_OR_EQUAL_TO)
            TotalHits.Relation relation = totalHits.relation;
            float maxScore = hits.getMaxScore();

            SearchHit[] searchHits = hits.getHits();
            for (SearchHit hit : searchHits) {
                // do something with the SearchHit
                String index = hit.getIndex();
                String id = hit.getId();
                float score = hit.getScore();

                String sourceAsString = hit.getSourceAsString();
                Map<String, Object> sourceAsMap = hit.getSourceAsMap();
                String documentTitle = (String) sourceAsMap.get("title");
                List<Object> users = (List<Object>) sourceAsMap.get("user");
                Map<String, Object> innerObject =
                        (Map<String, Object>) sourceAsMap.get("innerObject");


                // 接收高亮显示
                Map<String, HighlightField> highlightFields = hit.getHighlightFields();
                HighlightField highlight = highlightFields.get("title");
                Text[] fragments = highlight.fragments();
                String fragmentString = fragments[0].string();

            }

            // 接收分析聚合
            Aggregations aggregations = response.getAggregations();
            Terms byCompanyAggregation = aggregations.get("by_company");
            MultiBucketsAggregation.Bucket elasticBucket = byCompanyAggregation.getBucketByKey("Elastic");
            Avg averageAge = elasticBucket.getAggregations().get("average_age");
            double avg = averageAge.getValue();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.searchAsync(searchRequest, RequestOptions.DEFAULT, new ActionListener<SearchResponse>() {
//            @Override
//            public void onResponse(SearchResponse searchResponse) {
//            }
//            @Override
//            public void onFailure(Exception e) {
//                e.printStackTrace();
//            }
//        });
//        waitForTime(5000L);
    }
    @Test
    public void test2() {
        // 学习 SearchSourceBuilder
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        // 查询 query查询
        sourceBuilder.query(QueryBuilders.termQuery("user", "kimchy"));
        // 记录开始下标索引
        sourceBuilder.from(0);
        // 记录数
        sourceBuilder.size(5);
        // 超时时间
        sourceBuilder.timeout(new TimeValue(60, TimeUnit.SECONDS));

        // 添加到查询请求中
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices("posts");
        searchRequest.source(sourceBuilder);
    }
    @Test
    public void test3() {
        MatchQueryBuilder matchQueryBuilder = new MatchQueryBuilder("user", "kimchy");
//        MatchQueryBuilder matchQueryBuilder1 = QueryBuilders.matchQuery("user", "kimchy");

        // 启用模糊查询
        matchQueryBuilder.fuzziness(Fuzziness.AUTO);
        // 前缀长度
        matchQueryBuilder.prefixLength(3);
        // 设置最大扩展选项以控制查询的模糊过程
        matchQueryBuilder.maxExpansions(10);

        // matchQueryBuilder必须添加到SearchSourceBuilder中
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(matchQueryBuilder);

        // 指定排序
        searchSourceBuilder.sort(new ScoreSortBuilder().order(SortOrder.DESC));
        searchSourceBuilder.sort(new FieldSortBuilder("_id").order(SortOrder.ASC));

        // 关闭查询source
//        searchSourceBuilder.fetchSource(false);

        // 查询哪些， 排除哪些
//        String[] includeFields = new String[] {"title", "innerObject.*"};
//        String[] excludeFields = new String[] {"user"};
//        searchSourceBuilder.fetchSource(includeFields, excludeFields);

        // 请求高亮
        HighlightBuilder highlightBuilder = new HighlightBuilder();
        HighlightBuilder.Field highlightTitle =
                new HighlightBuilder.Field("title");
        highlightTitle.highlighterType("unified");
        highlightBuilder.field(highlightTitle);
        HighlightBuilder.Field highlightUser = new HighlightBuilder.Field("user");
        highlightBuilder.field(highlightUser);
        searchSourceBuilder.highlighter(highlightBuilder);

        // 请求聚合
        TermsAggregationBuilder aggregation = AggregationBuilders.terms("by_company")
                .field("company.keyword");
        aggregation.subAggregation(AggregationBuilders.avg("average_age")
                .field("age"));
        searchSourceBuilder.aggregation(aggregation);

        // 添加搜索建议
        SuggestionBuilder termSuggestionBuilder =
                SuggestBuilders.termSuggestion("user").text("kmichy");
        SuggestBuilder suggestBuilder = new SuggestBuilder();
        suggestBuilder.addSuggestion("suggest_user", termSuggestionBuilder);
        searchSourceBuilder.suggest(suggestBuilder);

        // 分析特定搜索请求的查询和聚合的执行情况
        searchSourceBuilder.profile(true);

        // 添加到查询请求中
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices("posts");
        searchRequest.source(searchSourceBuilder);

        try {
            client.search(searchRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



## 滚动查询API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-search-scroll.html)

```java
package com.tc.test.searchapi;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(JUnit4.class)
public class SearchScrollAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() throws IOException {
        SearchRequest searchRequest = new SearchRequest("posts");
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
//        searchSourceBuilder.query(matchQuery("title", "Elasticsearch"));
//        searchSourceBuilder.size(size);
        searchRequest.source(searchSourceBuilder);
        searchRequest.scroll(TimeValue.timeValueMinutes(1L));

        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        String scrollId = searchResponse.getScrollId();
        SearchHits hits = searchResponse.getHits();

        // 通过上面得到的scrollid继续滚动查询
        SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
        scrollRequest.scroll(TimeValue.timeValueSeconds(30));
        SearchResponse searchScrollResponse =
                client.scroll(scrollRequest, RequestOptions.DEFAULT);
        scrollId = searchScrollResponse.getScrollId();
        hits = searchScrollResponse.getHits();
        assertEquals(3, hits.getTotalHits().value);
        assertEquals(1, hits.getHits().length);
        assertNotNull(scrollId);
    }
}
```



## 清除滚动API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-clear-scroll.html)

```java
package com.tc.test.searchapi;

import com.tc.test.base.ElasticSearchBaseTest;
import org.elasticsearch.action.ActionListener;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.ClearScrollResponse;
import org.elasticsearch.client.RequestOptions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import java.io.IOException;

@RunWith(JUnit4.class)
public class CearScrollAPIDemo extends ElasticSearchBaseTest {
    @Test
    public void test1() {
        String scrollId = ""; // 上面返回的
        ClearScrollRequest request = new ClearScrollRequest();
        request.addScrollId(scrollId);
        // 或者使用
//        request.setScrollIds(scrollIds);

        // 同步执行
        try {
            ClearScrollResponse response = client.clearScroll(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 异步执行
//        client.clearScrollAsync(request, RequestOptions.DEFAULT, new ActionListener<ClearScrollResponse>() {
//            @Override
//            public void onResponse(ClearScrollResponse clearScrollResponse) {
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//            }
//        });
//        waitForTime(50000L);
    }
}
```

## Multi查询API

[官方文档](https://www.elastic.co/guide/en/elasticsearch/client/java-rest/7.2/java-rest-high-multi-search.html)

// TODO：：后面有时间再学吧，一直啃官方文档有点伤，休息一段时间。