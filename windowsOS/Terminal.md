# 命令终端

## cmd

### 打开方式

- win + R,  cmd
- 文件浏览器地址栏    cmd
- shift+鼠标右击 -> "在此处打开cmd窗口"

## powershell

### 打开方式

- win + R,  powershell
- 文件浏览器地址栏    powershell
- shift+鼠标右击 -> "在此处打开powershell窗口"

### 美化终端

以管理员身份打开powershell:

```bash
Set-ExecutionPolicy Bypass
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
Install-Module DirColors -Scope CurrentUser

```

![Install-Module posh-git -Scope CurrentUser](.\img\20171230140514458.png)

```bash
Set-Theme Agnoster  # 按tab会出现其它的主题
```

```bash
$profile
notepad $profile
在记事本中录入下面信息然后保存, 如果没有就建立一个。  这个文件会在powershell启动的时候预先加载。
# ==========start============
Import-Module DirColors
Import-Module posh-git
Import-Module oh-my-posh
# Set-Theme PowerLine
Set-Theme Avit
# ==========end============
```

如果还没有zsh 那样的效果。——因为我们缺少专用的字体！

[自定义 Windows PowerShell 和 cmd 的字体](https://blog.walterlv.com/post/customize-fonts-of-command-window.html)

[powerline字体](https://github.com/powerline/fonts)

[黑纱字体](https://github.com/be5invis/Sarasa-Gothic/releases)



![效果图](.\img\20190602233532870.png)

## Fluent Terminal

**安装方式**

Fluent Terminal是github上的一个开发项目，在releases上下载最新发布版本。

https://github.com/felixse/FluentTerminal/releases

### 打开方式

![1568706766929](.\img\1568706766929.png)

![1568709487768](.\img\1568709487768.png)