# Docker安装Mysql

​	参考资料： [使用Docker搭建MySQL服务](https://www.cnblogs.com/sablier/p/11605606.html)

## 安装

[dockerHub](https://hub.docker.com)上或直接  sudo docker search mysql --filter=stars=40 查找找到可用的mysql镜像。

```bash
# 拉取镜像
docker pull mysql:latest
# 查看
docker images | grep mysql

# 运行容器
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql
# -p 3306:3306 ：映射容器服务的 3306 端口到宿主机的 3306 端口，外部主机可以直接通过 宿主机ip:3306 访问到 MySQL 的服务。
# MYSQL_ROOT_PASSWORD=123456：设置 MySQL 服务 root 用户的密码。

# 查看是否安装成功
docker ps 

# 启动一个bash
sudo docker exec -it mysql-learn bash
# mysql相关命令都在/usr/bin下
ls /usr/bin/mysql*
# mysql相关配置在
ls /etc/mysql
# 连接
# mysql -h localhost -P 3306 -u root -p123456
mysql -uroot -p123456
# 查看版本
# mysql --version  或 mysql -V
select version();

# 更改密码
# ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

# mysql 命令
show databases;
use mysql;
# 查看当前数据库
select database();
# show tables from mysql;
show tables;
select * from user;

# 退出客户端
exit
```

## mysql允许远程访问

### 防火墙阻拦

```bash
# 开放端口：
systemctl status firewalld
firewall-cmd  --zone=public --add-port=3306/tcp -permanent
firewall-cmd  --reload
# 关闭防火墙：
sudo systemctl stop firewalld
```

## mysql配置远程访问

```bash
# mysql使用mysql数据库中的user表来管理权限，修改user表就可以修改权限（只有root账号可以修改）
# 连接
mysql -uroot -p123456
mysql> use mysql;
mysql> select host,user,password from user;
mysql> grant all privileges  on *.* to root@'%' identified by "password";
mysql> flush privileges;
mysql> select host,user,password from user;
```

