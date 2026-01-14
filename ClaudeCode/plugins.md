# Plugins

插件

对应目录：~/.claude/plugins/

Plugins = 若干Skills + 若干Slash Commands + 若干MCP + 若干SubAgent +若干Hooks

官方：https://github.com/anthropics/claude-code/tree/main/plugins



## Claude官方插件

~\\.claude\plugins\marketplaces\claude-plugins-official\plugins

### 基础开发/插件开发类
1. `agent-sdk-dev` → 开发 Claude 智能体/机器人的SDK工具包，供开发者二次开发
2. `plugin-dev` → Claude 插件开发的核心工具，编写/调试/打包自定义插件专用
3. `example-plugin` → 插件开发的官方示例模板，新手入门参考的demo插件
4. `hookify` → 为Claude配置自定义钩子函数，扩展插件的触发/执行逻辑

### 代码审查/优化/提交类（核心高频）
1. `code-review` → 代码审查插件，自动检查代码BUG、语法错误、规范问题、逻辑漏洞，打分并标注高风险问题
2. `code-simplifier` → 代码简化优化插件，精简冗余代码、优化逻辑、提升可读性，保持功能不变
3. `commit-commands` → Git提交辅助插件，自动生成规范的commit信息、批量执行提交/推送/回滚命令
4. `pr-review-toolkit` → 代码合并请求(PR)全套工具，比code-review更全面，含PR合规检查、冲突提醒、版本对比

### 多语言代码智能提示/语法校验（LSP 系列：编程语言服务，必备）
> 所有 `xxx-lsp` 均是对应编程语言的**官方语言服务插件**，核心能力：代码智能补全、实时语法检查、错误提示、代码跳转、格式化、函数说明悬停，精准适配对应语言开发
1. `clangd-lsp` → C/C++ 语言专用 LSP 插件
2. `csharp-lsp` → C# 语言专用 LSP 插件
3. `gopls-lsp` → Go 语言专用 LSP 插件
4. `jdtls-lsp` → Java 语言专用 LSP 插件
5. `kotlin-lsp` → Kotlin 语言专用 LSP 插件
6. `lua-lsp` → Lua 语言专用 LSP 插件
7. `php-lsp` → PHP 语言专用 LSP 插件
8. `pyright-lsp` → Python 语言专用 LSP 插件（最强Python语法校验+补全）
9. `rust-analyzer-lsp` → Rust 语言专用 LSP 插件
10. `swift-lsp` → Swift 语言专用 LSP 插件
11. `typescript-lsp` → TS/JS 语言专用 LSP 插件（前端核心）

### 功能开发/专项能力类
1. `feature-dev` → 功能开发辅助插件，根据需求描述，自动生成功能完整的代码块/业务逻辑
2. `frontend-design` → 前端开发专属插件，辅助编写页面布局、样式、交互逻辑，适配前端开发场景
3. `security-guidance` → 代码安全指导插件，扫描代码中的安全漏洞（SQL注入、越权、加密缺陷、敏感信息泄露等），给出修复方案
4. `ralph-loop` → 循环/迭代逻辑优化插件，专门检查并优化代码中的循环嵌套、死循环、低效遍历问题

### 输出风格定制类（控制Claude回答格式）
> 这类插件是**修改Claude的回复样式**，按需切换，非常实用
1. `explanatory-output-style` → 「解释型输出」，回答会附带详细原理、步骤说明、注释，适合看不懂代码/需要学习的场景
2. `learning-output-style` → 「学习型输出」，面向编程新手，回答更通俗易懂、拆分知识点、标注重点，适合入门学习

### 其他实用工具类
1. `security-guidance` → 代码安全合规检查，提示安全风险+修复建议
2. `ralph-loop` → 循环逻辑专项优化，解决循环冗余、性能低下问题

