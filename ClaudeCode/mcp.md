# MCP

(Model Context Protocol): 这是 外部连接器，让Claude能访问网络、文件、数据库等。



MCP参考：

https://github.com/modelcontextprotocol/servers

https://github.com/punkpeye/awesome-mcp-servers

https://glama.ai/mcp/servers



## Context7

官方介绍称，Context7 能将最新的、特定版本的文档和代码片段等信息，直接整合到你给大模型的提示（prompt）中。如此一来，大模型便能根据这些实时更新的资料编写代码，避免被其固有的、可能过时的知识库所误导。

简单来说，Context7 就像给大模型配备了一个实时搜索引擎。在回应请求前，大模型会先用 Context7 搜集最新相关信息作为上下文进行学习，再根据这些新信息生成答案。

简而言之：获取正确有效的编程语言或依赖工具库的文档，减少 AI 写代码的幻觉。

```bash
claude mcp add context7 -s user -- npx @upstash/context7-mcp
```



## Playwright

运行浏览器自动化任务，让AI大模型能够通过结构化数据与网页进行交互，实现自动化操作，无需依赖视觉模型或截图识别。

```bash
claude mcp add playwright -s user -- npx @playwright/mcp@latest;
```



## JIRA

```bash
claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/sse
```



## open-websearch

在 AI 大模型不断发展的今天，实时联网搜索变得至关重要。为了让 AI 获取**最新、真实、可控**的网页信息

