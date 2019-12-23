# IDEA插件

## 单元测试覆盖率-JaCoCo插件

### pom配置

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

    <groupId>cn.demo</groupId>
    <artifactId>answers</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>
    <name>answers</name>
    <url>http://maven.apache.org</url>
  
    <build>
        <finalName>answers</finalName>
        <plugins>
            <plugin>
                <inherited>true</inherited>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.1</version>
                <configuration>
                    <source>${compiler.source}</source>
                    <target>${compiler.target}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>

　　　　　　　　<!--检查代码覆盖率的插件配置-->
             <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>0.7.8</version>
                <executions>
                    <execution>
                        <id>prepare-agent</id>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>
                    <execution>
                          <id>check</id>
                        <goals>
                            <goal>check</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>report</id>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>
                </executions>
                
                <!-- Configuration 里面写配置信息 -->
                <configuration>
                <!-- 配置rules里面指定覆盖规则 -->
                <rules>
                  <rule implementation="org.jacoco.maven.RuleConfiguration">
                    <element>BUNDLE</element>
                    <limits>
                         <!-- 指定方法覆盖到80% -->
                      <limit implementation="org.jacoco.report.check.Limit">
                        <counter>METHOD</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.80</minimum>
                      </limit>
                        <!-- 指定指令覆盖到80% -->
                      <limit implementation="org.jacoco.report.check.Limit">
                        <counter>INSTRUCTION</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.80</minimum>
                      </limit>
                       <!-- 指定行覆盖到80% -->
                      <limit implementation="org.jacoco.report.check.Limit">
                        <counter>LINE</counter>
                        <value>COVEREDRATIO</value>
                        <minimum>0.80</minimum>
                      </limit>
                      <!-- 指定类覆盖到100%，不能遗失任何类 -->
                      <limit implementation="org.jacoco.report.check.Limit">
                        <counter>CLASS</counter>
                        <value>MISSEDCOUNT</value>
                            <maximum>0</maximum>
                      </limit>
                      
                    </limits>
                  </rule>
                </rules>
                </configuration>
            </plugin>
            
        </plugins>
    </build>
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <compiler.source>1.7</compiler.source>
        <compiler.target>1.7</compiler.target>
        <junit.version>4.12</junit.version>
    </properties>

    <dependencies>
        <!-- 新增jacoco的maven插件 -->
        <dependency>
            <groupId>org.jacoco</groupId>
            <artifactId>jacoco-maven-plugin</artifactId>
            <version>0.7.8</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>        
</project>
```

### 单元测试运行换JaCoCo

> 如果覆盖率达不到，并且没有跳过测试，那么install会报错。

![img](.\img\20180925110855419.png)

## CamelCase

大小写及驼峰转换插件 快捷键使用 ➡️ `Shift + Alt + U`

## CodeGlance

代码编辑区缩略图插件 快捷键使用 ➡️ `Ctrl + Shift + G`

### Free MyBatis plugin

让方法和mapper文件之间直接跳转

