## 在容器中部署静态网站

### 容器端口映射

```bash
docker run [-P][-p]
	-P,--publish-all=true|false 默认是false    为应用程序所有暴露的端口进行映射
	docker run -P -i -t ubuntu /bin/bash
	-p, --publish=[]
containerPort   只指定容器的端口, 宿主机的端口是随机映射的
	docker run -p 80 -i -t ubuntu /bin/bash
hostPort:containerPort 同时制定容器端口和宿主机的端口
	docker run -p 8080:80 -i -t ubuntu /bin/bash
ip:containerPort   指定宿主机ip和容器的端口
	docker run -p 0.0.0.0:80 -i -t ubuntu /bin/bash
ip:hostPort:containerPort 指定ip，容器端口和宿主机端口
    docker run -p 0.0.0.0:8080:80 -i -t ubuntu /bin/bash
```

## Nginx部署流程

> 提示：docker hub上有现成的nginx镜像

1. 创建映射80端口的交互式容器
2. 安装Nginx
3. 安装文本编辑器vim
4. 创建静态页面
5. 修改Nginx配置文件
6. 运行Nginx
7. 验证网站访问

```bash
docker run -p 80 --name web -i -t ubuntu /bin/bash
apt-get update
apt-get install -y nginx
apt-get install -y vim

mkdir -p /var/www/html
cd /var/www/html
vim index.html
    <html>
        <head>
            <title>Nginx in Docker</title>
        </head>
        <body>
            <h1>hello, I'm website in docker!</h1>
        </body>
    </html>

whereis nginx
vim /etc/nginx/sites-enabled/default
    修改 root 的值为 /var/www/html

cd /
nginx
ps -ef
Ctrl+P Ctrl+Q 退出，后台运行

# docker ps     查看运行的容器 (这个也可以看到端口的映射情况)
docker port web       查看端口映射情况
# docker top web        查看容器进程情况

curl http://127.0.0.1:32768     以映射的端口为准

# docekr inspect web        查看容器对应的IPAddress

# 关闭容器
# docker stop web
# docker start -i web
# ps -ef
# nignx并未启动

# docker exec web nginx
# 重新启动Nginx
# 映射的端口和IP地址均已改变
```

