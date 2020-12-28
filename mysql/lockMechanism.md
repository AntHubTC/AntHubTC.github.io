# 锁机制

## 概述

### 定义

​		锁是计算机协调多个进程或线程并发访问某一资源的机制。

​		在数据库中，除传统的计算资源（如CPU、RAM、I/O等）的争用以外，数据也是一种供许多用户共享的资源。如何保证数据并发访问的一致性、有效性是所有数据库必须解决 的一个问题，锁冲突也是影响数据库并发访问性能的一个重要因素。从这个角度来说，锁对数据库而言显得由其重要，也更加复杂。

**购物举例：**

​		打个比方，我们到淘宝上买一件商品，商品只有一件库存，这个时候如果还有另一个人买，那么如何解决是你买到还是另一个人买到的问题？

![image-20201228101542069](img/lockMechanism/image-20201228101542069.png)

​		这里肯定要用到事务，我们先从库存表中取出物品数量，然后插入订单，付款后插入付款表信息，然后更新商品数量，在这个过程中，使用锁可以对有限的资源进行保护，解决隔离和并发的矛盾。

### 锁的分类

从对数据操作的类型（读\写）分类

- 读锁（共享锁）

  针对同一份数据，多个读操作可以同时进行而不会相互影响。

- 写锁（排它锁）

  当前写没有完成前，它会阻断其他写锁和读锁。

从对数据操作的粒度分类

- 表锁
- 行锁

## 表锁（偏读）

### 特点

​	偏向MyISAM存储引擎，开销小，加锁块；无死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低。

### 手动加表锁

```mysql
lock table 表名字1 read/write 【， 表名字2 reade/write, 其他;】
```

### 查看锁

```mysql
-- 查看是否有表锁住了
show open tables;
```

### 解锁

```mysql
unlock tables;
```

### 案件分析

建表SQL

```mysql
create table mylock(
	id int not null primary key auto_increment,
    name varchar(20)
) engine myisam;

insert mylock(name) values('a');
insert mylock(name) values('b');
insert mylock(name) values('c');
insert mylock(name) values('d');
insert mylock(name) values('e');

select * from mylock;
```

加读锁,写锁

```mysql
mysql> lock table mylock read,test03 write;
Query OK, 0 rows affected (0.00 sec)
mysql> show open tables;
```

| Database                | Table                      | In_use | Name_locked |

| myemployees        | test03                     |      1     |           0             |

| myemployees        | mylock                    |      1     |           0             |

解锁

```mysql
unlock tables;
show open tables;
```

### 案件结论

MyISAM:

| 锁名称 | 自己查看 | 自己修改  | 查询其它表 | 其它连接查看 | 其它连接修改 | 其它连接查询其它表 |
| ------ | -------- | --------- | ---------- | ------------ | ------------ | ------------------ |
| 表读锁 | Y        | N（报错） | N（报错）  | Y            | N（阻塞）    | Y                  |
| 表写锁 | Y        | Y         | N          | N(阻塞)      | N(阻塞)      | Y                  |

MyISAM在执行查询语句SELECT前，会自动给涉及的所有表加读锁，在执行增删改操作前，会自动给涉及的表加写锁，

MySQL的表级锁有两种模式：

表共享锁（Table Read Lock）

表独占写锁（Table Write Lock）

| 锁类型 | 是否兼容 | 读锁 | 写锁 |
| ------ | -------- | ---- | ---- |
| 读锁   | 是       | 是   | 否   |
| 写锁   | 是       | 否   | 否   |

所以对MyISAM表进行操作，会有以下情况：

1. 对MyISAM表的读操作（加读锁），不会阻塞其他进程对同一表的读请求，但会阻塞对同一表的写请求，只有当读锁释放后，才会执行其它进程的写操作。
2. 对MyISAM表的写操作（如加写锁），会阻塞其他进程对同一表的读和写操作，只有当写锁释放后，才会执行其它进程的读写操作。

> 简而言之，就是**读锁会阻塞写，但不会阻塞读，而写锁则会把读和写都阻塞。**

### 表锁分析

有哪些表被锁了？  show open tables;

如何分析表锁定？

```mysql
-- 可以通过检查table_locks_waited和table_locks_immediate状态变量来分析系统上的表锁定。
show status like 'table%';
```

