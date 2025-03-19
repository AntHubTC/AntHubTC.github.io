# Ollama

官网https://ollama.com/

Ollama 是一个用于在本地运行大型语言模型的工具，以下是一些常见的 Ollama 命令及使用指南：

## 安装

### 安装和启动

#### 安装

在不同操作系统上有不同的安装方式：

- **macOS**：使用 Homebrew 安装

```bash
brew install ollama
```

- **Linux**：可以通过脚本安装

```bash
curl https://ollama.com/install.sh | sh
```

- **Windows**安装：

  官网下载https://ollama.com/然后直接安装即可，支持 macOS, Linux, and Windows

  **安装的时候如何不默认安装在C盘**   

  ```bash
  OllamaSetup.exe /DIR="E:\soft\ollama\program"
  # windows环境变量配置
  OLLAMA_ORIGINS = *
  OLLAMA_MODELS = E:\soft\ollama\models 《- 模型文件的存放位置
  ```

```txt
> ollamaSteup.exe /?
具体参数解释如下：
/HELP, /?：显示此帮助信息。
/SP-：在安装开始时不显示 “这将安装…… 你要继续吗？” 的消息框。
/SILENT, /VERYSILENT：以静默或非常静默模式安装，禁止显示消息框。
/SUPPRESSMSGBOXES：禁止显示消息框。
/LOG：在用户的临时目录中创建日志文件。
/LOG="filename"：指定日志文件的固定路径和文件名。
/NOCANCEL：禁止用户在安装过程中取消操作。
/NORESTART：安装成功后或 “准备安装” 失败要求重启时，阻止系统重启。
/RESTARTEXITCODE=exit code：指定系统需要重启时安装程序返回的自定义退出代码。
/CLOSEAPPLICATIONS：指示安装程序关闭正在使用需要更新文件的应用程序。
/NOCLOSEAPPLICATIONS：防止安装程序关闭正在使用需要更新文件的应用程序。
/FORCECLOSEAPPLICATIONS：强制关闭应用程序。
/FORCENOCLOSEAPPLICATIONS：阻止强制关闭应用程序。
/LOGCLOSEAPPLICATIONS：关闭应用程序时记录额外日志，用于调试。
/RESTARTAPPLICATIONS：指示安装程序重新启动应用程序。
/NORESTARTAPPLICATIONS：阻止安装程序重新启动应用程序。
/LOADINF="filename"：在检查命令行后，从指定文件加载设置。
/SAVEINF="filename"：将安装设置保存到指定文件。
/LANG=language：指定要使用的语言内部名称。
/DIR="x:\dirname"：覆盖默认的安装文件夹路径。
/GROUP="foldername"：覆盖默认的开始菜单文件夹名称。
/NOTICECF：指示安装程序初始勾选 “不创建开始菜单文件夹” 复选框。
/TYPE=type name：指定默认的安装类型。
/COMPONENTS="comma separated list of component names"：覆盖默认的组件设置。
/TASKS="comma separated list of task names"：指定初始应选中的任务列表。
/MERGETASKS="comma separated list of task names"：类似 /TASKS 参数，指定的任务将与默认选中的任务合并。
/PASSWORD=password：指定要使用的密码。
```



#### 启动服务

安装完成后，需要启动 Ollama 服务：

```bash
ollama serve
```

这会在本地启动一个 HTTP 服务，默认监听`127.0.0.1:11434`。

### 模型管理

#### 拉取模型

要使用某个模型，首先需要将其拉取到本地：

```bash
ollama pull <model_name>
```

例如，拉取`llama2`模型：

```bash
ollama pull llama2
```

#### 列出本地模型

可以查看已经拉取到本地的所有模型：

```bash
ollama list
```

#### 删除本地模型

如果你不再需要某个本地模型，可以将其删除：

```bash
ollama rm <model_name>
```

例如，删除`llama2`模型：

```bash
ollama rm llama2
```

### 与模型交互

#### 交互式对话

可以通过命令行与模型进行交互式对话：

```bash
ollama run <model_name>
```

例如，与`llama2`模型进行对话：

```bash
ollama run llama2
```

之后你输入问题，按下回车键，模型会给出回答。

#### 非交互式调用

可以通过管道将输入传递给模型，并获取输出：

```bash
echo "你的问题" | ollama run <model_name>
```

例如：

```bash
echo "什么是人工智能？" | ollama run llama2
```

### 模型创建和定制

#### 创建自定义模型

可以使用`ollama create`命令创建自定义模型。首先需要创建一个`Modelfile`文件，内容示例如下：

```plaintext
# Modelfile
FROM llama2
PARAMETER temperature 0.7
```

然后使用以下命令创建自定义模型:

```bash
ollama create <custom_model_name> -f Modelfile
```

### API 使用

Ollama 还提供了 HTTP API，你可以通过发送 HTTP 请求与模型交互。以下是一个使用`curl`发送请求的示例：

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "什么是人工智能？"
}'
```