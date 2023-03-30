# 安装NodeJS



## Windows下载安装

在Windows上通过命令行安装Node.js，您需要按照以下步骤进行操作：

1. 下载msi安装包：访问Node.js的官方网站 https://nodejs.org/en/download/ ，下载msi安装包。

2. 打开命令提示符：按下Win+R键，输入"cmd"打开命令提示符窗口。

3. 进入msi安装包所在目录：在命令提示符中输入“cd /d <msi安装包所在目录>”，以进入msi安装包所在目录。例如：

   ```
   cd /d D:\Downloads
   ```

4. 安装Node.js：在命令提示符中运行以下命令，以安装Node.js：

   ```
   msiexec /i <msi文件名>.msi
   ```

   例如：

   ```
   msiexec /i node-v16.13.0-x64.msi
   ```

5. 等待安装完成：等待安装程序完成，这可能需要几分钟时间。

6. 验证安装：在命令提示符中运行以下命令，以验证Node.js是否已成功安装：

   ```
   node -v
   ```

   如果安装成功，将会显示当前安装的Node.js版本号。

请注意，在安装Node.js时，应该选择将Node.js添加到系统环境变量中，以便您可以在任何地方使用Node.js和npm命令。

## Scoop安装

要在 Windows 上安装 Scoop，请按照以下步骤进行操作：

1. 打开 Windows PowerShell：按下“Win+R”键，输入"powershell"并按回车键。

2. 启用 Powershell 脚本执行权限：运行以下命令启用Powershell的脚本执行权限：

   ```
   Set-ExecutionPolicy RemoteSigned -scope CurrentUser
   ```

3. 安装 Scoop: 运行以下命令以在您的计算机上安装 Scoop：

   ```
   iwr -useb get.scoop.sh | iex
   ```

   如果您使用的是 PowerShell 7.x 版本，请尝试以下命令：

   ```
   Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
   ```

4. 验证 Scoop 是否已成功安装：运行以下命令验证 Scoop 是否已成功安装：

   ```
   scoop help
   ```

   如果安装成功，将会显示关于 Scoop 的帮助信息。

现在，您可以使用 Scoop 命令来搜索、安装和卸载各种应用程序。例如，要在 Windows 上安装 Node.js，请运行以下命令：

```
scoop install nodejs
```

希望这些步骤能够帮助您在 Windows 上安装 Scoop。