# flowable核心类总结

核心类：

- RepositoryService 
- RuntimeService
- HistoryService
- TaskService
- ManagementService
- IdentityService



## RepositoryService 持久化部署

```
1.提供了带条件的查询模型流程定义的api
repositoryService.createXXXQuery()
例如：
repositoryService.createModelQuery().list() 模型查询 
repositoryService.createProcessDefinitionQuery().list() 流程定义查询

repositoryService.createXXXXQuery().XXXKey(XXX) （查询该key是否存在）

2.提供一大波模型与流程定义的通用方法
模型相关
repositoryService.getModel()  （获取模型）
repositoryService.saveModel()  （保存模型）
repositoryService.deleteModel() （删除模型）
repositoryService.createDeployment().deploy(); （部署模型）
repositoryService.getModelEditorSource()  （获得模型JSON数据的UTF8字符串）
repositoryService.getModelEditorSourceExtra()  （获取PNG格式图像）

3.流程定义相关
repositoryService.getProcessDefinition(ProcessDefinitionId);  获取流程定义具体信息
repositoryService.activateProcessDefinitionById() 激活流程定义
repositoryService.suspendProcessDefinitionById()  挂起流程定义
repositoryService.deleteDeployment()  删除流程定义
repositoryService.getProcessDiagram()获取流程定义图片流
repositoryService.getResourceAsStream()获取流程定义xml流
repositoryService.getBpmnModel(pde.getId()) 获取bpmn对象（当前进行到的那个节点的流程图使用）

4.流程定义授权相关
repositoryService.getIdentityLinksForProcessDefinition() 流程定义授权列表
repositoryService.addCandidateStarterGroup()新增组流程授权
repositoryService.addCandidateStarterUser()新增用户流程授权
repositoryService.deleteCandidateStarterGroup() 删除组流程授权
repositoryService.deleteCandidateStarterUser()  删除用户流程授权
```



## RuntimeService 流程运行

```
runtimeService.createProcessInstanceBuilder().start() 发起流程
runtimeService.deleteProcessInstance() 删除正在运行的流程
runtimeService.suspendProcessInstanceById() 挂起流程定义
runtimeService.activateProcessInstanceById() 激活流程实例
runtimeService.getVariables(processInstanceId); 获取表单中填写的值
runtimeService.getActiveActivityIds(processInstanceId)获取以进行的流程图节点 （当前进行到的那个节点的流程图使用）

runtimeService.createChangeActivityStateBuilder().moveExecutionsToSingleActivityId(executionIds, endId).changeState(); 终止流程
```



## HistoryService 流程历史服务

注意：包含已完成和未完成的流程实例

```
historyService.createHistoricProcessInstanceQuery().list() 查询流程实例列表（历史流程,包括未完成的）
historyService.createHistoricProcessInstanceQuery().list().foreach().getValue() 可以获取历史中表单的信息
historyService.createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult(); 根绝id查询流程实例
historyService.deleteHistoricProcessInstance() 删除历史流程
historyService.deleteHistoricTaskInstance(taskid); 删除任务实例
historyService.createHistoricActivityInstanceQuery().processInstanceId(processInstanceId).list()  流程实例节点列表 （当前进行到的那个节点的流程图使用）
```



## TaskService 任务服务

```
流转的节点审批
taskService.createTaskQuery().list() 待办任务列表
taskService.createTaskQuery().taskId(taskId).singleResult();  待办任务详情
taskService.saveTask(task); 修改任务
taskService.setAssignee() 设置审批人
taskService.addComment() 设置审批备注
taskService.complete() 完成当前审批
taskService.getProcessInstanceComments(processInstanceId); 查看任务详情（也就是都经过哪些人的审批，意见是什么）
taskService.delegateTask(taskId, delegater); 委派任务
taskService.claim(taskId, userId);认领任务
taskService.unclaim(taskId); 取消认领
taskService.complete(taskId, completeVariables); 完成任务

任务授权
taskService.addGroupIdentityLink()新增组任务授权
taskService.addUserIdentityLink() 新增人员任务授权
taskService.deleteGroupIdentityLink() 删除组任务授权
taskService.deleteUserIdentityLink() 删除人员任务授权
```



## ManagementService

```
1、主要是执行自定义命令。
managementService.executeCommand(new classA())  执行classA的内部方法
2、在自定义的方法中可以使用以下方法获取repositoryService
ProcessEngineConfiguration processEngineConfiguration =
            CommandContextUtil.getProcessEngineConfiguration(commandContext);
RepositoryService repositoryService = processEngineConfiguration.getRepositoryService();

```



## IdentityService 用户服务

操作用户服务的

```
 // 注意：设置流程发起者  设置前者可以在历史流程实例中查询到
identityService.setAuthenticatedUserId(sysUser.getUserId());
```



![[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-VYauDdqm-1662534044454)(img\image-20220324095243595.png)]](img/coreClass/31a28c7579c74286938e98660f2ef39d.png)
