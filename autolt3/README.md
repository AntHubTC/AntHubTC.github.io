# AutoIt3

## 简介

AutoIt 目前最新是v3版本，这是一个使用类似BASIC脚本语言的免费软件，它设计用于Windows GUI(图形用户界面)中进行自动化操作。它利用模拟键盘按键，鼠标移动和窗口/控件的组合来实现自动化任务，而这是其它语言不可能做到或无可靠方法实现的，比如，我们在使用selenium做自动化测试web应用时，就会遇到一个问题就是，当使用selenium自动化点击了网页中上传文件的按钮后，弹出一个选择文件的弹框，由于这个弹框是属于操作系统的而非浏览器，selenium程序就无法进行后续的操作了，这时侯就我们就可以使用AutoIt编写自动化脚本，来执行后续的自动选择文件的操作。

## AutoIt 可以做的事:

- 简单易懂的类 BASIC 表达式
- 模拟键盘,鼠标动作事件
- 操作窗口与进程
- 直接与窗口的"标准控件"交互(设置/获取 文字,移动,关闭,等等)
- 脚本可以编译为标准可执行文件
- 创建用户图形界面接口(GUI)
- COM支持
- 正则表达式
- 直接调用外部DLL 和 Windows API 函数
- 程序运行为功能(让程序运行于其它账户)
- 详细易懂的帮助文件于基于社区的支持论坛
- 完全兼容于 Windows 2000 / XP / 2003 / Vista / 2008 / 7
- Unicode 与 64位 运算支持
- 高精度,易使用的数学运算
- 可以运行于 Windows Vista Account Control (UAC)

## 扩展

### 和其他自动化结合

还可以和其他自动化结合使用，比如使用selenium上传文件的时候，使用AutoIt3来进行windows文件选择处理。可以使用au3脚本编译成exe来使用，也可以使用maven坐标导入来使用：

```xml
<!-- https://mvnrepository.com/artifact/de.openkeyword/autoit -->
<dependency>
    <groupId>de.openkeyword</groupId>
    <artifactId>autoit</artifactId>
    <version>0.2.44</version>
</dependency>
```

```java
/**
* 调用AutoITX包进行文件上传操作
*/
public void autoUploadMode(String filePath){
        try {
            AutoItX auto = new AutoItX();
            auto.winActivate("打开");
            auto.winWait("[CLASS:#32770]","",10);
            auto.ControlSetText("打开", "", "Edit1", filePath);
            auto.sleep(500);
            auto.controlClick("打开", "", "Button1");
            Thread.sleep(2000);
        } catch (Exception e) {
            // handle exception
        }
}
```

### 和其他dll结合

#### autoIt本身缺少图片识别

实现OCR and Barcode Recognition

https://github.com/MyBotRun/Libraries/tree/master

https://github.com/leobastiani/ImageSearchDLL

ImageSearch.dll



## 参考资料

[全网最全AutoIt3基础教程及实战案例](https://blog.csdn.net/weixin_43552879/article/details/127502320)

[Autolt3官网](https://www.autoitscript.com/site/autoit/)

[AutoIt下载地址](https://www.autoitscript.com/site/autoit/downloads/)

[Autolt3在线中文文档](https://www.autoitx.com/Doc/)  查一查这个文档就能些脚本了

[可以了解下AutoHotKey](https://www.autoahk.com/)

