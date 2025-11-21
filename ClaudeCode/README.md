# Claude Code入门与配置



## 安装

1. 安装Node.js

​	Claude Code安装需要依赖NodeJs

   ```bash
node --version
npm --version
   ```

2. 安装Claude Code

   ```bash
   # 设置淘宝镜像源
   npm config set registry https://registry.npmmirror.com
   # 全局安装
   npm install -g @anthropic-ai/claude-code
   # 验证安装
   claude --version
   # 运行
   claude
   ```
   
   ![image-20251121111830032](./README.assets/image-20251121111830032.png)

## 配置代理网络和API方式

1. 在当前项目目录下创建.claude/settings.json

   提示：如果做了全局的科学上网，不用配置这个!

   ```json
   {
   	"env": {
           "HTTP_PROXY": "http://127.0.0.1:7890",
           "HTTPS_PROXY": "http://127.0.0.1:7890"
       }
   }
   ```

   将科学上网打开后，再次运行claude：

   ![image-20251121112204123](./README.assets/image-20251121112204123.png)

2. 配置API Key环境变量

   ```bash
   setx ANTHROPIC_API_KEY "sk-VnQsySMzD4NddsspuykS4FfoGVcBw0ZnR634iV7Gdsda5"
   setx CLAUDE_CODE_GIT_BASH_PATH "C:\Program Files\Git\bin\bash.exe"
   ```

   官方两种计费模式，按月付费和按token付费，前者用于频繁使用，后者用于较少使用。

   可以在国内找套壳的服务，这样的价格会比你在官方划算。比如：[Code Router](https://api.codemirror.codes/)



## Code Router

使用说明：[入口地址](https://api.codemirror.codes/about)

