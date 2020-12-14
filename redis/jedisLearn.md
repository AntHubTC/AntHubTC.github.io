# Jedis

​	jedis在众多java的redis客户端中，语法最接近redis命令用法。

## maven坐标

```xml
<!-- jedis坐标 -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.3.0</version>
</dependency>
<!-- 自己做单元测试使用 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

## Jedis的基本使用方法

《Redis开发与运维》付磊 张益军 机械工业出版社 P119

```java
package com.tc.jedis.case1;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

/**
 * Jedis的基本使用方法
 */
public class Test1 {
    private Jedis jedis;

    @Before
    public void before() {
        jedis = new Jedis("127.0.0.1", 6379);
//        jedis = new Jedis("127.0.0.1", 6379, 4000000, 4000);

        if (jedis.isConnected()) {
            jedis.connect();
        }
    }

    @After
    public void after() {
        if (null != jedis) {
            jedis.disconnect();
            jedis.close();
        }
    }

    @Test
    public void test1() {
        // get set
        String setResult = jedis.set("hello", "world");
        System.out.println(setResult);
        String getResult = jedis.get("hello");

        System.out.println("hello " + getResult);
    }

    @Test
    public void test2() throws InterruptedException {
        SetParams setParams = new SetParams();
        setParams.px(3000l);

        jedis.set("hello", "world", setParams);
        Thread.sleep(3500l);
        String value = jedis.get("hello");

        System.out.println(value);
    }
}
```

## jedis操作redis多种数据结构

《Redis开发与运维》付磊 张益军 机械工业出版社 P119

```java
package com.tc.jedis.case1;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.SetParams;

import java.util.Set;

/**
 * Jedis对于Redis五种数据结构的操作
 */
public class Test2 {
    private Jedis jedis;

    @Before
    public void before() {
        jedis = new Jedis("127.0.0.1", 6379);
//        jedis = new Jedis("127.0.0.1", 6379, 4000000, 4000);

        if (jedis.isConnected()) {
            jedis.connect();
        }
    }

    @After
    public void after() {
        if (null != jedis) {
            jedis.disconnect();
            jedis.close();
        }
    }

    @Test
    public void test1() {
//        jedis.flushDB(); // 清空当前数据库
//        jedis.flushAll(); // 清空所有的数据库

        // 1.string
        jedis.set("hello", "world");
        System.out.println(jedis.get("hello"));
        System.out.println(jedis.incr("counter"));

        // 2.hash
        jedis.hset("myhash", "f1", "v1");
        jedis.hset("myhash", "f2", "v2");
        System.out.println(jedis.hgetAll("myhash"));

        // 3.list
        jedis.rpush("mylist", "1");
        jedis.rpush("mylist", "2");
        jedis.rpush("mylist", "3");
        System.out.println(jedis.lrange("mylist", 0, -1));

        // 4.set
        jedis.sadd("myset", "a");
        jedis.sadd("myset", "b");
        jedis.sadd("myset", "a");
        jedis.sadd("myset", "c");
        System.out.println(jedis.sismember("myset", "b"));
        System.out.println(jedis.smembers("myset"));

        // 5.zset
        jedis.zadd("myzset", 99, "tom");
        jedis.zadd("myzset", 66, "peter");
        jedis.zadd("myzset", 33, "james");
        System.out.println(jedis.zrangeWithScores("myzset", 0, -1));

        // keys
        System.out.println("\r\nkeys:");
        Set<String> keys = jedis.keys("*");
        for (String key : keys) {
            System.out.println(key);
        }
    }
}
```

## 引入protostuff序列化和反序列化java对象

​	《Redis开发与运维》付磊 张益军 机械工业出版社 P121

​		Jedis对于Redis java对象序列化和反序列化(protobuf) 序列化的技术有很多：XML、Json、谷歌的Protobuf、Facebook的Thrift等等.

### 引入protostuff坐标

```xml
<!-- 序列化和反序列化-->
<!-- https://mvnrepository.com/artifact/com.dyuproject.protostuff/protostuff-runtime -->
<dependency>
    <groupId>com.dyuproject.protostuff</groupId>
    <artifactId>protostuff-runtime</artifactId>
    <version>1.1.6</version>
</dependency>
<!-- https://mvnrepository.com/artifact/com.dyuproject.protostuff/protostuff-core -->
<dependency>
    <groupId>com.dyuproject.protostuff</groupId>
    <artifactId>protostuff-core</artifactId>
    <version>1.1.6</version>
    <scope>test</scope>
</dependency>
```



### 准备一个实体类Club

```java
package com.tc.jedis.pojo;

import java.io.Serializable;
import java.util.Date;

