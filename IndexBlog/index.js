
// 所有文档列表
let docs = [
{ 
            "id": 1,
            "title": "ChatGPT",
            "href": "../ChatGPT",
            "is_private": false, 
            "category": ["工作额外技能"]
         },{ 
            "id": 2,
            "title": "数据结构与算法",
            "href": "../DataStructureAndAlgorithms",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 3,
            "title": "设计模式",
            "href": "../designPattern",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 4,
            "title": "javasE",
            "href": "../javaSE",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 5,
            "title": "JUC",
            "href": "../JUC",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 6,
            "title": "JVM",
            "href": "../JVM",
            "is_private": false, 
            "category": ["JAVA", "程序员底蕴"]
         },{ 
            "id": 7,
            "title": "Netty",
            "href": "../Netty",
            "is_private": false, 
            "category": ["中间件", "JAVA"]
         },{ 
            "id": 8,
            "title": "Spring",
            "href": "../Spring",
            "is_private": false, 
            "category": ["JAVA", "Spring"]
         },{ 
            "id": 9,
            "title": "SpringBoot",
            "href": "../springBoot",
            "is_private": false, 
            "category": ["JAVA", "Spring"]
         },{ 
            "id": 10,
            "title": "SpringSecurity",
            "href": "../SpringSecurity",
            "is_private": false, 
            "category": ["JAVA", "Spring"]
         },{ 
            "id": 11,
            "title": "WebSocket",
            "href": "../WebSocket",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 12,
            "title": "Apache Luncene",
            "href": "../luncene",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 13,
            "title": "ElasticSearch",
            "href": "../ElasticSearch",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 14,
            "title": "Electron",
            "href": "../electron",
            "is_private": false, 
            "category": ["NodeJs", "JAVSCRIPT"]
         },{ 
            "id": 15,
            "title": "Mock服务",
            "href": "../mockService",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 16,
            "title": "DevOps",
            "href": "../DevOps",
            "is_private": false, 
            "category": ["快速交付"]
         },{ 
            "id": 17,
            "title": "Docker",
            "href": "../Docker",
            "is_private": false, 
            "category": ["快速交付", "开发测试工具"]
         },{ 
            "id": 18,
            "title": "nginx",
            "href": "../nginx",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 19,
            "title": "Jenkins",
            "href": "../jenkins",
            "is_private": false, 
            "category": ["快速交付", "开发测试工具"]
         },{ 
            "id": 20,
            "title": "Jmeter",
            "href": "../Jmeter",
            "is_private": false, 
            "category": ["中间件", "开发测试工具"]
         },{ 
            "id": 21,
            "title": "MySQL",
            "href": "../mysql",
            "is_private": false, 
            "category": ["数据库"]
         },{ 
            "id": 22,
            "title": "Mongo",
            "href": "../mongo",
            "is_private": false, 
            "category": ["数据库"]
         },{ 
            "id": 23,
            "title": "Sharding Sphere",
            "href": "../ShardingSphere",
            "is_private": false, 
            "category": ["数据库", "中间件"]
         },{ 
            "id": 24,
            "title": "MyCat",
            "href": "../mycat",
            "is_private": false, 
            "category": ["数据库", "中间件"]
         },{ 
            "id": 25,
            "title": "mybatis",
            "href": "../mybatis",
            "is_private": false, 
            "category": ["JAVA", "Spring"]
         },{ 
            "id": 26,
            "title": "mybatis-Plus",
            "href": "../mybatisPlus",
            "is_private": false, 
            "category": ["JAVA", "Spring"]
         },{ 
            "id": 27,
            "title": "Swagger",
            "href": "../Swagger",
            "is_private": false, 
            "category": ["JAVA", "Spring", "开发测试工具"]
         },{ 
            "id": 28,
            "title": "Postman",
            "href": "../postman",
            "is_private": false, 
            "category": ["快速交付", "开发测试工具"]
         },{ 
            "id": 29,
            "title": "tomcat",
            "href": "../tomcat",
            "is_private": false, 
            "category": ["中间件", "开发测试工具"]
         },{ 
            "id": 30,
            "title": "Zookeeper",
            "href": "../Zookeeper",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 31,
            "title": "玩转nas",
            "href": "../nas",
            "is_private": false, 
            "category": ["NAS"]
         },{ 
            "id": 32,
            "title": "esp8266",
            "href": "../esp8266",
            "is_private": false, 
            "category": ["物联网"]
         },{ 
            "id": 33,
            "title": "SecureCRT",
            "href": "../SecureCRT",
            "is_private": false, 
            "category": ["开发测试工具", "快速交付"]
         },{ 
            "id": 34,
            "title": "前端知识学习",
            "href": "../前端知识学习",
            "is_private": false, 
            "category": ["JAVSCRIPT"]
         },{ 
            "id": 35,
            "title": "ArchLinux",
            "href": "../ArchLinux",
            "is_private": false, 
            "category": ["操作系统", "Linux"]
         },{ 
            "id": 36,
            "title": "Windows",
            "href": "../windowsOS",
            "is_private": false, 
            "category": ["操作系统", "开发测试工具"]
         },{ 
            "id": 37,
            "title": "git文档",
            "href": "../gitDoc",
            "is_private": false, 
            "category": ["开发测试工具"]
         },{ 
            "id": 38,
            "title": "IDEA",
            "href": "../IDEA",
            "is_private": false, 
            "category": ["开发测试工具"]
         },{ 
            "id": 39,
            "title": "markdown",
            "href": "../markdown",
            "is_private": false, 
            "category": ["工作额外技能"]
         },{ 
            "id": 40,
            "title": "架构师之路",
            "href": "../architectRoad",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 41,
            "title": "高并发技术",
            "href": "../HighConcurrencyTech",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 42,
            "title": "性能测试调优",
            "href": "../性能测试调优",
            "is_private": false, 
            "category": ["程序员底蕴", "工作额外技能", "开发测试工具"]
         },{ 
            "id": 43,
            "title": "selenium",
            "href": "../selenium",
            "is_private": false, 
            "category": ["工作额外技能", "开发测试工具"]
         },{ 
            "id": 44,
            "title": "按键精灵",
            "href": "../按键精灵",
            "is_private": false, 
            "category": ["工作额外技能", "开发测试工具", "其他技能"]
         },{ 
            "id": 45,
            "title": "redis",
            "href": "../redis",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 46,
            "title": "HTTP",
            "href": "../HTTP",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 47,
            "title": "NodeJS",
            "href": "../NodeJs",
            "is_private": false, 
            "category": ["JAVSCRIPT", "NodeJs"]
         },{ 
            "id": 48,
            "title": "windows批处理",
            "href": "../windows-batch",
            "is_private": false, 
            "category": ["操作系统", "工作额外技能", "快速交付"]
         },{ 
            "id": 49,
            "title": "Python",
            "href": "../python",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 50,
            "title": "Python官方文档",
            "href": "https://docs.python.org/zh-cn/3/",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 51,
            "title": "Python tkinter",
            "href": "https://zhuanlan.zhihu.com/p/569960987",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 52,
            "title": "mysql45讲",
            "href": "https://funnylog.gitee.io/mysql45/",
            "is_private": false, 
            "category": ["数据库"]
         },{ 
            "id": 53,
            "title": "Hutool",
            "href": "https://www.hutool.cn/",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 54,
            "title": "raspberryPI",
            "href": "../raspberryPI",
            "is_private": false, 
            "category": ["物联网"]
         },{ 
            "id": 55,
            "title": "vi_vim",
            "href": "../vi_vim",
            "is_private": false, 
            "category": ["快速交付", "开发测试工具", "Linux"]
         },{ 
            "id": 56,
            "title": "论软件外包",
            "href": "../outsource",
            "is_private": false, 
            "category": ["工作经验"]
         },{ 
            "id": 57,
            "title": "傲游外网",
            "href": "../傲游外网",
            "is_private": false, 
            "category": ["其他技能"]
         },{ 
            "id": 58,
            "title": "健身-减肥",
            "href": "../lifeReduceWeight",
            "is_private": false, 
            "category": ["健康生活"]
         },{ 
            "id": 59,
            "title": "数据治理与数据仓库模型设计",
            "href": "../数据治理与数据仓库模型设计",
            "is_private": false, 
            "category": ["其他技能"]
         },{ 
            "id": 60,
            "title": "简历Resume",
            "href": "../resume/resume.html",
            "is_private": true, 
            "category": ["工作额外技能", "工作经验"]
         },{ 
            "id": 61,
            "title": "第三方文档收集",
            "href": "../thirdDocument",
            "is_private": false, 
            "category": ["其他技能"]
         },{ 
            "id": 62,
            "title": "文档的组织方式",
            "href": "../docBuildMethod",
            "is_private": true, 
            "category": ["其他技能"]
         },{ 
            "id": 63,
            "title": "找工作的一些经历",
            "href": "../Interview",
            "is_private": true, 
            "category": ["工作经验"]
         },{ 
            "id": 64,
            "title": "人生规划",
            "href": "../LifePlan",
            "is_private": true, 
            "category": ["工作经验", "人生感悟"]
         },{ 
            "id": 65,
            "title": "中国礼仪",
            "href": "../chinaCeremony",
            "is_private": false, 
            "category": ["小孩教育"]
         },{ 
            "id": 66,
            "title": "IT那些趣事",
            "href": "../IT那些有意思的事",
            "is_private": false, 
            "category": ["工作经验"]
         },{ 
            "id": 67,
            "title": "酒店",
            "href": "../hotel",
            "is_private": false, 
            "category": ["搞钱", "创业"]
         },{ 
            "id": 68,
            "title": "常见中药收集",
            "href": "../ChineseMedicine",
            "is_private": false, 
            "category": ["健康生活"]
         },{ 
            "id": 69,
            "title": "薅羊毛那些事",
            "href": "../薅羊毛那些事",
            "is_private": false, 
            "category": ["搞钱", "健康生活"]
         },{ 
            "id": 70,
            "title": "JavaGuide",
            "href": "https://javaguide.cn/",
            "is_private": false, 
            "category": ["JAVA"]
         },{ 
            "id": 75,
            "title": "flowable6",
            "href": "../flowable6",
            "is_private": false, 
            "category": ["中间件"]
         },{ 
            "id": 76,
            "title": "算法刷题",
            "href": "../algQuestion",
            "is_private": false, 
            "category": ["程序员底蕴"]
         },{ 
            "id": 77,
            "title": "autolt3",
            "href": "../autolt3",
            "is_private": false, 
            "category": ["工作额外技能"]
         },{ 
            "id": 78,
            "title": "python-docx",
            "href": "../python_docx",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 79,
            "title": "Sikuli",
            "href": "../Sikuli",
            "is_private": false, 
            "category": ["开发测试工具", "工作额外技能"]
         },{ 
            "id": 80,
            "title": "web3",
            "href": "../web3",
            "is_private": false, 
            "category": ["Web3"]
         },{ 
            "id": 81,
            "title": "jupyter",
            "href": "../jupyter",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 82,
            "title": "NumPy",
            "href": "../NumPy",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 83,
            "title": "pandas",
            "href": "../pandas",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 84,
            "title": "mitmproxy",
            "href": "../mitmproxy",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 85,
            "title": "DrissionPage",
            "href": "../DrissionPage",
            "is_private": false, 
            "category": ["Python"]
         },{ 
            "id": 86,
            "title": "摆地摊",
            "href": "../streetVendor",
            "is_private": false, 
            "category": ["搞钱", "创业"]
         },{ 
            "id": 87,
            "title": "DeepSeek",
            "href": "../DeepSeek",
            "is_private": false, 
            "category": ["AI"]
         },{ 
            "id": 88,
            "title": "今日头条创作",
            "href": "../newsToday",
            "is_private": false, 
            "category": ["搞钱", "创业"]
         },{ 
            "id": 89,
            "title": "AI使用技巧",
            "href": "../AISkill",
            "is_private": false, 
            "category": ["AI"]
         },{ 
            "id": 90,
            "title": "Stable_Diffusion",
            "href": "../Stable_Diffusion",
            "is_private": false, 
            "category": ["AI"]
         },{ 
            "id": 91,
            "title": "如何读书",
            "href": "../HowRead",
            "is_private": false, 
            "category": ["读书"]
         },{ 
            "id": 92,
            "title": "财富的真相",
            "href": "../TruthOfWealthBook",
            "is_private": false, 
            "category": ["读书"]
         },{ 
            "id": 93,
            "title": "张一鸣的231条微博",
            "href": "../231Blog",
            "is_private": false, 
            "category": ["创业"]
         },{ 
            "id": 94,
            "title": "dockWinBox",
            "href": "../dockWinBox",
            "is_private": false, 
            "category": ["创业"]
         }
];
// 所有文档分类
let docCategory = [
    {
        "id": 1,
        "title": "技术",
        "level": 1,
        "parent_id": null,
        "items": [
            {
                "id": 2,
                "title": "JAVA",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 3,
                "title": "Spring",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 4,
                "title": "程序员底蕴",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 5,
                "title": "数据库",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 6,
                "title": "中间件",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 7,
                "title": "工作额外技能",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 8,
                "title": "NodeJs",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 9,
                "title": "JAVSCRIPT",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 10,
                "title": "Python",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 11,
                "title": "快速交付",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 12,
                "title": "开发测试工具",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 13,
                "title": "物联网",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 14,
                "title": "操作系统",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 15,
                "title": "Linux",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 16,
                "title": "其他技能",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 27,
                "title": "Web3",
                "level": 2,
                "parent_id": 1,
                "items": []
            },
            {
                "id": 28,
                "title": "AI",
                "level": 2,
                "parent_id": 1,
                "items": []
            }
        ]
    },
    {
        "id": 17,
        "title": "生活",
        "level": 1,
        "parent_id": null,
        "items": [
            {
                "id": 18,
                "title": "小孩教育",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 19,
                "title": "健康生活",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 20,
                "title": "娱乐趣事",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 21,
                "title": "NAS",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 22,
                "title": "搞钱",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 23,
                "title": "创业",
                "level": 2,
                "parent_id": 17,
                "items": []
            },
            {
                "id": 29,
                "title": "读书",
                "level": 2,
                "parent_id": 17,
                "items": []
            }
        ]
    },
    {
        "id": 24,
        "title": "感悟",
        "level": 1,
        "parent_id": null,
        "items": [
            {
                "id": 25,
                "title": "工作经验",
                "level": 2,
                "parent_id": 24,
                "items": []
            },
            {
                "id": 26,
                "title": "人生感悟",
                "level": 2,
                "parent_id": 24,
                "items": []
            }
        ]
    }
]; 

