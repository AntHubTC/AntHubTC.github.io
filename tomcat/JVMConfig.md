# JVM配置

​		最常见的配置当属内存分配,因为在绝大多数情況下,JVM默认分配的内存可能不能够满足我们的需求,特别是在生产环境,此时需要手动修改 Tomcat启动时的内存参数分配。

## JVM内存模型图

![1571109875122](.\img\1571109875122.png)

## JVM配置选项

windows平台(catalina.bat)：

```bash
set JAVA_OPTS=-server -Xms2048m -Xmx2048 -XX:MetaspaceSize=256m -XX:MAXMetaspaceSize=256m -XX:SurvivorRatio=8
```

linux平台(catalina.sh)：

```shell
JAVA_OPTS="-server -Xms2048m -Xmx2048 -XX:MetaspaceSize=256m -XX:MAXMetaspaceSize=256m -XX:SurvivorRatio=8"
```

参数说明：

| 参数                                                   | 含义                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| -server                                                | 当前以服务端的方式运行                                       |
| -Xms                                                   | 堆内存的初始大小（最小堆）                                   |
| -Xmx                                                   | 堆内存的最大大小（最大堆） 通常-Xms和-Xmx设置成一个大小，这样程序运行中就不会再去开辟内存空间，提高系统性能。 |
| -Xmn                                                   | 新生代的内存大小，官方建议是整个堆得3/8。                    |
| -XX:MetaspaceSize                                      | 元空间内存初始大小，在JDK1.8版本之前配置为 --XX:PermSize ( 永久代 ) |
| -XX:MaxMetaspaceSize                                   | 元空间内存最大大小，在1.8版本之前配置为 -XX:MaxPermSize ( 永久代 ) |
| -XX:InitialCodeCacheSize<br/>-XX:ReservedCodeCacheSize | 代码缓冲区大小                                               |
| -XX:NewRatio                                           | 设置新生代和老年代的相对大小比例(内存配比)。这种方式的优点是新生代大小会随整个堆大小动态扩展。如 -XX:NewRatio=3 指定“老年代  /  新生代”为  “3/1”。老年代占堆大小的  3/4，新生代占  1/4。 |
| -XX:SurvivorRatio                                      | 指定伊甸园区(Eden)与幸存区大小比例。如 -XX:SurvivorRatio=10 表示伊甸园区(Eden)是幸存区To大小的10倍（也是幸存区From的10倍）。所以，伊甸园区(Eden)占新生代大小的10/12，幸存区From和幸存区To每个占新生代的1/12。注意，两个幸存区永远是一样大的。 |

配置之后，重新启动Tomcat，访问：http://localhost:8080/manager/status 中可以查看最新的内存情况。也可以使用其它工具查看。

![1571113152773](.\img\1571113152773.png)

