# 接口测试



## 接口性能测试

被面试官经常问到之前开发的系统接口 QPS 能达到多少，经常给不出一个数值，支支吾吾，导致整体面试效果降低？



### wrk

> PS: 关于线程数，并不是设置的越大，压测效果越好，线程设置过大，反而会导致线程切换过于频繁，效果降低，一般来说，推荐设置成压测机器 CPU 核心数的 2 倍到 4 倍就行了。

[ChatGPT 帮我写wrk脚本](https://anthubtc.github.io/ChatGPT/#/doc2?id=%e4%b8%8d%e4%bc%9a%e5%86%99%e5%8e%8b%e6%b5%8b%e8%84%9a%e6%9c%ac%ef%bc%9fchatgpt)

[性能测试工具 wrk 使用教程](https://www.cnblogs.com/quanxiaoha/p/10661650.html)

