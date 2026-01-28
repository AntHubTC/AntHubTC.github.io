# 容器维护



## 如何升级

在服务器上运行的服务，随着时间推移，相对于官方的版本就落后了，官方的新版本可能有很多新的特性我们需要使用，这个时候我们就需要考虑升级镜像。

1. 先打开终端，切换到 `docker-compose.yml` 所在的文件夹（替换为你的实际路径）：

   比如 cd /home/ubuntu/talebook

2. 拉取最新版本镜像

   ```bash
   docker-compose pull
   ```

   

3. 重启容器（基于新镜像）

   这条命令会停止旧容器，用新镜像启动新容器，同时保留所有配置（端口、数据卷、依赖关系）：

   ```bash
   docker-compose up -d
   ```

   `-d` 参数表示后台运行，执行后会输出：

   Recreating douban-rs-api ... done

   Recreating talebook      ... done

4. 验证升级是否成功（可选）

   ```bash
   # 查看容器状态（确保 STATUS 为 Up）
   docker-compose ps
   
   # 查看容器日志（排查异常）
   docker-compose logs talebook
   
   # 访问服务验证（浏览器打开 http://你的服务器IP:8080）
   curl http://localhost:8080
   ```

5. 清理旧镜像（可选，释放磁盘空间）

      升级后会残留旧版本镜像，可执行以下命令清理：
      
      ```bash
      docker system prune -f
      ```
      
      