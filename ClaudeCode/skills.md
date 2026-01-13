# Skills

Skills (技能): 这是 自动SOP，Claude会根据场景自动触发的标准作业流程。

对应目录：~/.claude/skills/

Skills 的核心是一个 Markdown 文件。Skill = Skill + MCP + Command + SubAgent + script。



一个Skill文件夹通常包含这几部分：

1、 SKILL.md ：核心文件。用YAML写元数据（名字、描述），用Markdown写详细的指令，告诉Claude在什么情况下、以及如何使用这个Skill。

2、 scripts/ ：存放可执行的 Python、Shell脚本。

3、 references/ ：存放 参考文档（如API文档、数据库Schema、公司政策等），作为给Claude看的知识库。

4、 assets/ ：存放 资源文件（如PPT模板、Logo、项目脚架等），供Claude在执行任务时直接使用。



https://github.com/anthropics/skills

https://github.com/travisvn/awesome-claude-skills

https://github.com/ComposioHQ/awesome-claude-skills

https://www.skillsmp.com