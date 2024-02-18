# 高亮显示查询结果

**[lucene-learn](https://github.com/AntHubTC/lucene-learn)** com.tc.lucene.basic.HighlighterTest

## 依赖

```xml
<!-- lucene的高亮显示 -->
<dependency>
    <groupId>org.apache.lucene</groupId>
    <artifactId>lucene-highlighter</artifactId>
    <version>${lucene.version}</version>
</dependency>
```

## 案例源代码

```java
/**
 * 高亮显示案例
 *
 * @author AnthubTC
 * @version 1.0
 * @className HighlighterTest
 * @description
 * @date 2024/2/18 15:12
 **/
@Slf4j
@DisplayName("高亮查询显示")
public class HighlighterTest extends LuceneLearnApplicationTests {
    @Resource
    private LuceneDemoConfig luceneDemoConfig;

    @DisplayName("QueryParser")
    @ParameterizedTest
    @ValueSource(strings = {
            "谷", "歌", "地图",
            // SmartChineseAnalyzer没有切分出来的分词
            "谷歌地图", "谷歌地图之父加盟"
    })
    // 查询解析器（Query Parser）：Lucene 的查询解析器可以将用户输入的查询字符串解析为 Lucene 查询对象，从而进行有效的匹配和搜索。
    public void queryParserTest(String val) throws ParseException, IOException {
        // QueryParser会使用分词器分词后匹配查询
        // 这里特别注意：查询的分词器要和索引的时候的分词器保持一致，否则搜索结果匹配会不理想
        Analyzer analyzer = new SmartChineseAnalyzer();
        QueryParser parser = new QueryParser("title", analyzer);
        Query query = parser.parse(val);

        System.out.print("查询条件：【" + val + "】,");
        AnalyzerUtil.displayToken(val, analyzer);

        // 设置索引存储路径
        Directory indexDir = FSDirectory.open(new File(luceneDemoConfig.getDemoIndexDbPath("testCreate")).toPath());
        // 创建索引读取器
        try (IndexReader indexReader = DirectoryReader.open(indexDir)) {
            IndexSearcher indexSearcher = new IndexSearcher(indexReader);

            TopDocs topDocs = indexSearcher.search(query, 10);
            System.out.println("文档搜索结果，命中目标:" + topDocs.totalHits);

            UnifiedHighlighter highlighter = new UnifiedHighlighter(indexSearcher, new SmartChineseAnalyzer());
            // 默认html标签
            // highlighter.setFormatter(new DefaultPassageFormatter());
            // 自定义前后标识
            highlighter.setFormatter(new DefaultPassageFormatter(" <span class=\"high-lighter-block\">", "</span> ", "... ", false));
            //highlighter.setFormatter(new DefaultPassageFormatter(" 【", "】 ", "... ", false));
            String[] contentHightFragments = highlighter.highlight("title", query, topDocs, 10); // 获取高亮显示结果

            for (int i = 0; i < topDocs.scoreDocs.length; i++) {
                ScoreDoc scoreDoc = topDocs.scoreDocs[i];
                // 获取文档
                Document doc = indexReader.document(scoreDoc.doc);

                System.out.println("id:" + doc.get("id") + ",score:" + scoreDoc.score + ", \r\n\t\tcontent:" + doc.get("title"));
                // 高亮显示
                System.out.println("高亮显示:" + contentHightFragments[i] + "\n");
            }
        }
    }
}
```



## 效果

```txt
查询条件：【谷歌地图】,分词结果：[谷][歌][地图]
文档搜索结果，命中目标:10 hits
id:3,score:0.35866353, 
		content:谷歌地图创始人拉斯离开谷歌加盟Facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 创始人拉斯离开 <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span> 加盟Facebook

id:3,score:0.35866353, 
		content:谷歌地图创始人拉斯离开谷歌加盟Facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 创始人拉斯离开 <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span> 加盟Facebook

id:1,score:0.33722228, 
		content:谷歌地图之父跳槽facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父跳槽facebook

id:2,score:0.33722228, 
		content:谷歌地图之父加盟facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父加盟facebook

id:1,score:0.33722228, 
		content:谷歌地图之父跳槽facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父跳槽facebook

id:2,score:0.33722228, 
		content:谷歌地图之父加盟facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父加盟facebook

id:5,score:0.28567234, 
		content:谷歌地图之父拉斯加盟社交网站Facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父拉斯加盟社交网站Facebook

id:5,score:0.28567234, 
		content:谷歌地图之父拉斯加盟社交网站Facebook
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父拉斯加盟社交网站Facebook

id:4,score:0.2751568, 
		content:谷歌地图之父跳槽Facebook与wave项目取消有关
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父跳槽Facebook与wave项目取消有关

id:4,score:0.2751568, 
		content:谷歌地图之父跳槽Facebook与wave项目取消有关
高亮显示: <span class="high-lighter-block">谷</span>  <span class="high-lighter-block">歌</span>  <span class="high-lighter-block">地图</span> 之父跳槽Facebook与wave项目取消有关
```

## 实战提示

> 实际开发的时候通常是转换为html标签，在html中对html做特殊css渲染处理。