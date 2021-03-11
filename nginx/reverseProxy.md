# 反向代理

## 实例一

通过访问192.168.99.100:80，访问nginx反向代理的http://192.168.99.100:8080

```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  192.168.99.100;

    location / {
      proxy_pass http://192.168.99.100:8080;
    }
}
```

## 实例二：

根据路径反向代理到不同服务器中去。

```nginx
server {
    listen       80;
    listen  [::]:80;
    server_name  192.168.99.100;

    location ~ /edu/ {
      proxy_pass http://192.168.99.100:8081;
    }
    location ~ /vod/ {
      proxy_pass http://192.168.99.100:8082;
    }
}
```

## location指令说明

最好看看官网文档说法：[入口地址](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)

location指令说明。
该指令用于匹配URL。。
语法如下:

> ```nginx
> location [ = | ~ | ~* | ^~] uri {
> 
> }
> ```
>
> 1、=: 用于不含正则表达式的uri前，要求请求字符串与uri严格匹配，如果匹配成功，
> 	就停止继续向下搜索并立即处理该请求
> 2、~: 用于表示uri包含正则表达式，并且区分大小写
> 3、~\*: 用于表示uri包含正则表达式，并且不区分大小写
> 4、^~: 用于不含正则表达式的uri前，要求Nginx服务器找到标识uri和请求字
> 	符串匹配度最高的location后，立即使用此location处理请求，而不再使用location
> 	块中的正则uri和请求字符串做匹配
> 注意: 如果uri包含正则表达式，则必须要有~或者~*标识。

