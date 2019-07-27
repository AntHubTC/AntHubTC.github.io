# 我的IDEA使用规范

​	无规矩不成方圆，有效可用的规范可以理清我们的思路，提高生产效率。

## 模板文件和模板代码规范

​	功能路径：File | Settings | Editor | File and Code Templates

**新建模板规范：**

​	如果是所有项目通用的，将模板定义在Default命名空间中，否则定义在Project中。

**includes规范：**

​	命名规则："技术名+代码片段简述"，例如：“java-header”，“vue-header“等。

**文件代码模板规范：**

​	Default中：命名规则：”my+技术名+模板描述“，例如："mySpringController", "mySpringService"等。

​	Project中：命名规则：”项目简称+技术名+模板描述“，例如: "dwdSpringController", "dwdVueGridPage", "OASpringDao", "OAJunitTest", "DGMockTest"等。