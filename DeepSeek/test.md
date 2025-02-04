# test





```js
window.$docsify = {
	        // 文档标题，会显示在侧边栏顶部。
	        name: 'docsify',
	        // 点击文档标题后跳转的链接地址。
	        nameLink: '/',
	        // 在侧边栏中出现的网站图标，你可以使用CSS来更改大小
	        logo: '/_media/icon.svg',
	        // 配置仓库地址或者 username/repo 的字符串，会在页面右上角渲染一个 GitHub Corner 挂件。
	        repo: 'https://github.com/FallenGodCoder/FallenGodCoder.github.io',
	        // 自定义侧边栏
	        loadSidebar: true,
	        // 自定义侧边栏同时也可以开启目录功能
	        subMaxLevel: 2,
	        // 自定义导航栏 
	        loadNavbar: true,
	        // 自定义封面
	        coverpage: true,
		    // 用于配置多个封面
		    // ,coverpage: ['/', '/zh-cn/']
		    // 切换页面后是否自动跳转到页面顶部
		    auto2top: true,
		    // 全文搜素配置
		    search: {
		      maxAge: 86400000, // 过期时间，单位毫秒，默认一天
		      paths: 'auto', // or []
		      placeholder: 'Type to search',
		      // 支持本地化
		      // placeholder: {
		      //   '/zh-cn/': '搜索',
		      //   '/': 'Type to search'
		      // },
		      noData: 'No Result!',
		      // 支持本地化
		      // noData: {
		      //   '/zh-cn/': '找不到结果',
		      //   '/': 'No Results'
		      // },
		      // 搜索标题的最大程级, 1 - 6
		      depth: 2
		    }
	    }
```

