# Docker安装Mongo



```bash
docker pull mongo:4.4

docker run -itd --name myMongo -v D:\soft\docker\myMongo\data:/data/db -p 27017:27017 mongo:4.4 --auth
# -v: 将宿主机的/docker_volume/mongodb/data映射到容器的/data/db目录，将数据持久化到宿主机，以防止删除容器后，容器内的数据丢失
# –auth：需要密码才能访问容器服务

# 2.创建用户
# 登录mongo容器，并进入到【admin】数据库

 docker exec -it myMongo mongo admin

###################### 下面是在mongo客户端中执行的脚本 ######################
# 创建一个用户，mongo 默认没有用户
db.createUser({ user:'root',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'},'readWriteAnyDatabase']});

# 新建数据库
use tcdb;
db.test.insert({});

# 创建用户并授权
db.createUser({ user:'root',pwd:'123456',roles:[ { role:'dbAdmin', db: 'tcdb'},'dbAdmin']});
# 更改用户权限
db.updateUser("root", {
	roles: [
			{
                        "role" : "readWrite",
                        "db" : "tcdb"
             },
			{ role:'dbAdmin', db: 'tcdb'},'dbAdmin'
	]
})
```

