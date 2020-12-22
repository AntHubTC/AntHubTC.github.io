# MySql基础使用

## 命令行连接mysql

```bash
# mysql -h 主机名 -P 端口号 -u 用户名 -p密码
mysql -uroot -p123456
exit 或 ctrl+c 退出
```

## MySql的常见命令

```bash
# 1. 查看当前所有数据库
show databases;
# 2. 打开指定数据库
use 库名;
select database(); # 查看当前库名
# 3. 查看当前库所有表
show tables;
show tables from 库名;
# 4. 创建表
create table 表名(
	列名  列类型,
	列名  列类型,
	...
);
# 5. 查看表结构
desc 表名;
# 6.查看服务器版本
# 登录情况下
select version();
# 未登录
mysql --version
mysql -V
```

## MySql语法规范

- 不区分大小写，但是建议关键字大写，表名、列名小写；
- 每条命令最好用分号结尾；
- 每条命令根据需要，可以进行缩进或换行；
- 注释
  - 单行注释    # 注释文字
  - 单行注释   -- 注释文字
  - 多行注释   /* 注释文字 */

## 执行sql脚本文件

### 方法一

mysql –u用户名 –p密码 –D数据库<【sql脚本文件路径全名】

### 方法二

mysql控制台

```bash
Mysql> source 【sql脚本文件的路径全名】
```

## DQL数据查询语言

### 基础语法格式

select select_list

[into new_table_name]

from table_source

[where search_conditions]

[group by group_by_expression]

[having search_conditions]

ORDER BY field1 [ASC [DESC]], [field2...] [ASC [DESC]]

LIMIT [offset,] size;  -- 或  LIMIT size OFFSET offset

**说明：**

into:创建新表并将查询结果插入新表中。

new_table_name：表示保存查询结果的新表名。

table_source：指定查询的表或视图，派生表和联接表。

search_conditions：条件表达式，可以使关系表达式，也可以是逻辑表达式, like模糊匹配， REGEX 正则表达式。

group by：将查询结果按指定的表达式分组。

group_by_expression：对其执行分组的表达式，group_by_expression也称为分组列，group_by_expression可以使列或引用列的非聚合表达式。

having：指定满足条件的组才予以输出。having通常与group by 的子句一起使用。

order by：指定结果集的排列顺序。

ASC：递增，从低到高排。

DESC：递减，从高到低排。

### 连接查询

左（外）连接，右（外）连接，全（外）连接(mysql没有)，内连接(inner)，等值连接(where a.id = b.id)

[LEFT|RIGHT|INNER] JOIN tableName ON  condition

```sql
select a.*, b.department_name
from employees a
left join departments b
on a.department_id = b.department_id;

select a.*, b.department_name
from employees a,departments b
where a.department_id = +b.department_id;
```

左连接和左外连接 left join*左连接* left outer join *左外连接* 只是写法不同,相同的概念。

sql92标准：仅仅支持内连接

sql99标准【推荐】：支持内连接+外连接（左外和右外）+交叉连接

按功能分类：

- 内连接

  - 等值连接

    ```sql
    select column1,.... from table1 A, table2 B where A.id = B.id;
    ```

  - 非等值连接 (不是等于=以外的连接，如大于小于等)

    ```sql
    select emp_id, emp_name, salary, grade_level from employees e, job_grades g where e.salary between g.lowest_sal and g.highest_sal;
    ```

  - 自连接 (自己连接自己  这种常见于上下级结构 比如：表里面有员工信息，还有员工的上级领导id)

    ```sql
    select a.emp_id, a.emp_name, b.emp_id, b_emp_name where employees a,employees b and a.emp_super_id = b.emp_id
    ```

- 外连接

  - 左外连接

    ```sql
    select column1,... from tableA A left [out] join table B as B on A.id = B.id
    ```

  - 右外连接

    ```sql
    select column1,... from tableA A right [out] join table B as B on A.id = B.id
    ```

  - 全外连接

    ```sql
    select column1,... from tableA A full [out] join table B as B on A.id = B.id
    ```