// 特殊定位符，前面是数据，后面是代码，python按最新数据重新拼接
// >>>>>>>>>!@#$%^&*!<<<<<<<<<
                                                                                                                        
                                                                                                    
// 防止抖动函数
function debounce(func, delay) {
    let timerId;
    return function(...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 判断当前环境是否是移动端
function isMobileEnvironment() {
    // 检测用户代理字符串中是否包含移动设备的关键词
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // 检测屏幕宽度是否小于等于 768px
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    // 检测触摸支持
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

    // 综合考虑多种因素
    if (isMobileDevice || (isSmallScreen && isTouchDevice)) {
        return true; // 当前环境是移动端
    } else {
        return false; // 当前环境不是移动端
    }
}

// 自定义模糊查询方法
var searchFun = function (a, b) {
    let compareA = a.toLowerCase()
    let compareB = b.toLowerCase()

    let posB = 0
    for (let i = 0; i < compareA.length; i++) {
        if (compareA[i] === compareB[posB]) {
            posB++
        }
        if (posB === compareB.length) {
            break
        }
    }
    return posB === compareB.length
}

// 获取地址栏查询map
var getLocationSearchMap = function () {
    var locationSearch = window.location.search
    var locationMap = {}
    if (locationSearch) {
        locationSearch = locationSearch.substring(1)
        locationSearch = locationSearch.split(/&/g)
        for (var i = 0; i < locationSearch.length; i++) {
            var paramStr = locationSearch[i]
            var paramArr = paramStr.split('=')
            locationMap[paramArr[0]] = paramArr[1]
        }
    }
    return locationMap
}

// 页面准备
function pageReady(callBack) {
	let isLoaded = false
	let loadedFun = function () {
		if (!isLoaded) {
			isLoaded = true;
			callBack();
		}
	}
	window.onload = loadedFun;
	if ('addEventListener' in document){
		document.addEventListener('DOMContentLoaded', loadedFun, false)//false代表在冒泡阶段触发，true在捕获阶段触发
	}
	document.onreadystatechange = function(){
		if(document.readyState === 'complete'){
			loadedFun();
		}
	}
}

const isMobileEnv = isMobileEnvironment();
pageReady(() => {
	new Vue({
		el: '#app',
		data: {
            // 搜索的内容
			searchText: '',
            // 所有的文档
			docs: [],
            // 所有的文档类别
            docCategory,
            // 当前文档类别，默认显示所有all
            curCategory: 'all',
            // cell-格子 wordcloud-词云
            display: 'wordcloud',
            // 词云布局
            wordcloudTheme: 'theme1',
            // 是否显示设置对话框
            settingShow: false,
            // 是否显示侧边栏
            showSide: !isMobileEnv,
            // 背景颜色
            backgroundColor: '#FFF'
		},
		computed: {
			qdocs () {
                const isFilterSearchText = !!this.searchText.trim().length;
                const isFilterCategory = this.curCategory !== 'all';
                if (!isFilterSearchText && !isFilterCategory) {
                    // 未搜索，也没有过滤类别
                    return this.docs;
                }
                let result = []
				for (var i = 0; i < this.docs.length; i++) {
                    const doc = this.docs[i];
                    // 是否满足类别
                    if (isFilterCategory && (doc.category || []).indexOf(this.curCategory) === -1) {
                        continue
                    }
                    // 是否满足搜索
                    if (isFilterSearchText) {
                        if (searchFun(doc.title, this.searchText)) {
                            result.push(doc);
                        }
                    } else {
                        // 没有进行搜索，满足了类别的情况
                        result.push(doc);
                    }
                }
				return result
			}
		},
        watch: {
            qdocs(newMessage, oldMessage) {
                this.reDraw();
            },
            display() {
                this.reDraw();
                this.saveConfig();
            },
            wordcloudTheme() {
                this.reDraw();
                this.saveConfig();
            }
        },
        methods: {
            toogleSideBar () {
                this.showSide = !this.showSide;
                if (isMobileEnv) {
                    // 移动端才重绘，电脑端重绘给人的效果不好
                    this.reDraw();
                }
            },
            cateItemClick (cateItem) {
                this.curCategory = cateItem.title;
            },
            reDraw () {
                // 搜索发生导致词云重画
                if(this.display == 'wordcloud') {
                    this.debounceDrawWordCloud();
                }
            },
            // 画词云
            drawWordCloud () {
                if(this.display !== 'wordcloud') {
                    return
                }
                // 选择要放置词云的容器
                const $el = this.$refs.wordcloud;

                // 设置词语和频率
                // var words = [
                //     {text: 'Hello', size: 30},
                //     {text: 'World', size: 25},
                //     // 其他词语和频率
                // ];
                const words = [];
                for (var i = 0; i < this.qdocs.length; i++) {
                    words.push({
                        word: this.qdocs[i].title,
                        weight: 40,
                        extData: this.qdocs[i]
                    });
                }

                let wordCloudSettings = {
                    list: words ,
                    classes: "word-color",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    fontWeight: 'normal', // bold normal
                    shape: 'square', // circle cardioid diamond square triangle-forward triangle triangle-upright pentagon star
                    maskGapWidth: 0.5,
                    minRotation: -Math.PI / 2,
                    maxRotation: Math.PI / 2,
                    gridSize: 14,
                    // minRotation: 0,
                    // maxRotation: 0,
                    rotationSteps: 0,
                    click: function (item) {
                        window.open(item.extData.href, '_blank');
                    }
                }
                if (this.wordcloudTheme == 'theme1') {
                    wordCloudSettings.shape = 'square'
                    wordCloudSettings.maskGapWidth = 0.5
                    wordCloudSettings.minRotation = -Math.PI / 2
                    wordCloudSettings.maxRotation = Math.PI / 2
                    wordCloudSettings.rotationSteps = 0
                } else if (this.wordcloudTheme == 'theme2') {
                    wordCloudSettings.shape = 'cardioid'
                    wordCloudSettings.maskGapWidth = 0.5
                    wordCloudSettings.minRotation = -Math.PI / 2
                    wordCloudSettings.maxRotation = Math.PI / 2
                    wordCloudSettings.rotationSteps = 0
                } else if (this.wordcloudTheme == 'theme3') {
                    wordCloudSettings.shape = 'square'
                    wordCloudSettings.maskGapWidth = 0.3
                    wordCloudSettings.minRotation = 0
                    wordCloudSettings.maxRotation = Math.PI / 2
                    wordCloudSettings.rotationSteps = 2
                }

                // 移动端环境定制参数
                if (isMobileEnv) {
                    wordCloudSettings.gridSize = 6
                    wordCloudSettings.maskGapWidth = 0.1
                    // 字体大小因子
                    wordCloudSettings.weightFactor = 0.6
                }

                // 创建词云
                WordCloud($el, wordCloudSettings);

                // 监听执行结束事件 (添加动画)
                // $el.addEventListener("wordcloudstop", function () {
                //     // 等待 2s 后在将动画类添加，不然正常显示的效果时间太短。
                //     setTimeout(() => {
                //         let els = this.querySelectorAll(".word-color")
                //         Array.from(els).forEach((el) => {
                //             el.classList.add("word-animate")
                //         })
                //     }, 1000)
                // })
            },
            openSettingsPanel () {
                this.settingShow = !this.settingShow;
            },
            closeSettingsPanel () {
                this.settingShow = false;
            },
            loadConfig () {
                if (localStorage) {
                    this.display = localStorage.getItem("anthubtc.doc.display") || this.display;
                    this.wordcloudTheme = localStorage.getItem("anthubtc.doc.theme") || this.wordcloudTheme;
                }
            },
            saveConfig () {
                if (localStorage) {
                    localStorage.setItem("anthubtc.doc.display", this.display)
                    localStorage.setItem("anthubtc.doc.theme", this.wordcloudTheme)
                }
            }
        },
        mounted () {
            // 由qdocs变化触发调用，不用手动调用
            // this.drawWordCloud();
        },
		created () {
            this.loadConfig();
            // 防抖动
            this.debounceDrawWordCloud = debounce(() => {
                this.drawWordCloud();
            }, 100);

			var locationSearchMap = getLocationSearchMap()
			var isPrivate = (locationSearchMap['p'] === '1')

			for (var i = 0; i < docs.length; i++) {
				if (isPrivate) {
					if (docs[i].private) {
						this.docs.push(docs[i])
					}
				} else {
					if (!docs[i].private) {
						this.docs.push(docs[i])
					}
				}
			}
		}
	})
});
