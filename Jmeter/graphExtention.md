# JMeter图形监控扩展

插件下载： https://jmeter-plugins.org/install/Install/

## 插件管理器

插件管理器下载Plugi Manager: https://jmeter-plugins.org/get/

将jmeter-plugins-manager-1.3.jar放到%JMETER_HOME%/lib/ext/中，然后重启JMeter，这个时候"选项"--> "Plugin Manager"。

![1582182422884](E:\2_STUDY\GitHubRepositories\00myGitHubRepository\FallenGodCoder.github.io\Jmeter\img\1582182422884.png)



## JPGC安装

在“Plugin Manager”中“Available Plugins”中找到“jpgc - Standard Set”，如果需要其它插件也可以勾上，然后开始引用安装。

jpgc是一个集合体，里面有很多的插件。

![1582184022941](.\img\1582184022941.png)

## 系统的监控代理服务器

https://github.com/undera/perfmon-agent

https://jmeter-plugins.org/wiki/PerfMonAgent/

直接对下载后的ServerAgent解压， 放到随意的目录，然后点击打开里面的`startAgent.bat` 文件即可，如果要修改端口号，可以加参数`--udp-port 4445 --tcp-port 4446` 

![fffff](E:\2_STUDY\GitHubRepositories\00myGitHubRepository\FallenGodCoder.github.io\Jmeter\img\20170204105439570.png)

由于JMeter必须要有一个取样器，否则不会运行，所以可以随便添加一个HTTP请求。

![1582188147276](.\img\1582188147276.png)

CPU情况：

![1582188162980](.\img\1582188162980.png)

内存情况：

![1582188181678](.\img\1582188181678.png)