- 交叉连接  (笛卡尔乘积)

```sql
select column1,... from tableA cross join tableB;
-- 和下面相同
select column1,... from tableA, tableB;
```

### 子查询

```sql
select *
from departments
where department_id in (
    select department_id from employees
    where salary > 10000
)
```

### 分页查询

```sql
-- 显示行号
select row_number() over (order by department_id) as rn, d.*
from departments d;
-- 分页查询
select * from departments limit 5, 10;
select * from departments limit 10 offset 5;
```

### 联合查询

```sql
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions]
UNION [ALL | DISTINCT]
SELECT expression1, expression2, ... expression_n
FROM tables
[WHERE conditions];
```

- **expression1, expression2, ... expression_n**: 要检索的列。
- **tables:** 要检索的数据表。
- **WHERE conditions:** 可选， 检索条件。
- **DISTINCT:** 可选，删除结果集中重复的数据。默认情况下 UNION 操作符已经删除了重复数据，所以 DISTINCT 修饰符对结果没啥影响。
- **ALL:** 可选，返回所有结果集，包含重复数据。

### 正则表达式

```sql
--like
select * from employees where first_name like 'A%' or first_name like 'B%'
-- regex
select * from employees where first_name regexp '^[A|B]]*'
```

## mysql查询语句执行顺序

SQL语言不同于其他编程语言的最明显特征是处理代码的顺序。在大多数据库语言中，代码按编码顺序被处理。但在SQL语句中，第一个被处理的子句式FROM，而不是第一出现的SELECT。SQL查询处理的步骤序号：

(1) FROM <left_table>

(2) ON <join_condition>

(3) <join_type> JOIN <right_table>

(4) WHERE <where_condition>

(5) GROUP BY <group_by_list>

(6) WITH {CUBE | ROLLUP}

(7) HAVING <having_condition>

(8) SELECT

(9) DISTINCT

(9) ORDER BY <order_by_list>

(10) LIMIT

以上每个步骤都会产生一个虚拟表，该虚拟表被用作下一个步骤的输入。这些虚拟表对调用者(客户端应用程序或者外部查询)不可用。只有最后一步生成的表才会会给调用者。如果没有在查询中指定某一个子句，将跳过相应的步骤。

## DML数据操作语言

### 数据插入

**方式1、 INSERT INTO t1(field1,field2) VALUE(v001,v002);**      

 明确只插入一条Value

**方式2、 INSERT INTO t1(field1,field2) VALUES(v101,v102),(v201,v202),(v301,v302),(v401,v402);**

在插入批量数据时 **方式2** ***\*优于\**** **方式1**.

**【特注】**当 id 为自增，即 id INT PRIMARY KEY AUTO_INCREMENT 时，执行 insert into 语句，需要将除 id 外的所有 field 列举出来（有没有感觉，好不方便，期待 mysql 提供一个简便方法来标记这种情况，因为在早测试数据的时候，普遍会使用，而列举出除 id 外所有字段，真有麻烦感）。

**方式3.1、 INSERT INTO t2(field1,field2) SELECT colm1,colm2 FROM t1 WHERE ……**

这里简单说一下，由于可以指定插入到 talbe2 中的列，以及可以通过相对较复杂的查询语句进行数据源获取，可能使用起来会更加的灵活一些，但我们也必须注意，我们在指定目标表的列时，一定要将所有非空列都填上，否则将无法进行数据插入，还有一点比较容易出错的地方就是，当我们写成如下简写格式：

**方式3.2、 INSERT INTO t2 SELECT colm1,colm2,…… FROM t1**

此时，我们如果略掉了目标表的列的话，则默认会对目标表的全部列进行数据插入，且 SELECT 后面的列的顺序 必须和目标表中的列的定义顺序完全一致 才能完成**正确**的数据插入，这是一个很容易被忽略的地方，值得注意。

