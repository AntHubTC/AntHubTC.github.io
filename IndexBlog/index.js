let docs = [
    { title: '数据结构与算法', href: '../DataStructureAndAlgorithms' },
    { title: '设计模式', href: '../designPattern' },
    { title: 'javasE', href: '../javaSE' },
    { title: 'JUC', href: '../JUC' },
    { title: 'JVM', href: '../JVM' },
    { title: 'Java NIO', href: '../javaNIO' },
    { title: 'Spring', href: '../Spring' },
    { title: 'SpringBoot', href: '../springBoot' },
    { title: 'SpringSecurity', href: '../SpringSecurity' },
    { title: 'WebSocket', href: '../WebSocket' },
    { title: 'ElasticSearch', href: '../ElasticSearch' },
    { title: 'Mock服务', href: '../mockService' },
    { title: 'DevOps', href: '../DevOps' },
    { title: 'Docker', href: '../Docker' },
    { title: 'Jenkins', href: '../jenkins' },
    { title: 'MySQL', href: '../mysql' },
    { title: 'MyCat', href: '../mycat' },
    { title: 'Postman', href: '../postman' },
    { title: 'tomcat', href: '../tomcat' },
    { title: 'Zookeeper', href: '../Zookeeper' },
    { title: 'SecureCRT', href: '../SecureCRT' },
    { title: '前端知识学习', href: '../前端知识学习' },
    { title: 'Windows', href: '../windowsOS' },
    { title: 'git文档', href: '../gitDoc' },
    { title: 'IDEA', href: '../IDEA' },
    { title: 'markdown', href: '../markdown' },
    { title: '架构师之路', href: '../architectRoad' },
    { title: 'redisDoc', href: '../redis' },
    { title: 'HTTP', href: '../HTTP' },
    { title: '数据治理与数据仓库模型设计', href: '../数据治理与数据仓库模型设计' },
    { title: '简历Resume', href: '../resume/resume.html', private: true /* 后面可将一些文档隐藏起来 */},
    { title: '第三方文档收集', href: '../thirdDocument' },
    { title: '文档的组织方式', href: '../docBuildMethod', private: true /* 后面可将一些文档隐藏起来 */},
    { title: '找工作的一些经历', href: '../Interview', private: true /* 后面可将一些文档隐藏起来 */},
    { title: '人生规划', href: '../LifePlan', private: true /* 后面可将一些文档隐藏起来 */},
    { title: '中国礼仪', href: '../chinaCeremony' }
]

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

new Vue({
    el: '#app',
    data: {
        searchText: '',
        docs: []
    },
    computed: {
        qdocs () {
            let result = []
            if (this.searchText.trim().length) {
                for (var i = 0; i < this.docs.length; i++) {
                    var doc = this.docs[i]
                    if (searchFun(doc.title, this.searchText)) {
                        result.push(doc)
                    }
                }
            } else {
                result = this.docs
            }
            return result
        }
    },
    created () {
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
