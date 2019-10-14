# Jasper

## Jasper简介

​		对于基于JSP的web应用来说,我们可以直接在JSP页面中编写Java代码,添加第三方的标签库,以及使用EL表达式。但是无论经过何种形式的处理,最终输出到客户端的都是标准的HTML页面(包含js,css,,),并不包含任何的java相关的语法。也就是说,我们可以把JSP看做是一种运行在服务端的脚本。那么服务器是如何将JSP页面转换为HTML页面的呢?

​		Jasper模块是 Tomcat的JSP核心引擎,我们知道JSP本质上是一个serv1et。 Tomcat使用 Jasper对JSP语法进行解析,生成serv1et并生成class字节码,用户在进行访问jsp时,会访问 Servlet,最终将访问的结果直接响应在测览器端。另外,在运行的时候, jasper还会检测JSP文件是否修改,如果修改,则会重新编译JSP文件。

## JSP编译方式

### 运行时编译

​		Tomcat并不会在启动Web应用的时候自动编译JSP文件，而是在客户端第一次请求时，才编译需要访问的JSP文件。

#### 编译过程

​		Tomcat在默认的web.xml中配置了一个org.apache.jasper.servlet.JspServlet，用于处理所有的.jsp或.jspx结尾的请求，该Servlet实现即是运行时编译的入口。

```xml
    <servlet>
        <servlet-name>jsp</servlet-name>
        <servlet-class>org.apache.jasper.servlet.JspServlet</servlet-class>
        <init-param>
            <param-name>fork</param-name>
            <param-value>false</param-value>
        </init-param>
        <init-param>
            <param-name>xpoweredBy</param-name>
            <param-value>false</param-value>
        </init-param>
        <load-on-startup>3</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>jsp</servlet-name>
        <url-pattern>*.jsp</url-pattern>
        <url-pattern>*.jspx</url-pattern>
    </servlet-mapping>
```

JspServlet处理流程图：

![1571044779079](.\img\1571044779079.png)

#### 编译结果

1. 如果在tomcat/conf/web.xml中配置了参数scratchdir，则jsp编译后的结果，就会存储在该目录下。

   ```xml
   <init-param>
   	<param-name>scratchdir</param-name>
       <param-value>D:/tmp/jsp/</param-value>
   </init-param>
   ```

   

2. 如果没有配置该选项，则会将编译后的结果，存储在Tomcat安装目录下work/Catalina(Engine名称)/localhost(Host名称)/Context名称。假设项目名称为jsp_demo_01，默认的目录为：work/Catalina/localhost/jsp_demo_01。

3. 如果使用的IDEA开发工具集成Tomcat访问web工程中的jsp，编译后的结果存放在:

   ```
   C:\Usrs\Administrator\.IntelliJIdea2019.1\system\tomcat\_project_tomcat\work\Catalina\localhost\jsp_demo_01_war_exploded\org\apache\jsp
   ```

### 预编译

​		除了运行时编译,我们还可以直接在web应用启动时,一次性将web应用中的所有的JsP页面一次性编译完成。在这种情況下,Web应用运行过程中,便可以不必再进行实时编译,而是直接调用JSP页面对应的serv1et完成请求处理,从而提升系统性能。

​		Tomcat提供了一个Shell程序JspC，用于支持JSP预编译，而且在Tomcat的安装目录下提供了一个catalina-tasks.xml文件声明了Tomcat支持的Ant任务，因此，我们很容易使用Ant来执行JSP预编译。（要想使用这种方式，必须得确保在此之前已经下载并安装了Apache Ant）。

## JSP编译原理

### 代码分析

​	找到一个JSP（这里是Index.jsp）生成的字节码文件反编译来看下面的流程：

1. 其类名为Index_jsp，继承org.apache.jasper.runtime.HttpJspBase,该类是HttpServlet的子类，所以Jsp本身就是一个Servlet。

2. 通过属性_jspx_dependants保存了当前JSP页面依赖的资源，包含引入的外部的JSP页面、导入的标签、标签所在的jar包等，便于后续处理过程中使用（如重新编译检测，因此它以Map形式保存了每个资源的上次修改时间）。

3. 通过属性_jspx_imports_packages存放导入的java包，默认导入javax.servlet，javax.servlet.http，javax.servlet.jsp。

4. 通过属性_jsp_imports_classes存放导入的类，通过import指令导入的DateFormat、SimpleDateFormat、Date都会包含在该集合中。\_jspx_imports_packages和\_jspx_imports_classes属性主要用于配置EL引擎上下文。

5. 请求处理由方法_jspService完成，而在父类HttpJspBase中的service方法通过模板方法模式，调用子类的\_jspService方法。

   ```java
   @override
   public final void service(HttpServletRequest request, HttpServletResponse response)
   	throws ServletException, IOException
   {
       _jspService(request, response);
   }
   ```

   

6. \_jspService方法中定义了几个重要的局部变量：pageContext、Session、application、config、out、page。由于整个页面的输出有\_jspService方法完成，因此这些变量和参数会对整个JSP页面生效。这也是我们为什么可以在JSP页面使用这些变量的原因。

7. 指定文档类型的指令(page)最终转化为response.setContentType()方法调用。

8. 对于每一行的静态内容（HTML），调用out.write输出。

9. 对于<%    ...   %>中的java代码，直接转换为Servlet类中的代码。如果在Java代码中嵌入了静态文件，则同样调用out.write输出。

### 编译流程

![1571047134162](.\img\1571047134162.png)

Compiler编译工作主要包含代码生成和编译两部分：

**代码生成**

1. Compiler通过一个PageInfo对象保存JSP页面编译过程中的各种配置，这些配置可能来源于JSP页面的指令配置（如page，include）。
2. 调用ParserController解析指令节点，验证其是否合法，