***\*【特注】\****由于插入操作只粗略地对表 t1、t2 按顺序对所有字段进行 [**数据类型**] 检查，不对 [**字段名**] 核对。这是把双刃剑，既提供便利，又存在可能因粗心造成风险。在使用中，需确认顺序，使用中建议使用 [**方式3.1**] 或 [**方式4**].

**方式4、INSERT INTO 表名 SET 列名1 = 列值1,列名2=列值2,...;（博友提供，感谢）**

不过用INSERT INTO SET这种方式，不能批量增加数据。（参考：[mysql数据库中插入数据INSERT INTO SET的优势](https://www.cnblogs.com/html55/p/9708475.html)）

### 数据修改

Single-table语法：

```sql
UPDATE [LOW_PRIORITY] [IGNORE] tbl_name
    SET col_name1=expr1 [, col_name2=expr2 ...]
    [WHERE where_definition]
    [ORDER BY ...]
    [LIMIT row_count]
```

Multiple-table语法：

```sql
UPDATE [LOW_PRIORITY] [IGNORE] table_references
    SET col_name1=expr1 [, col_name2=expr2 ...]
    [WHERE where_definition]
```

​		UPDATE语法可以用新值更新原有表行中的各列。SET子句指示要修改哪些列和要给予哪些值。WHERE子句指定应更新哪些行。如果没有WHERE子句，则更新所有的行。如果指定了ORDER BY子句，则按照被指定的顺序对行进行更新。LIMIT子句用于给定一个限值，限制可以被更新的行的数目。

多个表的UPDATE操作

```sql
UPDATE items,month SET items.price=month.price WHERE items.id=month.id;
```

### 数据删除

```sql
DELETE FROM table_name [WHERE Clause]
```

- 如果没有指定 WHERE 子句，MySQL 表中的所有记录将被删除。
- 你可以在 WHERE 子句中指定任何条件
- 您可以在单个表中一次性删除记录。

## DDL数据定义语言

### 库的管理

```sql
-- 库的创建
create database [if not exists] 库名；
-- 库的修改(一般不修改，修改后库容易出问题)
RENAME DATABASE books TO 新库名；  -- 现在好像不能使用了
-- 更改字符集
alter database books CHARACTER SET gbk;
-- 库的删除
drop database [if exists] 库名；
```

### 表的管理

```sqlite
create table [if not exists] 表名(......);
-- 修改字段注释格式
alter table {table} modify column {column} {type} comment '{comment}';
-- 删除表
drop tbale [if exists] 表名;
```

### 常见数据类型介绍

### 常见约束

约束：一种限制，用于限制表中的数据，为了保证表的数据的准确和可靠性。

六大约束：

- NOT NULL：非空约束，用于保证字段不为空。
- DEFAULT：默认值
- PRIMARY KEY：主键约束。用于保证字段值具有唯一性并且非空
- UNIQUE：唯一性约束，保证字段具有唯一性，可以为空
- CHECK：检查约束
- FOREIGN KEY：外键约束，用于限制两个表的关系，用于保证该字段的值必须来自于主表的关系列的值。

约束分类：

create table table_name(

​		column_name 类型    列级约束,

​		.....，

​		表级约束

) ...

- 列级约束
  - 6大约束语法上都支持，但外键约束没有效果。
- 表级约束
  - 除了非空、默认、其他都支持。

```sql
CREATE TABLE major(
	id INT PRIMARY KEY,
    majorName VARCHAR(20)
);
-- 列级约束
CREATE TABLE stuinfo(
	id INT PRIMARY KEY,
    stuName VARCHAR(20) NOT NULL,
    gender CHAR(1) CHECK(gender='男' OR gender = '女'),
    seat INT UNIQUE,
    age inT DEfAULT 18,
    majorId INT REFERENCES major(id)
);
-- 表级约束
CREATE TABLE stuinfo(
	id INT,
    stuname VARCHAR(20),
    gender CHAR(1),
    seat INT,
    age	INT,
    majorid	INT,
    [CONSTRAINT pk] PRIMARY KEY(id),
    [CONSTRAINT uq] UNIQUE(seat),
    [CONSTRAINT ck]  CHECK(gender='男' OR gender = '女'),
    [CONSTRAINT fk_stuinfo_major] FOREIGN_KEY(majorId) REFERENCES major(id)
);
```

主键和唯一对比：

| 约束 | 保证唯一性 | 允许为空 | 一个表可以建立多个 | 是否可以组合多个字段 |
| ---- | ---------- | -------- | ------------------ | -------------------- |
| 主键 | 是         | 否       | 否                 | 是                   |
| 唯一 | 是         | 是       | 是                 | 啥                   |

#### 标识列

​		又称为自增长列auto_increment。含义：可以不用手动的插入值，系统提供默认值的序列值。

特点:

1. 标识列必须和主键搭配吗？不一定
2. 一个表可以有多个标识列？最多一个
3. 标识列的类型只能说数值
4. 标识列可以通过 SET auto_increment_increment=3;设置步长，也可以通过手动插入值，设置起始值。

```sql
ALTER TABLE tab_identity MODIFY COLUMN id INT PRIMARY KEY auto_increment;
```

## DCL数据权限控制语言

## 视图

```sql
CREATE [OR REPLACE] VIEW view_name AS SELECT * FROM TABLE_NAME where age > 30
```

特点：

- 重用sql语句；
- 简化复杂的sql操作，不必知道它的查询细节；
- 保护数据，提高安全性。

修改视图：

```sql
CREATE OR REPLACE VIEW view_name as select语句;
-- 或
alter view view_name as select语句;
```

删除视图：

```sql
drop view 视图名[，视图名,....]
```

查看视图：

```sql
DESC 视图名;
SHOW CREATE VIEW 视图名;
```

视图数据更新：

​		视图的可以新增修改删除，视图的可更新性和视图中查询定义有关系，包含复杂sql的视图是不能更新的，比如含有分组函数、distinct、group by、having、union或者union all，常量视图、子查询、连接查询等等。

## 事务TCL(Transaction Control Language)

​	一个或一组sql语句组成一个执行单元，这个执行单元要么全部执行，要么全部不执行。



一般来说，事务是必须满足4个条件（ACID）：：原子性（**A**tomicity，或称不可分割性）、一致性（**C**onsistency）、隔离性（**I**solation，又称独立性）、持久性（**D**urability）。

- **原子性：**一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
- **一致性：**在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
- **隔离性：**数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括读未提交（Read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（Serializable）。
- **持久性：**事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。



隐式事务：事务没有明显的开启和结束标记。

- **SET AUTOCOMMIT=0** 禁止自动提交
- **SET AUTOCOMMIT=1** 开启自动提交

显示事务：必须先设置自动提交功能为禁用。

- **BEGIN** 开始一个事务
- **ROLLBACK** 事务回滚
- **COMMIT** 事务确认
- 

**事务控制语句：**

- BEGIN 或 START TRANSACTION 显式地开启一个事务；
- COMMIT 也可以使用 COMMIT WORK，不过二者是等价的。COMMIT 会提交事务，并使已对数据库进行的所有修改成为永久性的；
- ROLLBACK 也可以使用 ROLLBACK WORK，不过二者是等价的。回滚会结束用户的事务，并撤销正在进行的所有未提交的修改；
- SAVEPOINT identifier，SAVEPOINT 允许在事务中创建一个保存点，一个事务中可以有多个 SAVEPOINT；
- RELEASE SAVEPOINT identifier 删除一个事务的保存点，当没有指定的保存点时，执行该语句会抛出一个异常；
- ROLLBACK TO identifier 把事务回滚到标记点；
- SET TRANSACTION 用来设置事务的隔离级别。InnoDB 存储引擎提供事务的隔离级别有READ UNCOMMITTED、READ COMMITTED、REPEATABLE READ 和 SERIALIZABLE。



**事务的隔离级别**：

​		对于同时运行的多个事务，当这些事务访问数据库中相同的数据时，如果没有采取必要的隔离机制，就会导致并发问题：

- **脏读**：对于两个事务T1,T2, T1读取了已经被T2更新但**没有提交**的字段，之后，若T2回滚，T1读取的内容就是临时且无效的。】
- **不可重复度**：对于两个事务T1,T2, T1读取了一个字段，然后T2**更新**了该字段，之后T1再次访问同一个字段，值就不同类。（同一个查询多次查询不一样）
- **幻读**：对于两个事务T1,T2, T1从一个表中读取一个字段，然后T2在该表中**插入**来一些新的行，如果T1再次读同一个表，就会多出几行。

我们一般通过设置数据库事务的隔离级别，来并发运行各个事务的能力，使他们不会相互影响，避免各种并发问题。数据库提供的4中事务隔离级别：

| **隔离级别**                     | **描述**                                                     | 赃读 | 不可重复读 | 幻读 |
| -------------------------------- | ------------------------------------------------------------ | ---- | ---------- | ---- |
| READ UNCOMMITTED（读未提交数据） | 允许事务读取未被其他事务提交的变更，脏读、不可重复度读和幻读的问题都会出现 | 是   | 是         | 是   |
| READ COMMIT（读已提交数据）      | 只允许事务读取已经被其它事务提交的变更，可以避免脏读，但不可避免不可重复读和幻读。 | 否   | 是         | 是   |
| REPEATABLE READ（可重复读）      | 确保事务可以多次从一个字段中读取相同的值，在这个事务持续访问期间，禁止其他事务对这个字段进行更新，可以避免脏读和不可重复度读，但幻读的问题依然存在。 | 否   | 否         | 是   |
| SERIALIZABLE（串行化）           | 确保事务可以从一个表中读取相同的行，在这个事务持续访问期间，禁止其他事务对该表执行插入、更新和删除操作，所以并发问题都可以避免，但性能十分底下。 | 否   | 否         | 否   |

Oracle支持的2种事务隔离级别：READ COMMITED，SERIALIZABLE。ORACLE默认的事务隔离级别是 READ COMMITED。

Mysql支持4中事务隔离级别，Mysql默认的事务隔离级别为REPEATABLE READ。

```sql
-- 查找mysql事务隔离级别
select @@tx_isolation
-- mysql8中下面这个是行的，上面这个不行，估计是以前版本可用，现在取消了。
show variables like 'transaction_isolation';
-- 更改事务隔离级别
set session transaction isolation level read uncommitted
```

## 变量

- 系统变量
  - 全局变量
  - 会话变量
- 自定义变量
  - 用户变量
  - 局部变量

### 系统变量

​		说明：变量由系统提供，不是用户定义，属于服务器层面。

使用的语法：

1. 查看所有的系统变量

   ```sql
   -- 查看系统变量
   SHOW GLOBAL VARIABLES;
   -- 查看会话变量
   SHOW [SESSION] VARIABLES;
   ```

2. 查看满足条件的部分系统变量

   ```
   show global|session variables like '%char%';
   ```

3. 查看指定的某个系统变量的值

   ```sql
   -- 查看会话变量
   select @@【session.】系统变量名;
   -- 查看全局变量
   select @@global.系统变量名;
   ```

4. 为某个系统变量赋值

   ```sql
   set global|【session】 系统变量名 = 值
   -- 或
   set @@global|【session】.系统变量名 = 值
   ```

### 自定义变量

​		变量是用户自定义的，不是由系统定义的。作用域：针对当前会话（连接）有效，等同于会话变量的作用域。

```sql
-- 1 声明并初始化
-- 方式一：
SET @用户变量名=值
SET @用户变量名:=值
SELECT @用户变量名:=值
-- 方式二：
SELECT 字段 INTO 变量名 FROM 表;
-- eg:  select count(*) INTO @count FROM employees;

-- 查看
SELECT @用户变量名;
```

### 局部变量

​		作用域：仅仅在定义它的begin  end中有效。

```sql
-- 声明：
DECALRE 变量名 类型;
DECALRE 变量名 类型 DEFAULT 值;

-- 赋值：
-- 1 声明并初始化
-- 方式一：
SET 用户变量名=值
SET 用户变量名:=值
SELECT @用户变量名:=值
-- 方式二：
SELECT 字段 INTO 变量名 FROM 表;
-- eg:  select count(*) INTO count FROM employees;

-- 查看
SELECT 用户变量名;
```

## 存储过程

### 定义

​		一组预先编译好的SQL语句的集合，理解成批处理语句。

- 提高代码的重用性；
- 简化操作；
- 减少了编译次数并且减少了和数据库服务器的连接次数，提高了效率。

### 创建语法

```plsql
CREATE PROCEDURE 存储过程名(参数列表)
BEGIN
	存储过程体（一组合法的SQL语句）
END
```

注意：

1. 参数列表包含三部分

参数模式     参数名    参数类型

IN stuName  VARCHAR（20）

参数模式：  IN 输入  OUT输出   INOUT输入输出

2. 如果存储过程体仅仅只有一句话， BEGIN END可以省略。

存储过程体重每条SQL语句的结尾要求必须加分号。

存储过程的结尾可以使用DELIMITER重新设置。 DELIMITER 结束标记

###  调用语法

```plsql
CALL 存储过程名(实参列表);
```

### 删除存储过程

```sql
drop procedure 存储过程名;
```

### 查看存储过程的信息

```plsql
SHOW CREATE PROCEDURE myp2;
```

### 演示案例

eg：创建存储过程，实现用户是否登录成功

```plsql
CREATE PROCEDURE myp4(IN username VARCHAR(20), IN password VARCHAR(20))
BEGIN
	DECLARE result INT DEFAULT 0;
	
	SELECT COUNT(*) INTO result
	FROM admin
	WHERE admin.username = username
	AND admin.password = password;
	
	SELECT IF(result>0, '成功', '失败');
END
-- 调用
call myp4('张三', '123456');
```

eg：根据女神名，返回对应的男神名和男神魅力值

```plsql
CREATE PROCEDURE myp6(IN beautyName VARCHAR(20), OUT boyName VARCHAR(20), OUT userCP INT)
BEGIN
	SELECT bo.boyName, bo.userCP INTO boyName, userCP
	FROM boys bo
	INNER JOIN beauty b ON bo.id = b.boyfriend_id
	WHERE b.name = beautyName;
END
-- 调用
SET bName = '';
SET userCP = 0;
call myp6('小枣', @bName, @userCP);
select @bName, @userCP;
```

eg:传入a和b两个只，最终a和b翻倍

```plsql
CREATE PROCEDURE myp8(INOUT a INT, INTOUT b INT)
BEGIN
	SET a = a*2;
	SET b = b*2;
END
-- 调用
set m = 22;
set n = 33;
call myp8(@m, @n);
select @m, @n;
```

## 函数

- 提高代码的重用性；
- 简化操作；
- 减少了编译次数并且减少了和数据库服务器的连接次数，提高了效率。

**存储过程和函数的区别**：

存储过程： 可以有0个返回，也可以有多个返回。适合批量插入、批量更新。

函数：有且仅有有一个返回。适合做处理数据后返回一个结果。

### 创建语法

```plsql
CREATE FUNCTION 函数名(参数列表) RETURNS 返回类型
BEGIN
	函数体
END
```

函数体：肯定会有return语句，没有会报错。
如果return语句没有放在函数体的最后也不报错，但是不建议。

### 函数调用

```sql
SELECt 函数名(参数列表);
```

### 查看函数

```sql
SHOW CREATE FUNCTION 函数名;
```

### 删除函数

```plsql
DROP FUNCTION 函数名();
```

### 案例演示

eg：返回公司的员工个数

```PLSQL
CREATE FUNCTION myfun(depId VARCHAR(20)) RETURNS INT
BEGIN
	DECLARE c INT DEFAULT 0;
	
	SELECT count(*) INTO c
	FROM employees
	WHERE department_id = depId;
	
	return c;
END

-- 调用
select myfun();
```



## 流程控制

- 顺序结构：程序从上往下依次执行；
- 分支结构：程序从两条或者多条路径中选择一条去执行；
- 循环结构：程序在满足一定条件的基础上，重复执行一段代码；

### 分支结构

#### if函数

功能：实现简单的双分支

语法：

if(表达式1, 表达式2, 表达式3)

执行顺序：如果表达式1成立，则返回表达式2的值，否则返回表达式3的值

#### case结构

情况1：类似java中的switch语句，一般用于实现等值判断

语法：

```
CASE 变量|表达式|字段

    WHEN 要判断的值 THEN 返回的值1

    WHEN 要判断的值 THEN 返回的值2

    ...

    ELSE 要返回的值n

END CASE；
```

情况2：类似于java中的多重if语句，一般用于区间判断

语法：

```
CASE

    WHEN 条件1 THEN 返回的值1

    WHEN 条件2 THEN 返回的值2

    ...

    ELSE 要返回的值n

END CASE；
```

特点：

- 可以作为表达式，嵌套在其他语句中使用，可以放在任何地方。

- 可以作为独立的语句使用，只能放在BEGIN END中
- 如果WHEN中的值满足条件成立，则执行对应的WHEN后面的语句，并结束CASE。如果不满足，则执行ELSE中的语句或值。
- ELSE可以省略，如果ELSE省略了，并且所有WHEN条件都不满足，则返回NULL。

**案例：**

eg：创建存储过程，根据传入的成绩，来显示等级，比如传入的成绩：90-100，显示A；80-90， 显示B；60-80显示C；否则显示D。

```plsql
CREATE PROCEDURE test_case(IN score INT)
BEGIN
	CASE
        WHEN score>=90 AND score <= 100 THEN SELECT 'A';
        WHEN score >=80 THEN SELECT 'B';
        WHEN score >=60 THEN SELECT 'C';
        ELSE SELECT 'D';
	END CASE
END

-- 调用
call test_case(95);
```

#### if结构

功能：实现多重分支

语法：

if 条件1 then 语句1;

elseif 条件2 then 语句2；

....

[else 语句n;]

end if

应用场合：只能应用在begin...end中。

**案例：**

eg：根据传入的成绩，来显示等级，比如传入的成绩：90-100，显示A；80-90， 显示B；60-80显示C；否则显示D。

```plsql
CREATE FUNCTION test_if(score INT) RETURNS CHAR
BEGIN
	IF score>=90 AND score <= 100 THEN RETURN 'A';
    ELSEIF score >=80 THEN RETURN 'B';
    ELSEIF score >=60 THEN RETURN 'C';
    ELSE RETURN 'D';
    END IF;
END

-- 调用
select test_if(86);
```



### 循环结构

分类：while、loop、repeat

循环控制： 

​	iterate类似java中的continue，继续，结束本次循环，继续下一次。

​	leave类似于java中的break，跳出，结束当前所在的循环。

#### while

语法：

【标签：】while 循环条件 do

​				循环体;

end while 【标签】；



#### loop

语法：

【标签：】loop

​				循环体；

end loop 【标签】；



#### repeat

语法：

【标签：】 repeat

​				循环体；

until  结束循环的条件

end repeat 【标签】;