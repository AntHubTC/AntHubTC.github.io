# MCP

(Model Context Protocol): 这是 外部连接器，让Claude能访问网络、文件、数据库等。



MCP参考：

https://github.com/modelcontextprotocol/servers

https://github.com/punkpeye/awesome-mcp-servers

https://glama.ai/mcp/servers



## Context7

获取正确有效的编程语言、依赖工具库的文档，减少 AI 写代码的幻觉。

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