- table_locks_immediate: 产生表级锁定的次数，表示可以立即获取锁的查询次数，每立即获取锁值加1；
- table_locks_waited：出现表级锁定争用而发生等待的次数（不能立即获取锁的次数，每等待一次锁值加1）。此值高则说明存在较严重的表级锁争用情况；

​       MyISAM的读写锁调度是写优先，这也是MyISAM不适合做写为主的表的引擎，因为写锁后，其他线程不能做任何操作，大量的更新会使查询很难得到锁，从而造成永远阻塞。

## 行锁（偏写）

### 特点

​		偏向InnoDB存储引擎，开销大，加锁慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度也最高。

​		InnoDB与MyISAM最大的不同的两点：一是支持事务 ；二是是采用行级锁。

### 建表

```mysql
create table test_innodb_lock(a int(11), b varchar(16)) engine=innodb;

insert into test_innodb_lock values(1, 'b2');
insert into test_innodb_lock values(3, '3');
insert into test_innodb_lock values(4, '4000');
insert into test_innodb_lock values(5, '5000');
insert into test_innodb_lock values(6, '6000');
insert into test_innodb_lock values(7, '7000');
insert into test_innodb_lock values(8, '8000');
insert into test_innodb_lock values(9, '9000');
insert into test_innodb_lock values(1, 'b1');

create index test_innodb_lock_a_ind on test_innodb_lock(a);
create index test_innodb_lock_b_ind on test_innodb_lock(b);
```

```mysql
-- 关闭自动提交
set autocommit=0;
update test_innodb_lock set b='4001' where a=4;
```

无索引行锁升级为表锁

**间隙锁危害：**

```mysql
-- Terminal 1
set autocommit=0;
update test_innodb_lock set b='0629' where a>1 and b<6;
-- 执行2中的语句，看效果
commit;
-- Terminal 2
set autocommit=0;
insert into test_innodb_lock values(2, '2000')
-- 阻塞 一直等到会话1提交
commit;
```

什么是间隙锁？

​		当我们使用范围条件而不是相等条件检索数据，并请求共享或排他锁时，InnoDB会给符合条件的已有数据记录的索引加锁；对于键值在条件范围内但不存在的记录，叫做“间隙（GAP）”，InnoDB也会对这个“间隙”加锁，这个锁机制就是所谓的间隙锁（Next-Key锁）。

危害：

​		因为Query执行过程中通过范围查找的话，他会锁定整个范围内所有的索引值，即使这个键值并不存在。间隙锁有一个比较致命的弱点，就是当锁定一个范围键值之后，即使某些不存在的键值也会被无辜的锁定，而造成在锁定的时候无法插入锁定键值范围内的任何数据，在某些场景下这可能会对性能造成很大的危害。

### 结论

​	Innodb存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面锁带来的性能损耗可能比表级锁定会高一些，但是在整体并发处理能力方面要远远优于MyISAM的表级锁定的。当系统并发量比较高的时候，Innodb的整体性能和MyISAM相比就会有比较明显的优势了。

​		但是，Innodb的行级锁定同样也有脆弱的一面，当我们使用不当的时候，可能会让Innodb的整体性能表现不仅不能比MyISAM高，甚至可能会更差。

### 行锁分析

​		通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况。

```mysql
show status like 'innodb_row_lock%';
```

对这个状态量的说明如下：

Innodb_row_lock_current_waits: 当前正在等待锁定的数量；
Innodb_row_lock_time: 从系统启动到现在锁定总时间长度；
Innodb_row_lock_time_avg: 每次等待所花平均时间；
Innodb_row_lock_time_max:从系统启动到现在等待最长的一次所花的时间；
Innodb_row_lock_waits: 系统启动后到现在总共等待的次数；

这5个状态变量，比较重要的主要是：Innodb_row_lock_time，Innodb_row_lock_time_avg、Innodb_row_lock_waits。尤其是当等待次数很高，而且每次等待时长也不小的时候，我们就需要分析系统中为什么会有如此多的等待，然后根据分析结果着手指定优化计划。

### 优化建议

1. 尽可能让所有数据检索都通过索引完成，避免无索引行锁升级为表锁；
2. 合理设计索引，尽量缩小锁的范围；
3. 尽可能较少检索条件，避免间隙锁；
4. 尽量控制事务大小，减少锁定资源量和时间长度；
5. 尽可能低级别事务隔离；

## 页锁

​		开销和加锁时间界于表锁和行锁之间；会出现死锁；锁定粒度界于表锁和行锁之间，并发度一般。  了解即可。









