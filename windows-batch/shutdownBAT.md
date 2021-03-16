# 关机脚本实战

## 关机脚本V1.0

### 效果图

![1582618655364](.\img\1582618655364.png)

![1582618684961](.\img\1582618684961.png)

### 源码

```bash
@echo off
title 小小关机程序
:start
	cls ::每次进入开始的这个菜单都要清屏
	mode con cols=30 lines=8
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo ★    ☆───☆───☆  ★
	echo ●    │小小关机程序  │  ●
	echo ★    │Author:唐成   │  ★
	echo ●    │version:1.0   │  ●
	echo ★    ☆───☆───☆  ★
	echo ▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	pause
:menu
	cls ::每次进入开始的这个菜单都要清屏
	mode con cols=31 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo ╔═╦═══════════╗
	echo ║0 ║取消关机        	    ║
	echo ║1 ║一分钟关机      	    ║
	echo ║2 ║两分钟关机      	    ║
	echo ║3 ║五分钟关机      	    ║
	echo ║4 ║十分钟关机      	    ║
	echo ║5 ║一个小时关机    	    ║
	echo ║6 ║两个小时关机	    ║
	echo ║7 ║自定义倒计时关机时间  ║
	echo ║8 ║自定义关机时间  	    ║
	echo ╠═╬═══════════╣
	echo ║r ║刷新时间        	    ║
	echo ║a ║关于            	    ║
	echo ║b ║返回上一级      	    ║
	echo ║q ║退出             	    ║
	echo ╚═╩═══════════╝
	echo 现在时间:%date%
	echo          %time%
	set shutTime = 1
	set /p a=请输入你的选择:
	::这里分支判断
	IF %a% == 0 GOTO lab0
	::1-4的选项都是分钟关机
	IF %a% GEQ 1 IF %a% LEQ 4 GOTO lab1
	::5-6的选项都是小时关机
	IF %a% GEQ 5 IF %a% LEQ 6 GOTO lab2
	::自定义关机时间
	IF %a% EQU 7 GOTO lab3
	::刷新时间
	IF "%a%" EQU "r" GOTO menu
	IF "%a%" EQU "R" GOTO menu
	::关于
	IF "%a%" EQU "a" GOTO about
	IF "%a%" EQU "A" GOTO about
	::返回上一级
	IF "%a%" EQU "b" GOTO start
	IF "%a%" EQU "B" GOTO start
	::退出
	IF "%a%" EQU "q" GOTO exit
	IF "%a%" EQU "Q" GOTO exit
	::如果没有改选项
	cls
	mode con cols=30 lines=5
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 输入选项错误！按任意键回到主菜单。
	pause>null
	cls ::清屏
GOTO start

:about ::关于
	cls
	mode con cols=27 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 程序名：小小关机程序
	echo Author:tangcheng
	echo Version:v1.0
	echo QQ：1096648786
	echo   经常想自动定时关机的朋友有福了，虽然没有如今手机等设备远程关机那么6气，我觉得对于一般用户来说还是可以了。
	echo   我就经常让电脑自动关机，特别是让电脑共享wifi在床上玩的时候，又不想起来关电脑，又想用wifi，这个时候它对我的用处来说就很大了。
	echo   另外该程序没有其他程序那么龌蹉！纯绿色开源的。好东西大家一起共享嘛!
	echo ▲▲▲▲▲▲▲▲▲▲▲▲▲
	pause
GOTO menu
::分支最终执行块
:lab0 ::取消关机
	cls
	mode con cols=30 lines=7
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 已经取消关机……
	shutdown -a
GOTO end

::分钟关机
:lab1
	cls
	mode con cols=30 lines=7
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 你的电脑将在%a%分钟后关机
	IF "%a%" EQU "3" set /a a = 5
	IF "%a%" EQU "4" set /a a = 10
	set /a shutTime = %a%*60
GOTO switchEnd

::小时关机
:lab2
	cls
	mode con cols=30 lines=7
	set /a hour=%a%-4
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 你的电脑将在%hour%小时后关机
	set /a shutTime = hour*3600 ::60*60=3600
GOTO switchEnd

::自定义关机
:lab3
	cls
	mode con cols=30 lines=10
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 输入时间的单位:
	echo 【s】秒;【m】分;【h】时;
	echo 【b】返回上一级
	::时间单位
	set /p timeUnit=请输入：
	IF "%timeUnit%" EQU "b" GOTO menu ::返回菜单
	IF "%timeUnit%" EQU "B" GOTO menu
	IF not "%timeUnit%" EQU "s" IF not "%timeUnit%" EQU "S" IF not "%timeUnit%" EQU "m" IF not "%timeUnit%" EQU "M" IF not "%timeUnit%" EQU "h" IF not "%timeUnit%" EQU "H" (
		cls
		GOTO lab3
	)
	set /p shutTime=输入你要关闭的时间:
	IF "%timeUnit%" EQU "s" GOTO ifEnd
	IF "%timeUnit%" EQU "S" GOTO ifEnd
	IF "%timeUnit%" EQU "m" (
		set /a shutTime*=60
		GOTO ifEnd	
	)
	IF "%timeUnit%" EQU "M" (
		set /a shutTime*=60
		GOTO ifEnd	
	)
	IF "%timeUnit%" EQU "h" (
		set /a shutTime*=3600
		GOTO ifEnd
	)
	IF "%timeUnit%" EQU "H" (
		set /a shutTime*=3600
		GOTO ifEnd
	)
	GOTO lab3
	:ifEnd	::IF结束
GOTO switchEnd

::判断结束
:switchEnd
	shutdown -s -t %shutTime%

::结束段
:end
	set /p a=是否返回主菜单:【y/n】
	IF "%a%" EQU "y" GOTO menu
	IF "%a%" EQU "Y" GOTO menu
	IF "%a%" EQU "n" exit 
	IF "%a%" EQU "N" exit
	cls;
	echo 你的输入不正确，请重新输入!
	GOTO end ::输入不对
pause
```

