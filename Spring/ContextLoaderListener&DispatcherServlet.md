# Spring ��ContextLoaderListener��DispatcherServlet�����ص�context�Ĺ�ϵ

> ת�� https://blog.csdn.net/woshiren123ew/article/details/70448082



## ����

- ContextLoaderListener���ص�applicationContext��webӦ��ȫ�ֵ������ģ���DispatcherServlet���ص�applicationContext��spring MVC�������ġ�

- ContextLoaderListener�����ص�context��springͨ��servletContext.setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, this.context)��ŵ�ServletContext��attribute�С��������Ŀ�ͨ��WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext)��WebApplicationContextUtils.getWebApplicationContext(servletContext)��������ȡ�� 
  DispatcherServlet����context��ɺ����publishContext���Ե�ֵ����Ϊtrue�Ļ�(ȱʡΪtrue) �Ὣcontext�����ServletContext��keyΪorg.springframework.web.servlet.FrameworkServlet.CONTEXT. + (servletName)��attribute�С�

  xml�������£�

  ```xml
  <servlet>  
      <servlet-name>dispatcher</servlet-name>  
      <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
      <init-param>  
      <param-name>contextConfigLocation</param-name>  
      <param-value>classpath*:dispatcher-servlet.xml</param-value>  
      </init-param>  
  </servlet>  
  ```

  

- DispatcherServlet�����ص�applicationContext������Ϊ��mvc˽�е�context�����ڱ�����servletContext�е�keyֵ��ͨ��ContextLoaderListener���ؽ�����applicationContextʹ�õ�keyֵ����ͬ��������ֻʹ��DispatcherServlet����context�Ļ�������������еط�ʹ��WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext) ����ͼ��ȡapplicationContextʱ���ͻ��׳���No WebApplicationContext found: no ContextLoaderListener registered?����exception��

## ����

- Spring��ContextLoaderListener������������context��Spring MVC DispatcherServlet������������context�Ǹ��ӹ�ϵ��FrameworkServlet��ʵ������Ӧ��applicationContext��ͨ��setParent����ServletContext�л�ȡ����ContextLoaderListener������applicaitonContext���óɸ������ģ�Ȼ������ڶ�Ӧ��xml�����ļ������ʼ����

- Father WebApplicationContext���bean���Ա�ע�뵽child WebApplicationContext���bean����child WebApplicationContext��bean���ܱ�ע�뵽parent WebApplicationContext���bean��������ʹ��**Spring MVCʱ�����Զ���⹦�ܣ�Ӧ��applicationContext.xml��ֻcomponent-scan��Controller���࣬����Spring MVC��ֻcomponent-scan Controller��** (������ظ�ע���ʼ�����������������)

  applicationContext.xml��������

  ```xml
  <context:component-scan base-package="com.test">
     <context:exclude-filter  expression="org.springframework.stereotype.Controller" type="annotation" />
     <context:exclude-filter type="annotation" expression="org.springframework.web.bind.annotation.ControllerAdvice" />
  </context:component-scan>
  ```

  dispatcher-servlet.xml����������

  ```xml
  <context:component-scan base-package="com.test.web" use-default-filters="false">
      <context:include-filter expression="org.springframework.stereotype.Controller"
          type="annotation" />
      <context:include-filter type="annotation" expression="org.springframework.web.bind.annotation.ControllerAdvice" />
  </context:component-scan>
  ```

  �������ô�ֿ�ɨ��Ļ�����ô���������������ж��������Ӧ��beanʵ����������Ϊ����ͬһ�������У�������Ȼ����bean��id��ͬҲ�������������ɻ��Ӧ�õĸ�����ͬʱ��������Է��ֵ����⡣������������һ�����⣺

  > ��һ��ApplicationListenerʵ�ּ���@Componentע�⣬��applicationContext.xml��dispatcherServlet.xml����������ͬ��ɨ�跽�����ڴ��������¼���ʱ���������onApplicationEvent������������Ϊ��Spring�������ĺ�Spring MVC����������������ͬ���Ƶ�bean���ڵ����������еļ�������Spring��ȥ�鿴���������Ƿ�Ҳ�м������ڼ�����Ӧ���¼������������ü���������

  ## ע��

  ?		��Ȼ������context��������һ�Ը��ӹ�ϵ�������Ǽ��ص�bean���Ǻϲ��洢�ģ����Ը��˽��飬����mvc��ص�spring������DispatcherServlet���أ��������JavaBean������ContextLoaderListener����

