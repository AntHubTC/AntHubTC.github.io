# DB2常用命令总结

1、 打开命令行窗口 
　 #db2cmd 
2、 打开控制中心 
　 # db2cmd db2cc 
3、 打开命令编辑器 
　db2cmd db2ce 
=====操作数据库命令===== 

4、 启动数据库实例 
　 #db2start 

5、 停止数据库实例 
　 #db2stop 

　如果你不能停止数据库由于激活的连接，在运行db2stop前执行db2 force application all就可以了 /db2stop force 
6、 创建数据库 
　 #db2 create db [dbname] 
7、 连接到数据库 
　 #db2 connect to [dbname] user [username] using [password] 
8、 断开数据库连接 
　 #db2 connect reset 
9、 列出所有数据库 
　#db2 list db directory 

10、 列出所有激活的数据库 
　 #db2 list active databases 
11、 列出所有数据库配置 
　 #db2 get db cfg 
12、 删除数据库 
　 #db2 drop database [dbname] 
（执行此操作要小心） 
如果不能删除，断开所有数据库连接或者重启db2 

=========操作数据表命令========== 
13、 列出所有用户表 
　 #db2 list tables 
14、列出所有系统表 
　#db2 list tables for system 
15、列出所有表 
　 #db2 list tables for all 
16、 列出系统表 
　 #db2 list tables for system 
17、列出用户表 
　 #db2 list tables for user 
18、 列出特定用户表 
　 #db2 list tables for schema [user] 
19、 创建一个与数据库中某个表(t2)结构相同的新表(t1) 
　 #db2 create table t1 like t2 
20、 将一个表t1的数据导入到另一个表t2 
\#db2 "insert into t1 select * from t2" 
21、 查询表 
　 #db2 "select * from table name where ..." 
22、 显示表结构 
　 #db2 describe table tablename 
23、 修改列 
　 #db2 alter table [tablename] alter column [columname] set data type varchar(24) 
======脚本文件操作命令======= 
24、 执行脚本文件 
　 #db2 -tvf scripts.sql 
25、帮助命令 
\* 查看命令帮助 
　#db2 ? db2start 
\* 查看错误码信息 
\#db2 ? 22001 
\* memo: 详细命令请使用"db2 ? <command>"进行查看。　 
========================= 
26、备份数据库 
\#db2 backup db <db name> 
备注：执行以上命令之前需要断开数据库连接 

27、在线备份数据库 
\#db2 -v "BACKUP DATABASE <database name> ONLINE TO <path> WITH 2 BUFFERS BUFFER 1024 INCLUDE LOGS WITHOUT PROMPTING" 
28、恢复数据库 
\#db2 restore db <source db name> 

29、在线恢复数据库 
\#db2 "RESTORE DB <database name> TO <db path> LOGTARGET <logpath> WITHOUT PROMPTING" 
\#db2 "ROLLFORWARD DB <database name> TO END OF LOGS AND STOP" ... 
30、导出数据文件 

\#db2move <db name> export 

[-sn <模式名称，一般为db2admin>] 
[-tn <表名，多个之间用逗号分隔>] 
31、导入数据文件 
\#db2move <db name> import 
32、获取db2数据库管理配置环境信息 
\#db2 get dbm cfg 
33、.获取db2某个数据库数据库管理配置环境信息 
\#db2 get db cfg for <db name> 

或者：连接至某个数据库以后执行db2 get db cfg 

34、更改db2日志空间的大小 
备注：以下命令为了防止db2数据库过份使用硬盘空间而设，仅用于开发者自己机器上的db2，如果是服务器，则参数需要修改。 

\#db2 UPDATE DB CFG FOR <db name> USING logretain OFF logprimary 3 logsecond 2 logfilsiz 25600; 
如果页大小是4KB，则以上命令创建3个100M的日志文件，占用300MB硬盘空间。25600*4KB=102400KB。 
35、创建临时表空间 
\#DB2 CREATE USER TEMPORARY TABLESPACE STMASPACE PAGESIZE 32 K MANAGED BY DATABASE USING (FILE 'D:\DB2_TAB\STMASPACE.F1' 10000) 
EXTENTSIZE 256 
36、获取数据库管理器的快照数据 
\#db2 –v get snapshot for dbm 
37、显示进行程号 
\#db2 list applications show detail 
=================================================== 
一、加载数据： 
1、 以默认分隔符加载,默认为“,”号 
db2 "import from btpoper.txt of del insert into btpoper" 
2、 以指定分隔符“|”加载 
db2 "import from btpoper.txt of del modified by coldel| insert into btpoper" 
二、卸载数据： 
1、 卸载一个表中全部数据 
db2 "export to btpoper.txt of del select * from btpoper" 
db2 "export to btpoper.txt of del modified by coldel| select * from btpoper" 
2、 带条件卸载一个表中数据 
db2 "export to btpoper.txt of del select * from btpoper where brhid='907020000'" 
db2 "export to cmmcode.txt of del select * from cmmcode where codtp='01'" 
db2 "export to cmmcode.txt of del modified by coldel| select * from cmmcode where codtp='01'" 
三、查询数据结构及数据： 
db2 "select * from btpoper" 
db2 "select * from btpoper where brhid='907020000' and oprid='0001'" 
db2 "select oprid,oprnm,brhid,passwd from btpoper" 
四、删除表中数据： 
db2 "delete from btpoper" 
db2 "delete from btpoper where brhid='907020000' or brhid='907010000'" 
五、修改表中数据： 
db2 "update svmmst set prtlines=0 where brhid='907010000' and jobtp='02'" 
db2 "update svmmst set prtlines=0 where jobtp='02' or jobtp='03'" 
六、联接数据库 
db2 connect to btpdbs 
七、清除数据库联接 
db2 connect reset 断开数据库连接 
db2 terminate 断开数据库连接 
db2 force applications all 断开所有数据库连接 
八、备份数据库 
1、 db2 backup db btpdbs 
2、 db2move btpdbs export 
db2look -d btpdbs -e -x [-a] -o crttbl.sql 
九、恢复数据库 
1、 db2 restore db btpdbs without rolling forward 
2、 db2 -tvf crtdb.sql 
crtdb.sql文件内容：create db btpdbs on /db2catalog 
db2 -stvf crttbl.sql 
db2move btpdbs import 
十、DB2帮助命令： 
db2 ? 
db2 ? restroe 
db2 ? sqlcode (例：db2 ? sql0803) 注：code必须为4位数，不够4位，前面补0 

