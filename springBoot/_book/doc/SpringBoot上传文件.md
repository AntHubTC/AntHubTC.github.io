# SpringBoot上传文件

源代码参考项目：08-spring-boot-fileupload



## 文件上传

pom中使用spring-boot-starter-web坐标。

在/src/main/resources/static/建立一个upload.html，源代码：

​      前端要使用post提交，然后enctype要值为multipart/form-data来进行文件上传，使用浏览器控制台能在HTTP请求中看到提交的请求头信息。

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <form action="/upload" method="post" enctype="multipart/form-data">
        <div>
            上传文件：<input type="file" name="file">
        </div>
        <input type="submit" value="提交">
    </form>
</body>
</html>
```

后台接收数据的controller层：

```java
package com.tc.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


/**
 *  SpringBoot 文件上传
 */
//@Controller
@RestController // 表示该类下的方法的返回值会自动做json格式的转换
public class FileUploadController {

    @RequestMapping("/upload")
    public Map<String, Object> upload(
            MultipartFile file //  这个参数的名称file必须和前端的input的name相同，否则就要使用@RequestParam(name = "fileName")来制定参数名称
        ) throws IOException {
        System.out.println(file.getOriginalFilename());
        // 将文件转移存储到目标位置
        file.transferTo(new File("E:/" + file.getOriginalFilename()));

        HashMap<String, Object> map = new HashMap<>();
        map.put("msg", "ok");

        return map;
    }
}
```

配置文件编写：

​      我在使用这个SpringBoot版本，官方已经不推荐配置这些参数了（提示带有删除线），应该有更优的解决方案。

```properties
# 配置springBoot文件上传的大小
#spring.http.multipart.max-file-size=10MB
#spring.http.multipart.max-request-size=10MB
# 多个单词可以连着写，也可以使用-连接
# 设置单个文件上传的大小
spring.http.multipart.maxFileSize=10MB
# 设置上传文件的总容量
spring.http.multipart.maxRequestSize=10MB
```

