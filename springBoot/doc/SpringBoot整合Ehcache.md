# SpringBoot整合Ehcache

源代码项目参考：0025-spring-boot-ehcache

## pom.xml文件添加坐标

```xml
        <!-- Spring Boot缓存支持启动器 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>

        <!-- Ehcache坐标 -->
        <dependency>
            <groupId>net.sf.ehcache</groupId>
            <artifactId>ehcache</artifactId>
        </dependency>
```

## 创建Ehcache的配置文件

文件名：ehcache.xml

位置：src/main/resources/ehcache.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://ehcache.org/ehcache.xsd">
    <diskStore path="java.io.tmpdir"/>

    <!--
        ehcache的默认缓存策略:
            maxElementsInMemory 内存中缓存最大个数
            eternal 是否做持久化的处理
            timeToIdleSeconds  当缓存闲置n秒后销毁
            timeToLiveSeconds 当缓存存活n秒后销毁
    -->
    <defaultCache
            maxElementsInMemory="10000"
            eternal="false"
            timeToIdleSeconds="120"
            timeToLiveSeconds="120"
            maxElementsOnDisk="10000000"
            diskExpiryThreadIntervalSeconds="120"
            memoryStoreEvictionPolicy="LRU">
        <persistence strategy="localTempSwap"/>
    </defaultCache>

    <!-- 自定义缓存策略 -->
    <cache name="users"
           maxElementsInMemory="10000"
           eternal="false"
           timeToIdleSeconds="120"
           timeToLiveSeconds="120"
           maxElementsOnDisk="10000000"
           diskExpiryThreadIntervalSeconds="120"
           memoryStoreEvictionPolicy="LRU">
        <persistence strategy="localTempSwap"/>
    ></cache>
</ehcache>
```

## application.properties文件：

```properties
# ====================== 缓存配置 ======================
spring.cache.ehcache.config=classpath:ehcache.xml
```

## 启动类修改

​	为启动类加上@EnableCaching注解，表示启动缓存。

## javaBean类修改

​	ehcache要求缓存的bean对象，必须实现Serializable序列号接口。

## 缓存接口标注

​	在要进行缓存的接口上添加注解：

```java
//    @Cacheable 采用默认的配置策略缓存
    @Cacheable("users") // 采用自定义的策略缓存
    public User findUserById(Integer id) {
        return userRepository.findById(id.longValue()).get();
    }
```



## @Cacheable 和@CacheEvict

### @Cacheable 

​		将方法的返回值添加到Ehcache中做缓存。

​		value属性：指定一个Ehache配置文件中的缓存策略，如果没有指定的value，表示使用默认的缓存策略。

​		key属性： 缓存采用的key，默认采用的是将参数对象作为key，值为#参数名。  是否从缓存中取值，取决于这个key。

```java
    @Override
//    @Cacheable(value = "users", key = "#pageable") // 默认
//    @Cacheable(value = "users", key = "#pageable.pageSize") // 自定义key
    public Page<User> findUserByPage(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
```

### @CacheEvict

​	作用：清除缓存。

​	常放在会对数据发生改变的方法之上，清除缓存后以便于下次查询从持久层查询最新的数据。

```java
	@Override
    // 清除缓存中已users缓存策略缓存的对象
    @CacheEvict(value = "users", allEntries= true)
    public void saveUser(User user) {
        userRepository.save(user);
    }
```