十一、bind命令：将应用程序与数据库作一捆绑,每次恢复数据库后，建议都要做一次bind 
(1) db2 bind br8200.bnd 
(2) /btp/bin/bndall /btp/bnd 
/btp/bin/bndall /btp/tran/bnd 
十二、查看数据库参数： 
db2 get dbm cfg 
db2 get db cfg for btpdbs 
十三、修改数据库参数： 
db2 update db cfg for btpdbs using LOGBUFSZ 20 
db2 update db cfg for btpdbs using LOGFILSIZ 5120 
改完后，应执行以下命令使其生效： 
db2 stop 
db2 start 

补充： 
db2 set schema btp 修改当前模式为"btp" 
db2 list tablespaces show detail 查看当前数据库表空间分配状况 
db2 list tablespace containers for 2 show detail 查看tablespace id=2使用容器所在目录 
db2 list application 
db2 list db directory 列出所有数据库 
db2 list active databases 列出所有活动的数据库 
db2 list tables for all 列出当前数据库下所有的表 
db2 list tables for schema btp 列出当前数据库中schema为btp的表 
db2 list tablespaces show detail 显示数据库空间使用情况 
db2 list packages for all 

db2 "import from tab76.ixf of ixf commitcount 5000 insert into achact" 
db2 "create table achact_t like achact" 
db2 "rename table achact_t to achact" 
db2 "insert into achact_t select * from achact where txndt>=(select lstpgdt from 
acmact where actno=achact.actno)" 
db2 get snapshot for dynaimic sql on jining 
删除一个实例： 
\# cd /usr/lpp/db2_07_01/instance 
\# ./db2idrop InstName 
列出所有DB2实例： 
\# cd /usr/lpp/db2_07_01/bin 
\# ./db2ilist 
为数据库建立编目 
$ db2 catalog db btpdbs on /db2catalog 
取消已编目的数据库btpdbs 
$ db2 uncatalog db btpdbs 
查看版本 
\# db2level 
显示当前数据库管理实例 
$ db2 get instance 
设置实例系统启动时是否自动启动。 
$ db2iauto -on 自动启动 
$ db2iauto -off 不自动启动 
数据库优化命令： 
reorg、runstats 
当数据库经过一段时间使用，数据空间会变得越来越庞大。一些delete掉 
的数据仍存放在数据库中，占用数据空间，影响系统性能。因此需要定期 
运行reorg、runstats命令，清除已delete的数据，优化数据结构。 
db2 reorg table 表名 
db2 runstats on table 表名 with distribution and indexes all 
因为要优化的表比较多，所以在/btp/bin目录下提供了一个sh程序runsall， 
可在当天业务结束后，运行runsall，对数据库进行优化 

