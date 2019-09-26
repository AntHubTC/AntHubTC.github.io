# Rancher(能够对接各家公有云)

## 安装

在安装Rancher前请先考虑好你所需要使用的架构，因为Rancher的部署有单机部署和启用HA的多节点部署，而单机部署还考虑到外置数据库和使用数据库容器(又分挂载数据目录和不挂载)三种方法，建议是按你的需求和使用环境来选择，如果是大规模使用肯定得上高可用，如果是玩玩就单节点吧，外置数据库的方案备份和迁移比较方便，我这边用的就是这个。

1. 不使用外置数据库，很简单，一句话搞定

```bash
docker run -d --restart=unless-stopped -p 8080:8080 rancher/server
```

不使用外置数据库，但是将数据库目录挂载在本地，这样持久化也能够做备份

```bash
docker run -d -v <host_vol>:/var/lib/mysql --restart=unless-stopped -p 8080:8080 rancher/server
```

2.使用外置数据库，这样是最好的，无论是迁移还是备份亦或是将数据库与主机分离，都没问题

先创建下数据库与用户

```bash
CREATE DATABASE IF NOT EXISTS cattle COLLATE = 'utf8_general_ci' CHARACTER SET = 'utf8';
GRANT ALL ON cattle.* TO 'cattle'@'%' IDENTIFIED BY 'cattle';
GRANT ALL ON cattle.* TO 'cattle'@'localhost' IDENTIFIED BY 'cattle';
```

然后带参数运行Rancher，这些参数太容易看懂了，就不说了

```bash
docker run -d --restart=unless-stopped -p 8080:8080 rancher/server --db-host myhost.example.com --db-port 3306 --db-user username --db-pass password --db-name cattle
```

更多的请查看Rancher的文档——>[传送门](https://rancher.com/docs/rancher/v2.x/en/)  [传送门2](https://www2.cnrancher.com/)