public class Club implements Serializable {
    private int id;
    private String name;
    private String info;
    private Date createDate;
    private int rank;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    @Override
    public String toString() {
        return "Club{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", info='" + info + '\'' +
                ", createDate=" + createDate +
                ", rank=" + rank +
                '}';
    }
}
```

### 封装的序列化工具类

```java
package com.tc.jedis.utils;

import com.dyuproject.protostuff.LinkedBuffer;
import com.dyuproject.protostuff.ProtostuffIOUtil;
import com.dyuproject.protostuff.Schema;
import com.dyuproject.protostuff.runtime.RuntimeSchema;

/**
 * proto 序列化工具类
 */
public class ProtostuffSerializer<T> {
    private Schema<T> schema;

    private ProtostuffSerializer(Class sourceClazz) {
        this.schema = RuntimeSchema.createFrom(sourceClazz);
    }

    public static <T> ProtostuffSerializer<T> newInstance(Class sourceClazz) {
        return new ProtostuffSerializer<T>(sourceClazz);
    }

    /**
     * 序列化
     * @param sourceObj
     * @return
     */
    public byte[] serialize(final T sourceObj) {
        final LinkedBuffer buffer = LinkedBuffer.allocate(LinkedBuffer.DEFAULT_BUFFER_SIZE);
        try {
            return serializeInternal(sourceObj, schema, buffer);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage(), e);
        } finally {
            buffer.clear();
        }
    }

    public T deserialize(final byte[] bytes) {
        try {
            T targetObj = deserializeInternal(bytes, schema.newMessage(), schema);
            return targetObj;
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage(), e);
        }
    }

    private byte[] serializeInternal(final T source, final Schema<T> schema, final LinkedBuffer buffer) {
        return ProtostuffIOUtil.toByteArray(source, schema, buffer);
    }

    private T deserializeInternal(final byte[] bytes, final T result, final Schema<T> schema) {
        ProtostuffIOUtil.mergeFrom(bytes, result, schema);
        return result;
    }
}

```

### 试一下

```java
package com.tc.jedis.case1;

import com.tc.jedis.pojo.Club;
import com.tc.jedis.utils.ProtostuffSerializer;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;

import java.util.Arrays;
import java.util.Date;

/**
 * Jedis对于Redis java对象序列化和反序列化(protobuf) 序列化的技术有很多：XML、Json、谷歌的Protobuf、Facebook的Thrift等等.
 */
public class Test3 {
    private Jedis jedis;

    @Before
    public void before() {
        jedis = new Jedis("127.0.0.1", 6379);
//        jedis = new Jedis("127.0.0.1", 6379, 4000000, 4000);

        if (jedis.isConnected()) {
            jedis.connect();
        }
    }

    @After
    public void after() {
        if (null != jedis) {
            jedis.disconnect();
            jedis.close();
        }
    }

    /**
     * 序列化工具测试
     */
    @Test
    public void test1() {
        Club club = getClubObj();

        // 获取序列化工具对象
        ProtostuffSerializer<Club> clubSerializer = ProtostuffSerializer.newInstance(Club.class);
        // 序列化
        byte[] clubObjBytes = clubSerializer.serialize(club);
//        System.out.println(new String(clubObjBytes));
        System.out.println(Arrays.toString(clubObjBytes));

        // 反序列化
        Club newClub = clubSerializer.deserialize(clubObjBytes);
        System.out.println(newClub);
    }

    /**
     * 将java对象通过protobuf序列化，存入redis，然后再从redis取出，进行反序列化输出
     */
    @Test
    public void test2() {
        System.out.println("将java对象通过protobuf序列化，存入redis，然后再从redis取出，进行反序列化输出");
        jedis.flushDB(); // 清空当前数据库
//        jedis.flushAll(); // 清空所有的数据库
        Club club = getClubObj();

        // 获取序列化工具对象
//        ProtostuffSerializer<Club> clubSerializer = ProtostuffSerializer.newInstance(Club.class);
        ProtostuffSerializer<Club> clubSerializer = ProtostuffSerializer.<Club>newInstance(Club.class);
        // 序列化
        byte[] clubObjBytes = clubSerializer.serialize(club);
//        System.out.println(new String(clubObjBytes));
        System.out.println(Arrays.toString(clubObjBytes));

        // 存入redis
        String setSatus = jedis.set("clob:1".getBytes(), clubObjBytes);
        System.out.println(setSatus);

        // 从redis中取出
        byte[] redisClubObjBytes = jedis.get("clob:1".getBytes());

        // 反序列化
        Club newClub = clubSerializer.deserialize(redisClubObjBytes);
        System.out.println(newClub);
    }

    private Club getClubObj() {
        Club club = new Club();

        club.setId(1);
        club.setName("张三");
        club.setInfo("是个xxx");
        club.setRank(89);
        club.setCreateDate(new Date());

        return club;
    }
}

