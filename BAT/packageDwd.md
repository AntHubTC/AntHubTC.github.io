# 工程打包部署文件实战

## 效果图

检查脚本执行环境：

![1582617900074](.\img\1582617900074.png)

菜单界面1：

![1582617999229](.\img\1582617999229.png)

菜单界面2：

![1582618031469](.\img\1582618031469.png)

构建打包中:

![1582618082452](.\img\1582618082452.png)

## 源码

**package.bat:**

> 文件编码：ANSI。    如果使用UTF-8，在执行bat的时候中文字符显示乱码。

```bash
@echo off & setlocal enabledelayedexpansion & color 1a & title dwd package script

setlocal

:init :: init scipt variable
	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
	echo ▇▇▇▇▇              PROGRAM NAME:dwd package script       ▇▇▇▇▇
	echo ▇▇▇▇▇              AUTHOR: tangcheng_cd                  ▇▇▇▇▇
	echo ▇▇▇▇▇              CREATE DATE:2020/02/21                ▇▇▇▇▇
	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇

	echo;
	echo=
	echo ...init...

	set SCRIPT_HOME=%CD%
	cd /d..\code\v1.0
	set SOURCE_DIR=%CD%
	echo SCRIPT_HOME:%SCRIPT_HOME%
	cd /d %SCRIPT_HOME%

:checkEnv :: check script environment
	echo check soft run environment...

	echo=
	echo check npm command...
	call npm -version && (
		title dwd package script
		echo success: npm already installed.
	) || (
		title dwd package script
		echo error: npm not install, please install.
		goto end
	)

	echo=
	echo check node command...
	call node -v && (
		echo success: node already installed.
	) || (
		echo error: node not install, please install.
		goto end
	)

	echo=
	echo check mvn command...
	call mvn -v && (
		echo success: maven already installed.
	) || (
		echo error: maven not install, please install.
		goto end
	)

	echo=
	echo check tar command...
	call tar --help >nul && (
		echo success: tar already installed.
	) || (
		echo error: tar not install, please install.
		goto end
	)

	echo=
	echo check SOURCE_DIR direcotry
	if not exist %SOURCE_DIR% (
		echo error: %SOURCE_DIR% directory not exist.
		goto end
	) else (
		echo success: %SOURCE_DIR% direcotry exist.
	)


	echo=
	for %%p in (dwd_core,dwd_dt,dwd_ops) do (
		if not exist %SOURCE_DIR%\%%p (
			echo error: %SOURCE_DIR%\%%p directory not exist.
			goto end
		) else (
			echo success: %SOURCE_DIR%\%%p direcotry exist.
		)

		if not exist %SOURCE_DIR%\%%p\%%p_FRONT1 (
			echo error: %SOURCE_DIR%\%%p\%%p_FRONT directory not exist.
			goto end
		) else (
			echo success: %SOURCE_DIR%\%%p\%%p_FRONT direcotry exist.
		)

		if not exist %SOURCE_DIR%\%%p\%%p%_BACK1 (
			echo error: %SOURCE_DIR%\%%p\%%p%_BACK directory not exist.
			goto end
		) else (
			echo success: %SOURCE_DIR%\%%p\%%p%_BACK direcotry exist.
		)
	)


	pause
	exit /b

:menu1 :: first menu
	cls
	cd /d %SCRIPT_HOME%

	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
	echo ▇▇▇▇▇              PROGRAM NAME:dwd package script       ▇▇▇▇▇
	echo ▇▇▇▇▇              AUTHOR: tangcheng_cd                  ▇▇▇▇▇
	echo ▇▇▇▇▇              CREATE DATE:2020/02/21                ▇▇▇▇▇
	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇

	echo Please select pack one project:
	echo      (1).DWD_CORE
	echo      (2).DWD_DT
	echo      (3).DWD_OPS
	echo      (q).quit

	set item=NULL
	set /p item=Please input your select:
	
	IF %item% == 1 set CURRENT_PROJECT=dwd_core
	IF %item% == 2 set CURRENT_PROJECT=dwd_dt
	IF %item% == 3 set CURRENT_PROJECT=dwd_ops


	set SOURCE_PROJECT_MAIN=%SOURCE_DIR%\%CURRENT_PROJECT%
	set SOURCE_PROJECT_FRONT=%SOURCE_PROJECT_MAIN%\%CURRENT_PROJECT%_FRONT
	set SOURCE_PROJECT_BACK=%SOURCE_PROJECT_MAIN%\%CURRENT_PROJECT%_BACK

	IF %item% GEQ 1 IF %item% LEQ 3 GOTO menu2
	IF %item% == q GOTO end

	cls
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ Error ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo Input item error! please input retry
	echo;
	echo=
	pause
	GOTO menu1

:menu2 :: second menu
	cls
	cd /d %SCRIPT_HOME%

	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
	echo ▇▇▇▇▇              PROGRAM NAME:dwd package script       ▇▇▇▇▇
	echo ▇▇▇▇▇              AUTHOR: tangcheng_cd                  ▇▇▇▇▇
	echo ▇▇▇▇▇              CREATE DATE:2020/02/21                ▇▇▇▇▇
	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇

	echo Current project: %CURRENT_PROJECT%
	echo Please select one item:
	echo      (1).clean deploy directory
	echo      (2).init deploy workspace directory
	echo      (3).copy tomcat config and nginx config
	echo      (4).build common maven project
	echo      (5).pack backend project code
	echo      (6).pack front project code
	echo      (a).all
	echo      (b).back parent menu
	echo      (q).quit

	set BUILD_METHOD=NULL
	set /p BUILD_METHOD=Please input your select:
	IF %BUILD_METHOD% == 1 GOTO step1
	IF %BUILD_METHOD% == 2 GOTO step2
	IF %BUILD_METHOD% == 3 GOTO step3
	IF %BUILD_METHOD% == 4 GOTO step4
	IF %BUILD_METHOD% == 5 GOTO step5
	IF %BUILD_METHOD% == 6 GOTO step6
	IF %BUILD_METHOD% == a GOTO step1
	IF %BUILD_METHOD% == b GOTO menu1
	IF %BUILD_METHOD% == q GOTO end

	cls
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ Error ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo Input item error! please input retry
	echo;
	echo=
	pause
	GOTO menu2

:confirmContinue
	echo;
	echo=
	echo Whether to return to the menu interface?
	echo      (q).quit
	echo      else continue

	set item=NULL
	set /p item=Please input your select:
	IF %item% NEQ q GOTO menu2
	GOTO end

:step1
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start clean deploy directory ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo clean ...
	echo %SCRIPT_HOME%\%CURRENT_PROJECT%\deploy
	cd /d %SCRIPT_HOME%\%CURRENT_PROJECT%
	IF exist .\deploy rmdir /S /Q .\deploy

	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO step2

:step2
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start init deploy workspace directory ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	cd /d %SCRIPT_HOME%
	if not exist .\%CURRENT_PROJECT%\deploy mkdir .\%CURRENT_PROJECT%\deploy
	echo prepare tomcat software...
	tar -xvf .\soft\apache-tomcat-7.0.62.tar -C .\%CURRENT_PROJECT%\deploy
	echo;
	echo prepare nginx software...
	tar -xvf .\soft\nginx-1.10.2.tar -C .\%CURRENT_PROJECT%\deploy
	
	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO step3

:step3
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start copy tomcat config and nginx config ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	cd /d %SCRIPT_HOME%
	copy /Y ".\%CURRENT_PROJECT%\config\tomcat_server.xml" ".\%CURRENT_PROJECT%\deploy\apache-tomcat-7.0.62\conf\server.xml"
	copy /Y ".\%CURRENT_PROJECT%\config\nginx.conf" ".\%CURRENT_PROJECT%\deploy\nginx-1.10.2\conf\nginx.conf"

	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO step4

:step4
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start build common project ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇

	cd /d %SOURCE_DIR%
	echo build common project dependices

	cd /d %SOURCE_DIR%\dwd_common\dwd-zookeeper
	REM Here must be the call command，otherwise program will break exist.
	call mvn clean install --settings %SCRIPT_HOME%/soft/mavenSettings.xml -Dmaven.test.skip=true

	cd /d %SOURCE_DIR%\dwd_common\dwd-dbmeta
	REM Here must be the call command，otherwise program will break exist.
	call mvn clean install --settings %SCRIPT_HOME%/soft/mavenSettings.xml -Dmaven.test.skip=true


	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO step5
:step5
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start pack backend project code ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇

	cd /d %SOURCE_PROJECT_BACK%
	echo start pack backend project code

	REM Here must be the call command，otherwise program will break exist.
	call mvn clean install --settings %SCRIPT_HOME%/soft/mavenSettings.xml -Dmaven.test.skip=true

	echo Copy client result file to deploy directory
	IF %CURRENT_PROJECT% == dwd_core set SOURCE=%SOURCE_PROJECT_BACK%\dwd-core-client\target\dwd-core-client.jar
	IF %CURRENT_PROJECT% == dwd_dt set SOURCE=%SOURCE_PROJECT_BACK%\dwd-dt-client\target\dwd-dt-client.jar
	IF %CURRENT_PROJECT% == dwd_ops set SOURCE=%SOURCE_PROJECT_BACK%\dwd-ops-client\target\dwd-ops-client.jar
	
	copy /Y %SOURCE% %SCRIPT_HOME%\%CURRENT_PROJECT%\deploy\
	set SOURCE=<NUL

	echo Copy server result file to deploy directory
	IF %CURRENT_PROJECT% == dwd_core set SOURCE=%SOURCE_PROJECT_BACK%\dwd-core-server\target\dwd-core-server.war
	IF %CURRENT_PROJECT% == dwd_dt set SOURCE=%SOURCE_PROJECT_BACK%\dwd-dt-server\target\dwd-dt-server.war
	IF %CURRENT_PROJECT% == dwd_ops set SOURCE=%SOURCE_PROJECT_BACK%\dwd-ops-server\target\dwd-ops-server.war

	copy /Y %SOURCE% %SCRIPT_HOME%\%CURRENT_PROJECT%\deploy\apache-tomcat-7.0.62\webapps\
	set SOURCE=<NUL

	copy /Y %SCRIPT_HOME%\%CURRENT_PROJECT%\config\startDWD.bat %SCRIPT_HOME%\%CURRENT_PROJECT%\deploy\startDWD.bat

	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO step6
:step6
	echo;
	echo=
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇
	echo ☆ start pack front project code ☆
	echo ◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇◇

	cd /d %SOURCE_PROJECT_FRONT%
	IF EXIST .\dist rd /s /q .\dist
	echo start pack front project code

	call npm run build
	set targetDIR=%SCRIPT_HOME%\%CURRENT_PROJECT%\deploy\nginx-1.10.2\data\www\dwdFront\
	rd /s /q %targetDIR%
	mkdir %targetDIR%
	xcopy /E /I /Y %SOURCE_PROJECT_FRONT%\dist\* %targetDIR%

	echo step end.
	IF %BUILD_METHOD% NEQ a GOTO confirmContinue
	GOTO confirmContinue

:end
	cd /d %SCRIPT_HOME%
	endlocal
	echo ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
	echo The program has ended
```