在DB2的开发过程中，贯穿整个开发过程还有很重要的一部分工作就是数据库的维护；对于维护一个庞大信息系统来说是非常必要的；留一份简易的维护手册，以备不时之需；以下收集到的部分维护命令，以飨我们的维护工程师和项目经理。 
================================================================= 
38、更改db2日志空间的大小 
备注：以下命令为了防止db2数据库过份使用硬盘空间而设，仅用于开发者自己机器上的db2，如果是服务器，则参数需要修改。 
\# db2 UPDATE DB CFG FOR <db name> USING logretain OFF logprimary 3 logsecond 2 logfilsiz 25600; 
如果页大小是4KB，则以上命令创建3个100M的日志文件，占用300MB硬盘空间。25600*4KB=102400KB。 
39、创建临时表空间 
\#DB2 CREATE USER TEMPORARY TABLESPACE STMASPACE PAGESIZE 32 K MANAGED BY DATABASE USING (FILE 'D:\DB2_TAB\STMASPACE.F1' 10000) EXTENTSIZE 256 
40、创建表空间 
rem 创建缓冲池空间 8K 
\#db2 connect to gather 
\#db2 CREATE BUFFERPOOL STMABMP IMMEDIATE SIZE 25000 PAGESIZE 8K 
rem 创建表空间：STMA 
rem 必须确认路径正确 
rem D:\DB2Container\Stma 
\#db2 drop tablespace stma 
\#db2 CREATE REGULAR TABLESPACE STMA PAGESIZE 8 K MANAGED BY SYSTEM USING ('D:\DB2Container\Stma' ) EXTENTSIZE 8 OVERHEAD 10.5 PREFETCHSIZE 8 TRANSFERRATE 0.14 BUFFERPOOL STMABMP DROPPED TABLE RECOVERY OFF 
\#db2 connect reset 
41、将暂挂的数据恢复到前滚状态 
\#db2 ROLLFORWARD DATABASE TESTDB TO END OF LOGS AND COMPLETE NORETRIEVE 

42、备份表空间 
\#BACKUP DATABASE YNDC TABLESPACE ( USERSPACE1 ) TO "D:\temp" WITH 2 BUFFERS BUFFER 1024 PARALLELISM 1 WITHOUT PROMPTING 
43、创建db2工具数据库 
\#db2 create tools catalog systools create new database toolsdb 
44、如何进行增量/差量备份 
增量：上一次完整备份至本次备份之间增加的数据部分； 
差量(delta)：上次备份以来（可能是完整备份、增量备份或者差量备份）至本次备份之间增加的数据部分； 
45、更新所有表的统计信息 
\#db2 -v connect to DB_NAME 
\#db2 -v "select tbname, nleaf, nlevels, stats_timefrom sysibm.sysindexes" 
\#db2 -v reorgchkupdate statistics on table all 
\#db2 -v "select tbname, nleaf, nlevels, stats_timefrom sysibm.sysindexes" 
\#db2 -v terminate 

46、对一张表运行统计信息 
\#db2 -v runstatson table TAB_NAMEand indexes all 
47、查看是否对数据库执行了RUNSTATS 
\#db2 -v "select tbname, nleaf, nlevels,stats_timefrom sysibm.sysindexes" 
48、更改缓冲池的大小 
缓冲池中，当syscat.bufferpools的npages是-1时，由数据库的配置参数bufferpage控制缓冲池的大小。 
将npages的值更改为-1的命令： 
\#db2 -v connect to DB_NAME 
\#db2 -v select * from syscat.bufferpools 
\#db2 -v alter bufferpoolIBMDEFAULTBP size -1 
\#db2 -v connect reset 
\#db2 -v terminate 
更改数据库配置参数BufferPages的命令如下： 
\#db2 -v update db cfgfor dbnameusing BUFFPAGE bigger_value 
\#db2 -v terminate 
49、看数据库监视内容列表 
\#db2 -v get monitor switches 
50、打开某个数据库监视内容 
\#db2 -v update monitor switches using bufferpoolon 
51、获取数据库快照 
\#db2 -v get snapshot for all databases > snap.out 
\#db2 -v get snapshot for dbm>> snap.out 
\#db2 -v get snapshot for all bufferpools>> snap.out 
\#db2 -v terminate 

52、重置数据库快照 
\#db2 -v reset monitor all 
53、计算缓冲池命中率 
理想情况下缓冲池命中率在95%以上，计算公式如下： 
(1 -((buffer pool data physical reads + buffer pool index physical reads) 
/(buffer pool data logical reads + pool index logical reads))) *100% 
=========数据库实例======================== 
54、创建db2实例 
\#db2icrt <实例名称> 
55、删除db2实例 
\#db2idrop <实例名称> 
56、设置当前db2实例 
\#set db2intance=db2 
57、显示db2拥有的实例 
\#db2ilist 
58、恢复离线增量备份数据库的命令 
\#DB2 RESTORE DATABASE YNDC INCREMENTAL AUTOMATIC FROM D:\backup\autobak\db2 TAKEN AT 20060314232015 
59、创建样本数据库 
在unix平台，使用： 
\#sqllib/bin/db2sampl <path> 
在windows,os/2平台，使用：db2sampl e,e是可选参数，指定将创建数据库的驱动器 

60、设置联合数据库为可用（默认联合数据库不可用） 

\#db2 update dbm cfg using federated yes 

61、列出数据库中所有的表 
\#db2 list tables 
62、数据迁移方法1 
export脚本示例 
\#db2 connect to testdb user test password test 
\#db2 "export to aa1.ixf of ixf select * from table1" 
\#db2 "export to aa2.ixf of ixf select * from table2" 
\#db2 connect reset 
import脚本示例 
\#db2 connect to testdb user test password test 
\#db2 "load from aa1.ixf of ixf replace into table1 COPY NO without prompting " 
\#db2 "load from aa2.ixf of ixf replace into table2 COPY NO without prompting " 
\#db2 connect reset  