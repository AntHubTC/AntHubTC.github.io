# ESP8266学习



## 语言选择

ESP8266是一款非常流行的Wi-Fi微控制器，可以使用许多程序语言编写。以下是几种常见的语言：

1. Arduino语言：Arudino是一种基于C++的开源编程语言，提供了大量的库和示例代码，使得使用Arduino语言编写ESP8266程序非常容易。
2. MicroPython：MicroPython是一种Python 3编译器，它可以在微控制器上运行。它提供了一套标准库，支持网络编程和其他常见任务。
3. Lua：Lua是一种轻量级脚本语言，经常用于嵌入式系统和游戏开发。它可以用于编写ESP8266的固件程序。
4. C语言：ESP8266具有完整的TCP/IP协议栈，因此可以使用C语言直接编写网络应用程序。

总的来说，Arduino语言是最受欢迎的语言之一，因为它的易用性和广泛的支持社区。但如果你想要更高级的功能或者更小的代码体积，那么MicroPython或Lua可能更适合你。（值得一提，我学会使用chatGPT帮助自己）

下面我使用的是：MicroPython。



## 固件烧写

​	当然，使用对应的语言需要相应的固件程序，需要将相应的固件程序烧录到板子中。

​	下载esp8266的micropython固件https://micropython.org/download/?mcu=esp8266，一般都是2Mib+的

​	



## 开发环境搭建

### pycharm+MicroPython

搭建MicroPython+ESP8266开发环境可以分为以下几个步骤：

1. 准备硬件设备

选择一款ESP8266开发板，比如NodeMCU或者Wemos D1 mini等。这些开发板都内置了ESP8266芯片，并且带有USB转串口芯片，方便与电脑进行通信。

2. 安装串口驱动程序

将ESP8266开发板连接到电脑的USB接口上，需要先安装对应的串口驱动程序。不同操作系统对应的驱动程序不同，可以在开发板的官方网站上查找并下载。

安装CH340串口驱动 ，参考[入口地址](https://blog.csdn.net/WCH_TechGroup/article/details/124242436?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167932965416800197085901%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=167932965416800197085901&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-124242436-null-null.142^v74^control,201^v4^add_ask,239^v2^insert_chatgpt&utm_term=CH340%E9%A9%B1%E5%8A%A8&spm=1018.2226.3001.4187)

3. 安装MicroPython固件

MicroPython是一种精简版的Python解释器，可以运行在ESP8266芯片上。需要将MicroPython固件烧录到ESP8266芯片上，才能开始开发。可以从MicroPython官方网站上下载最新版本的固件。

​	我才用的NodeMCU-PyFlasher进行烧写固件，[下载地址](https://github.com/marcelstoer/nodemcu-pyflasher/releases)

4. 使用串口工具连接ESP8266开发板

打开串口工具，设置正确的波特率、数据位、校验位和停止位等参数，连接ESP8266开发板。在串口工具中输入repl回车即可进入MicroPython交互式命令行界面。

5. 开始使用MicroPython开发ESP8266应用

现在就可以在MicroPython环境中直接编写Python代码，调用ESP8266相关的API来控制IO口、连接WiFi网络、发送HTTP请求等等操作。可以通过串口工具向开发板发送代码，也可以将代码保存到开发板中。

以上就是搭建MicroPython+ESP8266开发环境的基本步骤

​	参考文章： https://zhuanlan.zhihu.com/p/346062458



## 遇到的问题

1.程序写进去后，发现电脑有时候能发现板子有时候发现不了，非要按住RST键才能看见，原因是因为USB没有插好。









参考文档：

http://docs.micropython.org/en/latest/esp8266/

https://www.jerrycoding.com/article/nodemcu-io/