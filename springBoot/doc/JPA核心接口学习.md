---
typora-root-url: ./
---

# JPA核心接口学习

源代码项目参考： 0013-spring-boot-jpa-h2 

![JPA Repository](E:\2_STUDY\testspace\SpringBoot学习\learn_spring_boot\0000-spring-boot-doc\img\JPA Repository.png)

## Spring Data JPA 提供的核心接口

1. ### Repository接口

   ​	这个接口本身是一个空接口。

   #### 使用方式：

   -  提供了方法名称命名的方式操作数据库

        如果查询条件不多，可以使用这个方法来查询，如果条件多了可读性就会很差，这个时候方法二更好一些。

     源代码参考UserRepositoryByName类中的实现。

   - 提供了基于@Query注解，通过SQL、HQL来操作数据库

     源代码参考UserRepositoryQueryAnnotation类中的实现。

2. ### CrudRepository接口

   ​	这个接口主要是完成一些增删改查的操作。

   ​	注意：CrudRepository继承了Repository接口，那么Repository中的特性那么在本接口中一样可以使用, 以下接口如果有继承关系也是差不多的。

   ![1556523017554](/img/1556523017554.png)

   此接口的实现中，所有的DML操作都已经被加上了@Transactional注解。

   源代码参考UserRepositoryCrudRepository类和UserRepositoryCrudRepositoryTest测试类。

3. ### PagingAndSortingRepository接口

   这个接口主要是提供了分页和排序的操作。

   注意：PagingAndSortingRepository继承了CrudRepository接口， 父接口的特性在本接口中同样可用。

   ![1556524642989](/img/1556524642989.png)

   源代码参考UserRepositoryPagingAndSorting类和UserRepositoryPagingAndSortingTest测试类。

   这个两个接口 是不能带参数查询的，这是两个接口的特点。

4. ### JpaRepository接口

   这个接口主要提供了对继承的父接口中的方法的返回值进行适配。

   注意：JpaRepository继承了PagingAndSortingRepository接口， 父接口的特性在本接口中同样可用。

   ![1556527279449](/img/1556527279449.png)

   源代码参考UserJPA和UserJpaRepositoryTest测试类。

5. ### JPASpecificationExectuor接口

   这个接口主要提供了多条件查询的支持，并且可以在查询中添加分页和排序。

   注意: 这个接口没有继承其它接口， 并且这个接口必须和上面的接口搭配使用（除了继承这个接口，还要继承其它接口），否则spring会报错。

![1556527895209](/img/1556527895209.png)



源代码参考UserJPA和UserJpaSpecificationTest测试类。