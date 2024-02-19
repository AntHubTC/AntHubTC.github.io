# 合并结果的多索引搜索

“合并结果的多索引搜索”（Multi-Index Searching with Merged Results）是 Lucene 提供的一项特性，它允许开发人员在多个独立的索引上执行搜索查询，并将这些查询的结果合并成单一的结果集返回给用户。

这种能力特别适用于以下几种场景：

1. **分布式存储**：当数据被存储在不同地方或者基于某种策略（例如按时间或类别）分散到不同的索引中时。
2. **扩展性和灵活性**：可以根据需要增加新的索引而不必重新索引现有数据。
3. **性能优化**：能够针对特定的索引执行查询，从而提升搜索的性能，尤其是当某些索引比其他索引更频繁地更新或查询时。

具体实现上，Lucene 使用 `MultiReader` 或者 `IndexSearcher` 类的某些版本来实现这种跨多个索引的搜索。这样做的好处之一就是透明地处理跨多个索引的搜索，对于执行搜索的开发人员来说，操作起来就像针对单一索引一样简单。

使用这种方法时，每个单独索引的结果会根据查询的相关性得分进行排序和合并，因此最终的结果集将是所有参与搜索的索引中相关性最高的记录的集合。

这种多索引搜索的特性非常适用于需要快速、高效处理大量分散数据的搜索系统。利用 Lucene 的这一特性，可以极大地提升搜索的灵活性和效率，满足复杂的业务需求。



## 案例代码

**[lucene-learn](https://github.com/AntHubTC/lucene-learn)** com.tc.lucene.basic.QueryTest#multiReader()



```java
@DisplayName("multiReader 合并结果的多索引搜索")
    @Test
    public void multiReader() throws IOException, ParseException {
        // 分布式存储、扩展性和灵活性、性能优化
        Analyzer analyzer = new IKAnalyzer();

        // 文档对象列表
        List<Document> documents = new ArrayList<>();
        // 收集文档数据
        BaseDemoTest.collectDocument(documents);

        // 分为2部分文档进行存储
        List<Document> documents1 = documents.subList(0, documents.size() / 2);
        List<Document> documents2 = documents.subList(documents.size() / 2, documents.size());

        // 写索引
        Directory indexDir1 = writeIndexDir(analyzer, documents1);
        Directory indexDir2 = writeIndexDir(analyzer, documents2);

        // 开始读多个索引
        IndexReader reader1 = DirectoryReader.open(indexDir1);
        IndexReader reader2 = DirectoryReader.open(indexDir2);

        // 使用MultiReader将两个索引reader合并
        MultiReader multiReader = new MultiReader(reader1, reader2);
        IndexSearcher searcher = new IndexSearcher(multiReader);

        // 创建查询
        QueryParser parser = new QueryParser("title", analyzer);
        Query query = parser.parse("谷歌地图之父和facebook关系");

        // 执行搜索
        TopDocs topDocs = searcher.search(query, 10); // 查找前10条结果
        System.out.println("文档搜索结果，命中目标:" + topDocs.totalHits);
        for (int i = 0; i < topDocs.scoreDocs.length; i++) {
            ScoreDoc scoreDoc = topDocs.scoreDocs[i];
            // 获取文档
            Document doc = searcher.doc(scoreDoc.doc);

            System.out.println("id:" + doc.get("id") + ",score:" + scoreDoc.score + ", \r\n\t\tcontent:" + doc.get("title"));
        }

        // 释放资源
        multiReader.close();
        indexDir1.close();
        indexDir2.close();
    }
```