## 关机脚本V2.0

​	2.0 主要是在输出效果上做了功夫。

### 效果图

![img](.\img\psb.jpg)

![img](.\img\psb-1582618988089.jpg)

### 源码

这个脚本要子啊windows上直接运行，需要做些配置才行，否则运行不了

```bash
@echo off
color 1a
title 小小关机程序
chcp 437>nul&&graftabl 936>nul
if not exist CONFIG.NT copy %WinDir%\System32\CONFIG.NT CONFIG.NT
@cls
echo DEVICE=%WinDir%\System32\ANSI.SYS /x >%WinDir%\System32\CONFIG.NT
:start
	cls ::每次进入开始的这个菜单都要清屏
	mode con cols=30 lines=8
	command /cecho [1;36m  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	command /cecho [1;36m  ★    ☆───☆───☆  ★
	command /cecho [1;36m  ●    │小小关机程序  │  ●
	command /cecho [1;36m  ★    │Author:唐成   │  ★
	command /cecho [1;36m  ●    │version:2.0   │  ●
	command /cecho [1;36m  ★    ☆───☆───☆  ★
	command /cecho [1;36m  ▲▲▲▲▲▲▲▲▲▲▲▲▲▲
	pause
:menu
	cls ::每次进入开始的这个菜单都要清屏
	mode con cols=31 lines=20
	command /cecho [1;33;44m  ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	command /cecho [1;35;44m ╔═╦═══════════╗
	command /cecho [1;35;44m ║[1;32;44m0 [1;35;44m║[1;32;44m取消关机             [1;35;44m ║
	command /cecho [1;35;44m ║[1;33;44m1 [1;35;44m║[1;33;44m一分钟关机           [1;35;44m ║
	command /cecho [1;35;44m ║[1;32;44m2 [1;35;44m║[1;32;44m两分钟关机           [1;35;44m ║
	command /cecho [1;35;44m ║[1;33;44m3 [1;35;44m║[1;33;44m五分钟关机           [1;35;44m ║
	command /cecho [1;35;44m ║[1;32;44m4 [1;35;44m║[1;32;44m十分钟关机           [1;35;44m ║
	command /cecho [1;35;44m ║[1;33;44m5 [1;35;44m║[1;33;44m一个小时关机         [1;35;44m ║
	command /cecho [1;35;44m ║[1;32;44m6 [1;35;44m║[1;32;44m两个小时关机          [1;35;44m║
	command /cecho [1;35;44m ║[1;33;44m7 [1;35;44m║[1;33;44m自定义倒计时关机时间  [1;35;44m║
	command /cecho [1;35;44m ║[1;32;44m8 [1;35;44m║[1;32;44m自定义关机时间        [1;35;44m║
	command /cecho [1;35;44m ╠═╬═══════════╣
	command /cecho [1;35;44m ║[1;33;44mr [1;35;44m║[1;33;44m刷新时间              [1;35;44m║
	command /cecho [1;35;44m ║[1;32;44ma [1;35;44m║[1;32;44m关于                  [1;35;44m║
	command /cecho [1;35;44m ║[1;33;44mb [1;35;44m║[1;33;44m返回上一级            [1;35;44m║
	command /cecho [1;35;44m ║[1;32;44mq [1;35;44m║[1;32;44m退出                  [1;35;44m║
	command /cecho [1;35;44m ╚═╩═══════════╝
	command /cecho [1;35;44m  现在时间:%date%
	command /cecho [1;35;44m           %time%
	set shutTime = 1
	set /p a=请输入你的选择:
	::这里分支判断
	IF %a% == 0 GOTO lab0
	::1-4的选项都是分钟关机
	IF %a% GEQ 1 IF %a% LEQ 4 GOTO lab1
	::5-6的选项都是小时关机
	IF %a% GEQ 5 IF %a% LEQ 6 GOTO lab2
	::自定义关机时间
	IF %a% EQU 7 GOTO lab3
	IF %a% EQU 8 GOTO lab4
	::刷新时间
	IF "%a%" EQU "r" GOTO menu
	IF "%a%" EQU "R" GOTO menu
	::关于
	IF "%a%" EQU "a" GOTO about
	IF "%a%" EQU "A" GOTO about
	::返回上一级
	IF "%a%" EQU "b" GOTO start
	IF "%a%" EQU "B" GOTO start
	::退出
	IF "%a%" EQU "q" GOTO exit
	IF "%a%" EQU "Q" GOTO exit
	::如果没有改选项
	cls
	mode con cols=30 lines=5
	command /cecho [1;36m  ▼▼▼▼▼▼▼▼▼▼▼▼▼
	command /cecho [1;36m  输入选项错误！按任意键回到主菜单。
	pause>null
	cls ::清屏
GOTO start

:about ::关于
	cls
	mode con cols=27 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo  程序名：小小关机程序
	echo  Author:tangcheng
	echo  Version:v1.0
	echo  QQ：1096648786
	echo    经常想自动定时关机的朋友有福了，虽然没有如今手机等设备远程关机那么6气，我觉得对于一般用户来说还是可以了。
	echo    我就经常让电脑自动关机，特别是让电脑共享wifi在床上玩的时候，又不想起来关电脑，又想用wifi，这个时候它对我的用处来说就很大了。
	echo    另外该程序没有其他程序那么龌蹉！纯绿色开源的。好东西大家一起共享嘛!
	echo ▲▲▲▲▲▲▲▲▲▲▲▲▲
	pause
GOTO menu
::分支最终执行块
:lab0 ::取消关机
	cls
	mode con cols=30 lines=7
	echo  ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo  已经取消关机……
	shutdown -a
GOTO end

::分钟关机
:lab1
	cls
	mode con cols=30 lines=7
	echo  ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo  你的电脑将在%a%分钟后关机
	IF "%a%" EQU "3" set /a a = 5
	IF "%a%" EQU "4" set /a a = 10
	set /a shutTime = %a%*60
GOTO switchEnd

::小时关机
:lab2
	cls
	mode con cols=30 lines=7
	set /a hour=%a%-4
	echo  ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo  你的电脑将在%hour%小时后关机
	set /a shutTime = hour*3600 ::60*60=3600
GOTO switchEnd

::自定义关机
:lab3
	cls
	mode con cols=30 lines=10
	echo  ▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo  输入时间的单位:
	echo  【s】秒;【m】分;【h】时;
	echo  【b】返回上一级
	::时间单位
	set /p timeUnit=请输入：
	IF "%timeUnit%" EQU "b" GOTO menu ::返回菜单
	IF "%timeUnit%" EQU "B" GOTO menu
	IF not "%timeUnit%" EQU "s" IF not "%timeUnit%" EQU "S" IF not "%timeUnit%" EQU "m" IF not "%timeUnit%" EQU "M" IF not "%timeUnit%" EQU "h" IF not "%timeUnit%" EQU "H" (
		cls
		GOTO lab3
	)
	set /p shutTime=输入你要关闭的时间:
	IF "%timeUnit%" EQU "s" GOTO ifEnd
	IF "%timeUnit%" EQU "S" GOTO ifEnd
	IF "%timeUnit%" EQU "m" (
		set /a shutTime*=60
		GOTO ifEnd	
	)
	IF "%timeUnit%" EQU "M" (
		set /a shutTime*=60
		GOTO ifEnd	
	)
	IF "%timeUnit%" EQU "h" (
		set /a shutTime*=3600
		GOTO ifEnd
	)
	IF "%timeUnit%" EQU "H" (
		set /a shutTime*=3600
		GOTO ifEnd
	)
	GOTO lab3
	:ifEnd	::IF结束
GOTO switchEnd

:lab4
	cls ::每次进入开始的这个菜单都要清屏
	mode con cols=31 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 任务管理
	echo 1.任务列表
	echo 2.添加任务
	echo 3.删除任务
	echo b.返回上一级
	set /p a=请输入你的选择:
	IF "%a%" EQU "1" GOTO atList
	IF "%a%" EQU "2" GOTO addAt
	IF "%a%" EQU "3" GOTO delAt
	::返回上一级
	IF "%a%" EQU "b" GOTO menu
	IF "%a%" EQU "B" GOTO menu
GOTO lab4

REM 任务列表
:atList
	cls
	mode con cols=100 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 任务列表
	at & pause
GOTO lab4

REM 添加任务
:addAt
	cls
	mode con cols=31 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	echo 输入要关闭的时间:
	set /p a=(格式:小时:分)
	::防止用户忘记自己加了关机任务，这时使用默认的30s倒计时
	at "%a%" shutdown -s 
GOTO atList

REM 删除任务
:delAt
	cls
	mode con cols=31 lines=20
	echo ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
	set /p a=请输入你要删除的任务id(任务列表可以看到):
	at "%a%" /del
GOTO atList

::判断结束
:switchEnd
	shutdown -s -t %shutTime%

::结束段
:end
	set /p a=是否返回主菜单:【y/n】
	IF "%a%" EQU "y" GOTO menu
	IF "%a%" EQU "Y" GOTO menu
	IF "%a%" EQU "n" exit 
	IF "%a%" EQU "N" exit
	cls;
	echo  你的输入不正确，请重新输入!
	GOTO end ::输入不对
pause
del   CONFIG.NT
exit
```

