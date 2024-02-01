# 分词器

**[lucene-learn](https://github.com/AntHubTC/lucene-learn)** com.tc.lucene.basic.AnalyzerTest

## 分词器作用

在创建索引的时候需要用到分词器，在使用字符串搜索的时候也会用到分词器，并且这两个地方要使用同一个分词器，否则可能会搜索不出来结果。

分词器(Analyzer)的作用是把一段文本中的词按规则取出所包含的所有词，对应的是Analyzer类，这是一个抽象类(org.apache.lucene.analysis.Analyzer)，切分词的具体规则是由子类实现的，所以对于不同的语言规则，要有不同的分词器。



## 分词器分类

分词器分为中文分词器和英文分词器：

### 英文分词器：

- StandardAnalyzer

  标准分词器：也叫单字分词，将中文一个字一个字的分词。

  根据空格和符号来完成分词，还可以完成数字、字母、E-mail地址、IP地址以及中文字符的分析处理，还可以支持过滤词表，用来代替StopAnalyzer能够实现的过滤功能。

- SimpleAnalyzer

  简单分词器：具备基本西文字符词汇分析的分词器，处理词汇单元时，以非字母字符作为分割符号。分词器不能做词汇的过滤，之进行词汇的分析和分割。输出地词汇单元完成小写字符转换，去掉标点符号等分割符。

- StopAnalyzer

  停用词分词器：能过滤词汇中的特定字符串和词汇，并且完成大写转小写的功能。

- WhitespaceAnalyzer

  空格分词器：根据空格进行分词

​	更多参见： org.apache.lucene.analysis.Analyzer的实现子类

### 中文分词器：

> 一般中分分词器也具备对英文分词的功能。

- SmartChineseAnalyzer 

  Luncene官方出的智能中文分词器

  ```xml
  <!-- lucene的中文分词器 -->
  <dependency>
      <groupId>org.apache.lucene</groupId>
      <artifactId>lucene-analyzers-smartcn</artifactId>
      <version>${lucene.version}</version>
  </dependency>
  ```

  > Lucene自带的分词器对中文分词的效果不是很理想

- IKAnalyzer

  IK分词器，[开源分词器](https://code.google.com/archive/p/ik-analyzer/)， [solor版](https://github.com/magese/ik-analyzer-solr)， [ES版](https://github.com/medcl/elasticsearch-analysis-ik)

- JcsegAnalyzer

  Jcseg分词器，[开源分词器](https://gitee.com/lionsoul/jcseg)

  

- 更多中文分词参考链接: [链接1](https://blog.51cto.com/u_16213562/8592638)









