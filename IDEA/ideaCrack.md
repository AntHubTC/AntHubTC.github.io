# IDEA破解

> 本文仅供学习使用，纯属娱乐，请支持正版软件！！！

​		自从http://idea.lanyus.com/这个网站关闭后，在IDEA快到期的时候开始为难了，下面是我一次crack学习的经历，记录下来。

## JetbrainsCrack法

### 资源

​		IntelliJ IDEA 2017.3.4 （我看网上2018版本也有相关文章，所以我估计2017-2018都可以使用该方法）

​		JetbrainsCrack-2.7.jar (核心关键文件)

### 操作

​		找到IDEA安装目录，IntelliJ IDEA 2017.3.4/bin，如图所示：

![1583806996620](.\img\1583806996620.png)

要修改idea.exe.vmoptions和idea64.exe.vmoptions文件，前者32位程序使用，后者64位程序使用。

```
-Xms512m
-Xmx3072m
-XX:ReservedCodeCacheSize=512m
-XX:+UseConcMarkSweepGC
-XX:SoftRefLRUPolicyMSPerMB=150
-ea
-Dsun.io.useCanonCaches=false
-Djava.net.preferIPv4Stack=true
-XX:+HeapDumpOnOutOfMemoryError
-XX:-OmitStackTraceInFastThrow
在这个文件最后面加入下面内容（这是说明，不要写入）
-javaagent:D:\Program Files\JetBrains\JetbrainsCrack-2.7.jar
```

-javaagent:D:\Program Files\JetBrains\JetbrainsCrack-2.7.jar

JetbrainsCrack-2.7.jar拷贝到对应目录中去。

cmd，然后运行 java -jar JetbrainsCrack-2.7.jar，会得到下面的结果，其中please modify and using key:对应的那个JSON很重要，后面会使用,并且里面很多东西都可以更改，其中paidUpTo这项指的是过期时间，我将它改到我归西都可以不会过期，比如：

```json
{"licenseId":"learnLicenseId",
"licenseeName":"tc",
"assigneeName":"tc",
"assigneeEmail":"tc@163.com",
"licenseRestriction":"By tc Crack, Only Test! Please support genuine!!!",
"checkConcurrentUse":false,
"products":[
{"code":"II","paidUpTo":"9999-9-9"},
{"code":"DM","paidUpTo":"9999-9-9"},
{"code":"AC","paidUpTo":"9999-9-9"},
{"code":"RS0","paidUpTo":"9999-9-9"},
{"code":"WS","paidUpTo":"9999-9-9"},
{"code":"DPN","paidUpTo":"9999-9-9"},
{"code":"RC","paidUpTo":"9999-9-9"},
{"code":"PS","paidUpTo":"9999-9-9"},
{"code":"DC","paidUpTo":"9999-9-9"},
{"code":"RM","paidUpTo":"9999-9-9"},
{"code":"CL","paidUpTo":"9999-9-9"},
{"code":"PC","paidUpTo":"9999-9-9"},
{"code":"DB","paidUpTo":"9999-9-9"},
{"code":"GO","paidUpTo":"9999-9-9"},
{"code":"RD","paidUpTo":"9999-9-9"}
],
"hash":"2911276/0",
"gracePeriodDays":7,
"autoProlongated":false}

```

然后打开idea2017,然后打开”Intellij IDEA License Activation“这个对话框，切换到Activation code这个选项，将上面的那个JSON贴入，然后点击ok就激活啦！！！

![1583807737146](.\img\1583807737146.png)

## 无限重置法

插件市场安装：
在Settings/Preferences… -> Plugins 内手动添加第三方插件仓库地址：https://plugins.zhile.io
搜索：IDE Eval Reset插件进行安装。如果搜索不到请注意是否做好了上一步？网络是否通畅？
插件会提示安装成功。

手动唤出插件的主界面：
如果IDE没有打开项目，在Welcome界面点击菜单：Get Help -> Eval Reset
如果IDE打开了项目，点击菜单：Help -> Eval Reset

唤出的插件主界面中包含了一些显示信息，2个按钮，1个勾选项：
按钮：Reload 用来刷新界面上的显示信息。
按钮：Reset 点击会询问是否重置试用信息并重启IDE。选择Yes则执行重置操作并重启IDE生效，选择No则什么也不做。（此为手动重置方式）
**勾选项：Auto reset before per restart 如果勾选了，则自勾选后每次重启/退出IDE时会自动重置试用信息，你无需做额外的事情。（此为自动重置方式）**

