# 开发环境搭建



## maven pom.xml

```xml
<dependencies>
		<!-- lucene核心库 -->
        <dependency>
            <groupId>org.apache.lucene</groupId>
            <artifactId>lucene-core</artifactId>
            <version>${lucene.version}</version>
        </dependency>
        <!-- Lucene的查询解析器 -->
        <dependency>
            <groupId>org.apache.lucene</groupId>
            <artifactId>lucene-queryparser</artifactId>
            <version>${lucene.version}</version>
        </dependency>
        <!-- lucene的默认分词器库 -->
        <dependency>
            <groupId>org.apache.lucene</groupId>
            <artifactId>lucene-analyzers-common</artifactId>
            <version>${lucene.version}</version>
        </dependency>
        <!-- lucene的高亮显示 -->
        <dependency>
            <groupId>org.apache.lucene</groupId>
            <artifactId>lucene-highlighter</artifactId>
            <version>${lucene.version}</version>
        </dependency>
        <!-- lucene的中文分词器 -->
        <dependency>
            <groupId>org.apache.lucene</groupId>
            <artifactId>lucene-analyzers-smartcn</artifactId>
            <version>${lucene.version}</version>
        </dependency>
        <!-- 三方分词器：IK中文分词器 -->
        <dependency>
            <groupId>com.github.magese</groupId>
            <artifactId>ik-analyzer</artifactId>
            <version>8.5.0</version>
        </dependency>
        <!-- 三方分词器jcseg中文分词器 -->
        <dependency>
            <groupId>org.lionsoul</groupId>
            <artifactId>jcseg-core</artifactId>
            <version>2.6.3</version>
        </dependency>
        <dependency>
            <groupId>org.lionsoul</groupId>
            <artifactId>jcseg-analyzer</artifactId>
            <version>2.6.3</version>
        </dependency>
</dependencies>
```



## 基础案例

文档对应的[代码工程](https://github.com/AntHubTC/lucene-learn)

**[lucene-learn](https://github.com/AntHubTC/lucene-learn)** com.tc.lucene.basic.BaseDemoTest