```

## jedis连接池

​		 《Redis开发与运维》付磊 张益军 机械工业出版社 P122

​		上面的Jedis每次访问redis都会新建一个TCP连接，使用后就会再断开，对于频繁访问Redis的场景显然不是高效的使用方式。因此生产环境一般使用链接池的方式对Jedis连接进行管理。 

org.apache.commons.pool2.impl.GenericObjectPoolConfig重要属性：

​		![img](img/jedisLearn/20180727180151740)



```java
package com.tc.jedis.case1;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * Jedis链接池
 */
public class Test4 {
    private JedisPool jedisPool;

    @Before
    public void before() {
        GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
        // 设置最大连接数为默认值的5倍
        poolConfig.setMaxTotal(GenericObjectPoolConfig.DEFAULT_MAX_TOTAL * 5);
        // 设置最大空闲连接数为默认值的3倍
        poolConfig.setMaxIdle(GenericObjectPoolConfig.DEFAULT_MAX_IDLE * 3);
        // 设置最小连接数
        poolConfig.setMinIdle(GenericObjectPoolConfig.DEFAULT_MIN_IDLE * 2);
        // 设置开启jmx功能
        poolConfig.setJmxEnabled(true);
        // 设置链接池没有连接后客户端的最大等待时间（单位为毫秒）
        poolConfig.setMaxWaitMillis(3000);

        jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379);
    }

    @After
    public void after() {
        if (jedisPool != null) {
            jedisPool.close();
        }
    }

    public Jedis getJedis() {
        return jedisPool.getResource(); // 链接池获取连接
    }

    @Test
    public void test1() {
        // 从链接池拿到一个jedis连接
        Jedis jedis1 = getJedis();
        jedis1.set("hey", "hello world!");

        String hey;
        hey = jedis1.get("hey");
        System.out.println(hey);

        // 从链接池拿到一个jedis连接
        Jedis jedis2 = getJedis();

        hey = jedis2.get("hey");
        System.out.println(hey);
    }

}
```

## jedis使用redis Pipeline

```java
package com.tc.jedis.case1;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Jedis Pipeline管道
 */
public class Test5 {
    private Jedis jedis;

    @Before
    public void before() {
        jedis = new Jedis("127.0.0.1", 6379);
//        jedis = new Jedis("127.0.0.1", 6379, 4000000, 4000);

        if (jedis.isConnected()) {
            jedis.connect();
        }
    }

    @After
    public void after() {
        if (null != jedis) {
            jedis.disconnect();
            jedis.close();
        }
    }

    /**
     * 实现批量删除
     *
     * @param keys
     */
    public void mdel(List<String> keys) {
        // 生成pipeline管道对象
        Pipeline pipeline = jedis.pipelined();
        // pipeline执行命令，注意此命令没有真正的执行
        for (String key : keys) {
            pipeline.del(key);
        }
        // 执行命令
        pipeline.sync();
    }


    @Test
    public void test1() {
        jedis.set("hello", "world");
        jedis.set("aa1", "aa1");
        jedis.set("aa2", "aa2");

        mdel(Arrays.asList("hello", "aa1", "aa2"));
    }

    @Test
    public void test2() {
        Pipeline pipeline = jedis.pipelined();
        pipeline.set("hello", "world");
        pipeline.incr("counter");

        List<Object> returnList = pipeline.syncAndReturnAll();
        for (Object obj : returnList) {
            System.out.println(obj);
        }
    }
}
```

## jedis执行lua脚本

​	jedis提供了三个重要的函数实现Lua脚本的执行

```java
Object eval(String script, int keyCount, String... params);
Object evalsha(String sha1, int keyCount, String... params);
String scriptLoad(String script);
```

练习

```java
package com.tc.jedis.case1;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import redis.clients.jedis.Jedis;

/**
 * Jedis Lua脚本执行
 */
public class Test6 {
    private Jedis jedis;

    @Before
    public void before() {
        jedis = new Jedis("127.0.0.1", 6379);
//        jedis = new Jedis("127.0.0.1", 6379, 4000000, 4000);

        if (jedis.isConnected()) {
            jedis.connect();
        }
    }

    @After
    public void after() {
        if (null != jedis) {
            jedis.disconnect();
            jedis.close();
        }
    }

    // eval
    @Test
    public void test1() {
        String key = "hello";
        String script = "return redis.call('get',KEYS[1]);";
        Object scriptResult = jedis.eval(script, 1, key);
        System.out.println(scriptResult);
    }

    // scriptLoad evalsha
    @Test
    public void test2() {
        String script = "return redis.call('get',KEYS[1]);";
        String scriptSha1 = jedis.scriptLoad(script);

        String key = "hello";
        Object scriptResult = jedis.evalsha(scriptSha1, 1, key);
        System.out.println(scriptResult);
    }
}
```