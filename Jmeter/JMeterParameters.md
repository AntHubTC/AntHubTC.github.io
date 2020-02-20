# JMeter参数化

## JMeter表达式

​	Jmeter表达式格式为：

​		${变量/函数}

## 用户参数

![1582074989520](.\img\1582074989520.png)

添加一个参数：

![1582095672926](.\img\1582095672926.png)

这个参数就可以在请求中使用：

![1582095735716](.\img\1582095735716.png)

这时候我们再点击运行，在查询结果树的“Request”中就可以看见查询的时候是使用的在参数定义时候的参数。

## CSV数据配置

右击“Add” ---> "Config Element" ---> "CSV Data Set Config"。

![1582100123807](E:\2_STUDY\GitHubRepositories\00myGitHubRepository\FallenGodCoder.github.io\Jmeter\img\1582100123807.png)

user.csv内容

```
user1,pass1
user2,pass2
user3,pass3
```

​	上图中配置申明了两个变量，一个是user对应第一列，一个是password对应第二列。

​	在http请求的时候，如果线程循环一次就取第一行数据，如果循环多次，那么就对应到下行数据，如果线程数大于csv中提供的数据，那么变量就按照数据的顺序循环取数数据。



## 函数助手

“Tools” --> "函数助手对话框（Ctrl+shift+F1）"。

![1582102115541](.\img\1582102115541.png)

如上图所示，我们通过函数助手找到一个随机数函数，它的使用方法是${__Random(1,100,)}，这样我们就可以将这个串拷贝到要使用的地方。