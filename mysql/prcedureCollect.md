# mysql存储过程收藏



## 批量修改表

​	某个存储模型，同样的数据结构，但是存在多个表，如果列有变更就需要将所有的表执行一次DDL。

  办法一：将所有的表弄下来，批量写sql改（缺点：如果生成新的表可能漏改）。

  办法二：通过mysql的INFORMATION_SCHEMA.TABLES表查询所有对应的表，然后游标遍历更改祥云的表结构。

存储过程如下：

```mysql
-- 1、创建ppp_online_program_info_<begintime>新增字段存储过程
DELIMITER //
CREATE procedure tt_dmp.modify_ppp_online_program_info()
BEGIN
    DECLARE tableName varchar(64);
    DECLARE hasColumn int ;
    DECLARE result text default '';
    DECLARE done INT DEFAULT FALSE;

    DECLARE cur CURSOR FOR
        SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_name LIKE 'ppp_online_program_info_%';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop:
        LOOP
            FETCH cur INTO tableName;
            IF done THEN LEAVE read_loop; END IF;

            select count(1) into hasColumn from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA = 'xc_dmp' and TABLE_NAME = tableName and COLUMN_NAME = 'sale_mode';
            -- 新增字段
            if hasColumn = 0 then
				-- ALTER TABLE 变量名 变量名会被当作字符串处理,可以构造一个动态的SQL语句，然后使用MySQL的PREPARE语句对其进行预处理,再使用EXECUTE语句执行这条动态SQL
                SET @query1 = CONCAT('ALTER TABLE ', tableName, ' add sale_mode  tinyint null comment  \'售卖方式，1：按点位售卖（如果是梯外点位则表示梯外点位按梯内售卖）、2：梯外按单元售卖\';');

                PREPARE stmt1 FROM @query1;
                EXECUTE stmt1;
                DEALLOCATE PREPARE stmt1;
            end if;
            set result = concat(result,'\n',tableName,'表结构更新完成;');
        END LOOP;
    CLOSE cur;
		-- 存储过程可通过select语句输出结果,函数不能通过select输出
    select result;
END;
// DELIMITER ;

-- 2、执行脚本修改表结构
call tt_dmp.modify_ppp_online_program_info();

-- 3、表结构更改完成后删除存储过程
DROP procedure IF EXISTS tt_dmp.modify_ppp_online_program_info;
```

