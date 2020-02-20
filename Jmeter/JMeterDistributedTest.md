# JMeter分布式测试

## 背景

​		由于JMeter本身的瓶颈，当需要模拟数以千计的并发用户时，使用单台机器模拟所有的用户就有些力不从心，甚至还会引起JAVA内存溢出的错误。需要解决这个问题，可以使用分布式测试，运行多台机器运行所谓的Agent来分担JMeter自身的压力，并借此来获取更大的并发用户数，但是需要进行相关的一些配置。

## 操作步骤

1. 安装JMeter，并确定其中一台机器作为Controller控制器，其它机器作为Agent，然后运行所有Agent机器上的JMeter-server.bat----假定我们使用两台机器192.168.0.11和192.168.0.12做为Agent；（Agent机器上必须安装jdk，并设置环境变量）

2. 在Controller机器的%JMETER_HOME%/bin下，编辑JMeter.properties中

   ```properties
   #remote_hosts=127.0.0.1
   remote_hosts=192.168.0.11:1099,192.168.0.12:1099
   ```

3. 启动Controller机器上的jmeter.bat，选择菜单Run中“Remote Start”中的192.168.0.11:1099h和192.168.0.12:1099l来运行Agent。

4. 如果要让某个电脑执行，可以点击改电脑的IP地址就可以，如果两个都要执行，可以点击Run菜单下的“远程运行全部”。

5. 有时候用作代理的机器太少，仍不满足需要，则需要将作为Controller的电脑也当作Agent，则同样需要修改JMeter.properties文件，将Controller的IP地址写入，同时，这个时候，需要先打开Controller电脑中的JMeter-server.bat，然后再打开Jmeter.bat，此时，进入Run --> Remote Start菜单，可以看到Controller也作为远程机器进行运行。

## 常见问题

1. 确定Controller机器上安装jdk版本和jmeter一致。

2. Agent机器启动JMeter-server.bat时，后台提示“could not find ApacheJmeter_core.jar”

   解决办法：这个开始没有找到ApacheJmeter_core.jar，如果不希望看到Could not find的字样，需要添加环境变量JMETER_HOME,路径为bin目录的上一级目录，这样启动jmeter-server服务时，就不会看到这个错误消息了。

3. Jmeter分布式控制过程中，各个Agent启动的线程数等于线程组中的配置。