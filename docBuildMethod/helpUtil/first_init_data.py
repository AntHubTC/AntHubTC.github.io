import sqlite3


def init_db():
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()
    # 创建一个表
    cursor.execute('''
                     CREATE TABLE IF NOT EXISTS documents
                    (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         title TEXT NOT NULL,
                         href TEXT NOT NULL,
                         is_private INTEGER DEFAULT 0,
                         category TEXT
                    )
    ''')

    cursor.execute('''
                     CREATE TABLE IF NOT EXISTS categorys
                    (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         name TEXT NOT NULL,
                         level INTEGER NOT NULL DEFAULT 1,
                         parent_id INTEGER
                    )
    ''')

    # 关闭cursor和连接
    cursor.close()
    conn.close()

def init_doc_data():
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()

    data = [
        {'title': 'ChatGPT', 'href': '../ChatGPT', 'category': '工作额外技能'},
        {'title': '数据结构与算法', 'href': '../DataStructureAndAlgorithms', 'category': '程序员底蕴'},
        {'title': '设计模式', 'href': '../designPattern', 'category': '程序员底蕴'},
        {'title': 'javasE', 'href': '../javaSE', 'category': 'JAVA'},
        {'title': 'JUC', 'href': '../JUC', 'category': 'JAVA'},
        {'title': 'JVM', 'href': '../JVM', 'category': 'JAVA,程序员底蕴'},
        {'title': 'Netty', 'href': '../Netty', 'category': '中间件,JAVA'},
        {'title': 'Spring', 'href': '../Spring', 'category': 'JAVA,Spring'},
        {'title': 'SpringBoot', 'href': '../springBoot', 'category': 'JAVA,Spring'},
        {'title': 'SpringSecurity', 'href': '../SpringSecurity', 'category': 'JAVA,Spring'},
        {'title': 'WebSocket', 'href': '../WebSocket', 'category': 'JAVA'},
        {'title': 'Apache Luncene', 'href': '../luncene', 'category': '中间件'},
        {'title': 'ElasticSearch', 'href': '../ElasticSearch', 'category': '中间件'},
        {'title': 'Electron', 'href': '../electron', 'category': 'NodeJs,JAVSCRIPT'},
        {'title': 'Mock服务', 'href': '../mockService', 'category': 'JAVA'},
        {'title': 'DevOps', 'href': '../DevOps', 'category': '快速交付'},
        {'title': 'Docker', 'href': '../Docker', 'category': '快速交付,开发测试工具'},
        {'title': 'nginx', 'href': '../nginx', 'category': '中间件'},
        {'title': 'Jenkins', 'href': '../jenkins', 'category': '快速交付,开发测试工具'},
        {'title': 'Jmeter', 'href': '../Jmeter', 'category': '中间件,开发测试工具'},
        {'title': 'MySQL', 'href': '../mysql', 'category': '数据库'},
        {'title': 'Mongo', 'href': '../mongo', 'category': '数据库'},
        {'title': 'Sharding Sphere', 'href': '../ShardingSphere', 'category': '数据库,中间件'},
        {'title': 'MyCat', 'href': '../mycat', 'category': '数据库,中间件'},
        {'title': 'mybatis', 'href': '../mybatis', 'category': 'JAVA,Spring'},
        {'title': 'mybatis-Plus', 'href': '../mybatisPlus', 'category': 'JAVA,Spring'},
        {'title': 'Swagger', 'href': '../Swagger', 'category': 'JAVA,Spring,开发测试工具'},
        {'title': 'Postman', 'href': '../postman', 'category': '快速交付,开发测试工具'},
        {'title': 'tomcat', 'href': '../tomcat', 'category': '中间件,开发测试工具'},
        {'title': 'Zookeeper', 'href': '../Zookeeper', 'category': '中间件'},
        {'title': '玩转nas', 'href': '../nas', 'category': 'NAS'},
        {'title': 'esp8266', 'href': '../esp8266', 'category': '物联网'},
        {'title': 'SecureCRT', 'href': '../SecureCRT', 'category': '开发测试工具,快速交付'},
        {'title': '前端知识学习', 'href': '../前端知识学习', 'category': 'JAVSCRIPT'},
        {'title': 'ArchLinux', 'href': '../ArchLinux', 'category': '操作系统,Linux'},
        {'title': 'Windows', 'href': '../windowsOS', 'category': '操作系统,开发测试工具'},
        {'title': 'git文档', 'href': '../gitDoc', 'category': '开发测试工具'},
        {'title': 'IDEA', 'href': '../IDEA', 'category': '开发测试工具'},
        {'title': 'markdown', 'href': '../markdown', 'category': '工作额外技能'},
        {'title': '架构师之路', 'href': '../architectRoad', 'category': '程序员底蕴'},
        {'title': '高并发技术', 'href': '../HighConcurrencyTech', 'category': '程序员底蕴'},
        {'title': '性能测试调优', 'href': '../性能测试调优', 'category': '程序员底蕴,工作额外技能,开发测试工具'},
        {'title': 'selenium', 'href': '../selenium', 'category': '工作额外技能,开发测试工具'},
        {'title': '按键精灵', 'href': '../按键精灵', 'category': '工作额外技能,开发测试工具,其他技能'},
        {'title': 'redis', 'href': '../redis', 'category': '中间件'},
        {'title': 'HTTP', 'href': '../HTTP', 'category': '程序员底蕴'},
        {'title': 'NodeJS', 'href': '../NodeJs', 'category': 'JAVSCRIPT,NodeJs'},
        {'title': 'windows批处理', 'href': '../windows-batch', 'category': '操作系统,工作额外技能,快速交付'},
        {'title': 'Python', 'href': '../python', 'category': 'Python'},
        {'title': 'Python官方文档', 'href': 'https://docs.python.org/zh-cn/3/', 'category': 'Python'},
        {'title': 'Python tkinter', 'href': 'https://zhuanlan.zhihu.com/p/569960987', 'category': 'Python'},
        {'title': 'mysql45讲', 'href': 'https://funnylog.gitee.io/mysql45/', 'category': '数据库'},
        {'title': 'Hutool', 'href': 'https://www.hutool.cn/', 'category': 'JAVA'},
        {'title': 'raspberryPI', 'href': '../raspberryPI', 'category': '物联网'},
        {'title': 'vi_vim', 'href': '../vi_vim', 'category': '快速交付,开发测试工具,Linux'},
        {'title': '论软件外包', 'href': '../outsource', 'category': '工作经验'},
        {'title': '傲游外网', 'href': '../傲游外网', 'category': '其他技能'},
        {'title': '健身-减肥', 'href': '../lifeReduceWeight', 'category': '健康生活'},
        {'title': '数据治理与数据仓库模型设计', 'href': '../数据治理与数据仓库模型设计', 'category': '其他技能'},
        {'title': '简历Resume', 'href': '../resume/resume.html', 'is_private': 1, 'category': '工作额外技能,工作经验'},
        {'title': '第三方文档收集', 'href': '../thirdDocument', 'category': '其他技能'},
        {'title': '文档的组织方式', 'href': '../docBuildMethod', 'is_private': 1, 'category': '其他技能'},
        {'title': '找工作的一些经历', 'href': '../Interview', 'is_private': 1, 'category': '工作经验'},
        {'title': '人生规划', 'href': '../LifePlan', 'is_private': 1, 'category': '工作经验,人生感悟'},
        {'title': '中国礼仪', 'href': '../chinaCeremony', 'category': '小孩教育'},
        {'title': 'IT那些趣事', 'href': '../IT那些有意思的事', 'category': '工作经验'},
        {'title': '酒店', 'href': '../hotel', 'category': '搞钱,创业'},
        {'title': '常见中药收集', 'href': '../ChineseMedicine', 'category': '健康生活'},
        {'title': '薅羊毛那些事', 'href': '../薅羊毛那些事', 'category': '搞钱,健康生活'}
    ]

    # 插入数据
    # c.executemany("INSERT INTO documents (title, href, is_private, category) VALUES (?, ?, ?, ?)", data)
    # 插入新数据
    cursor.executemany("INSERT INTO documents (title, href, category, is_private) VALUES (?, ?, ?, ?)",
                  [(d['title'], d['href'], d['category'], d.get('is_private', 0)) for d in data])
    conn.commit()

    # 关闭cursor和连接
    cursor.close()
    conn.close()

