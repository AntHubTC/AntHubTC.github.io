## 本地安装DeepSeek

1. 下载 DeepSeek

找到 DeepSeek 的官方网站或下载链接。

下载适合你电脑的版本（Windows、Mac 或 Linux）。

2. 安装 DeepSeek

如果是安装包（如 .exe 或 .dmg 文件），直接双击运行，按照提示安装。

如果是压缩包（如 .zip 或 .tar.gz），解压到一个文件夹。

3. 安装依赖

如果 DeepSeek 需要其他软件支持（比如 Python、Java 等），先安装这些依赖。

通常会有个文件叫 requirements.txt，打开命令行，运行以下命令：

bash复制pip install -r requirements.txt

4. 配置 DeepSeek

找到 DeepSeek 的配置文件（可能是 config.yaml 或 settings.json）。

用记事本或代码编辑器打开，修改里面的参数（比如端口号、[数据库](https://cloud.tencent.com/product/tencentdb-catalog?from=20067&from_column=20067)路径等）。

5. 运行 DeepSeek

如果是图形界面（GUI），直接双击运行。

如果是[命令行工具](https://cloud.tencent.com/product/cli?from=20067&from_column=20067)，打开终端或命令提示符，进入 DeepSeek 的文件夹，运行启动命令，比如：

bash复制python main.py

6. 测试 DeepSeek

打开浏览器，输入 http://localhost:端口号（端口号看配置文件）。

如果能看到 DeepSeek 的界面，说明安装成功了！

7. 常见问题

**打不开**：检查依赖是否安装完整，或者端口是否被占用。

**报错**：看错误信息，通常是缺少某个库或配置不对。

**性能慢**：关掉其他占用内存的程序，或者升级电脑配置。