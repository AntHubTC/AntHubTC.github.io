# 如何切换nodeJS版本

您可以使用 nvm（Node Version Manager）来方便地在同一台计算机上切换 Node.js 版本。nvm 是一个跨平台的命令行工具，可以安装和管理多个 Node.js 版本。

以下是使用 nvm 切换 Node.js 版本的步骤：

1. 安装 nvm：下载并运行 nvm 的安装脚本。根据您的操作系统和喜好，可以在 GitHub 上找到适合您的安装脚本。

2. 安装 Node.js：使用 nvm 安装所需版本的 Node.js。例如，要安装 Node.js v14.16.0，请运行以下命令：

   ```
   nvm install 14.16.0
   ```

3. 使用 Node.js：使用以下命令将当前 shell 环境设置为使用特定版本的 Node.js。例如，要使用 Node.js v14.16.0，请运行以下命令：

   ```
   nvm use 14.16.0
   ```

   您现在可以在当前 shell 中使用 Node.js v14.16.0 和 npm。

4. 切换 Node.js 版本：如果需要在不同的项目中使用不同的 Node.js 版本，则可以使用以下命令切换到特定版本的 Node.js：

   ```
   nvm use <node_version>
   ```

   其中 <node_version> 是您想要使用的 Node.js 版本。

5. 查看可用的 Node.js 版本：使用以下命令查看所有已安装的 Node.js 版本：

   ```
   nvm ls
   ```