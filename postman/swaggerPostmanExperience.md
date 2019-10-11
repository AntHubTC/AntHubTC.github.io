# Swagger与postman使用心得

Swagger接口文档，在线自动生成模板和页面。服务器地址加上swagger-ui.html后缀即可访问到（https://域名:端口号/swagger-ui.html）。

使用时在java代码中引用navan管理pom.xml中添加依赖：

```xml
<!-- Swagger-mvc -->
<dependency>
    <groupId>com.mangofactory</groupId>
    <artifactId>swagger-springmvc</artifactId>
    <version>1.0.2</version>
</dependency>
```

我在项目中使用的是SpringBoot框架，减少了很多的配置信息

在进行接口设计的Controller中，只需要使用Swagger注解。其中下面的@Api、@ApiOperaction、@Apiparam都是Swagger注解：

其中@Api表示这是一个需要Swagger表示的类写在Controller的头部，如图；

![img](.\img\20180315113135266)

@ApiOperaction表示这是一个需要Swagger修饰的接口，其中表明了请求方式、说明等信息。

@ApiParam表示该接口输入的参数：

​		value是参数的值说明；name表示变量名；paramType表示传入类型，我所知类型：请求头传入写query,JSON类型传入写json；defaultValue表示默认值；required表示参数是否必须传。 

![img](.\img\20180315114207640)

​		API接口文档标识的内容只用于注释，没有实际意义，表示必须传入，只在文档中提示，没传不提示报错。若想判断，可在参数前些@requestParam注解 

![img](.\img\20180315140353954.png)

写好API注解文档后，启动项目。可以在swagger.html中对接口进行模拟测试，简单方便。

![img](.\img\20180315140907522.png)

在对应字段中输入测试值，点击try it out请求接口，返会参数将在respnseBody中展示： 

![img](.\img\2018031515114849.png)

​		以上就是Swagger对接口管理和测试的简单实用方法，另外它还可以对Bean进行注释和管理。

​		对于一个实体模型，需要使用swagger去标识。如下面的Student模型，其中的@ApiModel、@ApiModelProperty都是属于Swagger的注解。如果需要在接口中返回模型对象，则需要使用以下的方式去注解。

```java
@ApiModel(value = "学生对象", description = "student")
public class Student {
 
    @ApiModelProperty(value = "姓名", required = true)
    String name;
    @ApiModelProperty(value = "年龄", required = true)
    String age;
 
    public Student(String name, String age) {
        this.name = name;
        this.age = age;
    }
 
    public String getName() {
        return name;
    }
 
    public void setName(String name) {
        this.name = name;
    }
 
    public String getAge() {
        return age;
    }
 
    public void setAge(String age) {
        this.age = age;
    }
}
```

​		我目前更多的使用Swagger管理API文档，测试接口。管理Bean个人并不常用。可以把Swagger理解为接口文档，后台写好的代码可以直接生成前端接口文档页面，接口调用这可以通过这个页面发送接口请求，进行接口测试或调用。对接方便。无奈的是，返回参数的接口文档，还是要自己写啊。

​		Postman插件，postman只是Chrome浏览器一个控件，可以嵌在Chrome中使用，也可以单独下载软件版。用来测试接口非常只方便。而且可以分类管理测试过的接口。分享接口

![img](.\img\20180315152605282.png)

它得好处就是可以记忆测试的参数，Swagger毕竟是网页打开，很多参数无法保存。对家数据测试造成不小困扰，另外。设计到token权限的话，swagger中可能每次都需要模拟登录，而postman在Header中保存Token信息。给测试带来便利，按照程序员的尿性，我推荐postman。清晰整齐，一目了然。

那么他如何与前端对接呢，写接口文档吗？可以，或者你可让你家前端自己也下载一个，你把你测试的接口整理给他。就看他愿不愿意用咯。

总结：后台测试，推荐使用Postman。但是最好养成写Swagger的习惯，第一是可以给前端看，让他们参考。





版权声明：本文为CSDN博主「lw1242189467」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/lw1242189467/article/details/79565075