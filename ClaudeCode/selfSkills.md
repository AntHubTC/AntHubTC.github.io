# 一些使用技巧

1. 把需求说具体点，把复杂的需求分步执行

2. 需求分析阶段请使用Plan Mode

3. 以最大执行权限启动

   Claude Code 默认使用严格的只读权限。<br>当需要额外操作时（编辑文件、运行测试、执行命令），Claude Code会请求明确权限。<br>这使得需要用户时常介入和确认。<br>若希望不考虑安全性让它全自动运行，例如让其在虚拟机、Docker 镜像等环境下工作，可以按如下方式激活 bypassPermissions 模式。

4. 输错指令，随时打断（ESC）

   IDE中可能需要修改快捷键

5. 恢复历史会话

   claude -c / claude -r

   /resume

6. 使用/zcf:init-project生成CLAUDE.md和subDir的CLAUDE.md

7. 及时提交Git代码

   避免claude抽风，造成不必要的损失

   !git commit / !git push

8. 及时压缩上下文

   /clear

   /compact

   /resume

9. 多模型切换

   用Haiku的场景

   • 搜索和信息汇总

   • 简单的格式转换

   • 数据整理和分类

   • 代码审查（只读分析）

   用Sonnet的场景

   • 内容创作（博客、文档）

   • 复杂的代码生成

   • 需要推理的分析任务

   • 对质量要求高的场景

10. 使用MCP提效

    必备：context7

    前端推荐：Playwright / chrome-devtools

11. 自定义commands

12. 回滚代码

    直接发送「回滚」即可

13. 研发模式

    spec-workflow

    BMAD

    spec-kit

    open-spec

14. 保持版本更新

    claude update