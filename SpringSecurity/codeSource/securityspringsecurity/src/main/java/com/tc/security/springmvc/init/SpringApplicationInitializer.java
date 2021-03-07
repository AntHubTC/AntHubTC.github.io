package com.tc.security.springmvc.init;

import com.tc.security.springmvc.config.ApplicationConfig;
import com.tc.security.springmvc.config.WebConfig;
import com.tc.security.springmvc.config.WebSecurityConfig;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

/**
  *   author: tangcheng_cd
  *   create by: 2020/5/3
  *   descr:
 *        SpringApplicationInitializer相当于web.xml，使用了servlet3.0开发则不需要再定义web.xml，ApplicationConfig.class对应以下配置的application-context.xml，WebConfig.class对应以下配置的spring-mvc.xml，web.xml的内容参考：
 */
public class SpringApplicationInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{ ApplicationConfig.class, WebSecurityConfig.class };
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[] { WebConfig.class };
    }

    @Override
    protected String[] getServletMappings() {
        return new String[] { "/" };
    }
}
