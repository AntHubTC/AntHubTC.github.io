// 所有文档列表
let docs = [
    { title: 'ChatGPT', href: '../ChatGPT', category: ['工作额外技能']},
    { title: '数据结构与算法', href: '../DataStructureAndAlgorithms', category: ['程序员底蕴']},
    { title: '设计模式', href: '../designPattern', category: ['程序员底蕴']},
    { title: 'javasE', href: '../javaSE', category: ['JAVA']},
    { title: 'JUC', href: '../JUC', category: ['JAVA']},
    { title: 'JVM', href: '../JVM', category: ['JAVA', '程序员底蕴']},
    { title: 'Netty', href: '../Netty', category: ['中间件', 'JAVA']},
    { title: 'Spring', href: '../Spring', category: ['JAVA', 'Spring']},
    { title: 'SpringBoot', href: '../springBoot', category: ['JAVA', 'Spring']},
    { title: 'SpringSecurity', href: '../SpringSecurity', category: ['JAVA', 'Spring']},
    { title: 'WebSocket', href: '../WebSocket', category: ['JAVA']},
    { title: 'Apache Luncene', href: '../luncene', category: ['中间件']},
    { title: 'ElasticSearch', href: '../ElasticSearch', category: ['中间件']},
    { title: 'Electron', href: '../electron', category: ['NodeJs', 'JAVSCRIPT']},
    { title: 'Mock服务', href: '../mockService', category: ['JAVA']},
    { title: 'DevOps', href: '../DevOps', category: ['快速交付']},
    { title: 'Docker', href: '../Docker', category: ['快速交付', '开发测试工具']},
    { title: 'nginx', href: '../nginx', category: ['中间件']},
    { title: 'Jenkins', href: '../jenkins', category: ['快速交付', '开发测试工具']},
    { title: 'Jmeter', href: '../Jmeter', category: ['中间件', '开发测试工具']},
    { title: 'MySQL', href: '../mysql', category: ['数据库']},
    { title: 'Mongo', href: '../mongo', category: ['数据库']},
    { title: 'Sharding Sphere', href: '../ShardingSphere', category: ['数据库', '中间件']},
    { title: 'MyCat', href: '../mycat', category: ['数据库', '中间件']},
    { title: 'mybatis', href: '../mybatis', category: ['JAVA', 'Spring']},
    { title: 'mybatis-Plus', href: '../mybatisPlus', category: ['JAVA', 'Spring']},
    { title: 'Swagger', href: '../Swagger', category: ['JAVA', 'Spring', '开发测试工具']},
    { title: 'Postman', href: '../postman', category: ['快速交付', '开发测试工具']},
    { title: 'tomcat', href: '../tomcat', category: ['中间件', '开发测试工具']},
    { title: 'Zookeeper', href: '../Zookeeper', category: ['中间件']},
    { title: '玩转nas', href: '../nas', category: ['NAS']},
    { title: 'esp8266', href: '../esp8266', category: ['物联网']},
    { title: 'SecureCRT', href: '../SecureCRT', category: ['开发测试工具', '快速交付']},
    { title: '前端知识学习', href: '../前端知识学习', category: ['JAVSCRIPT']},
    { title: 'ArchLinux', href: '../ArchLinux', category: ['操作系统', 'Linux']},
    { title: 'Windows', href: '../windowsOS', category: ['操作系统', '开发测试工具']},
    { title: 'git文档', href: '../gitDoc', category: ['开发测试工具']},
    { title: 'IDEA', href: '../IDEA', category: ['开发测试工具']},
    { title: 'markdown', href: '../markdown', category: ['工作额外技能']},
    { title: '架构师之路', href: '../architectRoad', category: ['程序员底蕴']},
    { title: 'redis', href: '../redis', category: ['中间件']},
    { title: 'HTTP', href: '../HTTP', category: ['程序员底蕴']},
    { title: 'NodeJS', href: '../NodeJs', category: ['JAVSCRIPT', 'NodeJs']},
    { title: 'windows批处理', href: '../windows-batch', category: ['操作系统', '工作额外技能', '快速交付']},
    { title: 'Python', href: '../python', category: ['Python']},
    { title: 'Python官方文档', href: 'https://docs.python.org/zh-cn/3/', category: ['Python']},
    { title: 'Python tkinter', href: 'https://zhuanlan.zhihu.com/p/569960987', category: ['Python']},
    { title: 'mysql45讲', href: 'https://funnylog.gitee.io/mysql45/', category: ['数据库']},
    { title: 'Hutool', href: 'https://www.hutool.cn/', category: ['JAVA']},
    // { title: 'raspberryPI', href: '../raspberryPI', category: ['物联网']},
    // { title: 'vi_vim', href: '../vi_vim', category: ['快速交付', '开发测试工具', 'Linux']},
    { title: '论软件外包', href: '../outsource', category: ['工作经验']},
    { title: '健身-减肥', href: '../lifeReduceWeight', category: ['健康生活']},
    { title: '数据治理与数据仓库模型设计', href: '../数据治理与数据仓库模型设计', category: ['其他技能']},
    { title: '简历Resume', href: '../resume/resume.html', private: true /* 后面可将一些文档隐藏起来 */, category: ['工作额外技能', '工作经验']},
    { title: '第三方文档收集', href: '../thirdDocument', category: ['其他技能']},
    { title: '文档的组织方式', href: '../docBuildMethod', private: true /* 后面可将一些文档隐藏起来 */, category: ['其他技能']},
    { title: '找工作的一些经历', href: '../Interview', private: true /* 后面可将一些文档隐藏起来 */, category: ['工作经验']},
    { title: '人生规划', href: '../LifePlan', private: true /* 后面可将一些文档隐藏起来 */, category: ['工作经验', '人生感悟']},
    { title: '中国礼仪', href: '../chinaCeremony', category: ['小孩教育']},
    { title: 'IT那些趣事', href: '../IT那些有意思的事', category: ['工作经验'] }
]
// 所有文档分类
let docCategory = [
{
    title: "技术",
    items: [
        {title: "JAVA"},
        {title: "Spring"},
        {title: "程序员底蕴"},
        {title: "数据库"},
        {title: "中间件"},
        {title: "工作额外技能"},
        {title: "NodeJs"},
        {title: "JAVSCRIPT"},
        {title: "Python"},
        {title: "快速交付"},
        {title: "开发测试工具"},
        {title: "物联网"},
        {title: "操作系统"},
        {title: "Linux"},
        {title: "其他技能"}
    ]
},
{
    title: "生活",
    items: [
        {title: "小孩教育"},
        {title: "健康生活"},
        {title: "娱乐趣事"},
        {title: "NAS"}
    ]
},
{
    title: "感悟",
    items: [
        {title: "工作经验"},
        {title: "人生感悟"}
    ]
}
]

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
                this.reDraw();
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