def init_doc_category():
    conn = sqlite3.connect("doc.db")
    # 创建一个游标对象
    cursor = conn.cursor()

    # 初始化数据
    docCategory = [
        {
            "title": "技术",
            "items": [
                {"title": "JAVA"},
                {"title": "Spring"},
                {"title": "程序员底蕴"},
                {"title": "数据库"},
                {"title": "中间件"},
                {"title": "工作额外技能"},
                {"title": "NodeJs"},
                {"title": "JAVSCRIPT"},
                {"title": "Python"},
                {"title": "快速交付"},
                {"title": "开发测试工具"},
                {"title": "物联网"},
                {"title": "操作系统"},
                {"title": "Linux"},
                {"title": "其他技能"}
            ]
        },
        {
            "title": "生活",
            "items": [
                {"title": "小孩教育"},
                {"title": "健康生活"},
                {"title": "娱乐趣事"},
                {"title": "NAS"},
                {"title": "搞钱"},
                {"title": "创业"}
            ]
        },
        {
            "title": "感悟",
            "items": [
                {"title": "工作经验"},
                {"title": "人生感悟"}
            ]
        }
    ]

    # 插入数据
    def insert_category(title, level, parent_id=None):
        cursor.execute("INSERT INTO categorys (name, level, parent_id) VALUES (?, ?, ?)", (title, level, parent_id))
        return cursor.lastrowid

    for idx, cat_group in enumerate(docCategory, start=1):
        group_id = insert_category(cat_group["title"], 1)

        for cat_item in cat_group["items"]:
            insert_category(cat_item["title"], 2, group_id)

    conn.commit()

    # 关闭cursor和连接
    cursor.close()
    conn.close()


if __name__ == '__main__':
    init_db()
    init_doc_data()
    init_doc_category()

    print("Data init finished")