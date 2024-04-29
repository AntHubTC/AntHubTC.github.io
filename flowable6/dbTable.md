# flowable数据库表

Flowable的所有数据库表都以ACT_开头。第二部分是说明表用途的两字符标示符。服务API的命名也大略符合这个规则。



## flowable提供的表

ACT_RE_： 'RE’代表repository。带有这个前缀的表包含“静态”信息，例如流程定义与流程资源（图片、规则等）。_

ACT_RU_： 'RU’代表runtime。这些表存储运行时信息，例如流程实例（process instance）、用户任务（user task）、变量（variable）、作业（job）等。Flowable只在流程实例运行中保存运行时数据，并在流程实例结束时删除记录。这样保证运行时表小和快。

ACT_HI_： 'HI’代表history。这些表存储历史数据，例如已完成的流程实例、变量、任务等。

ACT_GE_： 通用数据。在多处使用。

ACT_ID_*： 表示组织信息，如用户，用户组，等等。（很少使用）



## ACT_GE_*

ACT_GE_BYTEARRAY：保存流程的bpmn的xml以及流程的Image缩略图等信息

ACT_GE_PROPERTY：Flowable相关的基本信息。比如各个module使用的版本信息。



## ACT_RE_*

ACT_RE_DEPLOYMENT: 部署对象，存储流程名称

ACT_RE_MODEL：基于流程的模型信息，流程设计器设计流程模型保存的数据，包含：建立时间，最后更新时间，元数据(META_INFO_：以json格式保存流程定义的信息)，部署ID(DEPLOYMENT_ID_)

ACT_RE_PROCDEF：流程定义表

此表和ACT_RE_DEPLOYMENT是多对一的关系，即，一个部署的bar包里可能包含多个流程定义文件，每一个流程定义文件都会有一条记录在ACT_REPROCDEF表内，每一个流程定义的数据，都会对于ACT_GE_BYTEARRAY表内的一个资源文件和PNG图片文件。

ACT_GE_BYTEARRAY的关联：是经过程序用ACT_GE_BYTEARRAY.NAME与ACT_RE_PROCDEF.NAME_完成的，在数据库表结构中没有体现

分类(CATEGORY_：流程定义的Namespace就是类别)，部署ID(DEPLOYMENT_ID_)，资源名称(RESOURCE_NAME_：流程bpmn文件名称)，拥有开始表单标识(HAS_START_FORM_KEY_：start节点是否存在 formKey 0否 1是)，挂起状态(SUSPENSION_STATE_：暂停状态 1激活 2暂停)



## ACT_RU_*

**flowable只存储实例执行期间的运行时数据，当流程实例结束时，将删除这些记录。这就保证了这些运行时的表小且快。**

ACT_RU_ACTINST：运行中实例的活动表，一般是流程图中正在活动的节点，包含箭头哦

ACT_RU_DEADLETTER_JOB：当JOB执行很多次都无法执行，就会被记录在此表

ACT_RU_ENTITYLINK：还没使用到

ACT_RU_EVENT_SUBSCR：运行时的事件，包含：流程定义ID，流程实例ID，执行实例ID，节点ID，建立时间等

ACT_RU_EXECUTION：运行的实例表，包含：流程实例ID，流程定义ID，父级ID，父级的执行实例ID，节点ID，挂起状态(SUSPENSION_STATE_：1激活 2暂停)，缓存状态(CACHED_ENT_STATE_：缓存的状态， 1 事件监听 2 人工任务 3 异步做业)

ACT_RU_HISTORY_JOB； 运行中的定时任务历史表

ACT_RU_IDENTITYLINK： 当前任务执行人的信息，主要存储当前节点参与者的信息，包含：用户组ID，用户ID，任务ID，流程实例ID，流程定义ID

ACT_RU_JOB：运行中的异步任务

- 锁定过时时间(LOCK_EXP_TIME_),挂起者(LOCK_OWNER_),是否惟一(EXCLUSIVE_),执行实例ID，流程实例ID，流程定义ID，重试次数(RETRIES_),截至时间(DUEDATE_)
- 须要启用JOB组件JobExecutor 是管理一组线程的组件，这些线程用于触发定时器（包括后续的异步消息）。在单元测试场景下，使用多线程会很笨重。
- ManagementService.createJobQuery 用于查询，
- ManagementService.executeJob 用于执行做业。
- 这样做业的执行就能够在单元测试内部控制。为了不做业执行器的干扰，能够将它关闭。默认状况下， JobExecutor 在流程引擎启动时激活。
  当你不但愿 JobExecutor 随流程引擎启动时，设置：
- 启用异步执行器 Async executor activation
  AsyncExecutor 是管理线程池的组件，这个线程池用于触发定时器与异步任务。
  默认状况下，因为历史缘由，当使用 JobExecutor 时， AsyncExecutor 不生效。然而咱们建议使用新的 AsyncExecutor 代替JobExecutor ，经过定义两个参数实现

​		参数 asyncExecutorEnabled 用于启用异步执行器，代替老的做业执行器。
​		参数 asyncExecutorActivate 命令Activiti引擎在启动时启动异步执行器线程池。

ACT_RU_SUSPENDED_JOB：暂停的任务表。如果一个异步任务在运行中，被暂停。就会记录在词表

ACT_RU_TASK：运行中的正常节点任务，
包含：
主键(任务ID)，执行实例ID，流程实例ID，流程定义ID，父任务ID，被代理人(OWNER_:通常状况下为空，只有在委托时才有值)，经办人(GNEE_:签收人或者委托人)，委托状态(DELEGATION_:委托状态 PENDING委托中，RESOLVED已处理)，优先级(PRIORITY_)，建立时间，截至时间，挂起状态(SUSPENSION_STATE_:暂停状态 1激活 2暂停)

ACT_RU_TIMER_JOB：定时作业表

ACT_RU_VARIABLE：运行中的流程实例变量，流程变量



## ACT_ID_*

ACT_ID_BYTEARRAY：用户数据存放？？？

ACT_ID_GROUP：用户组信息

ACT_ID_INFO：用户详情

ACT_ID_MEMBERSHIP：用户组和用户的关系

ACT_ID_PRIV：权限

ACT_ID_PRIV_MAPPING：用户组和权限之间的关系

ACT_ID_PROPERTY：用户或者用户组属性拓展表

ACT_ID_TOKEN：登录相关日志

ACT_ID_USER：用户



## ACT_HI_*

’HI’表示history。就是这些表包含着历史的相关数据，如结束的流程实例，变量，任务，等等。

ACT_HI_ACTINST: 流程实例历史，记录流程流转过的全部节点，包括流程定义ID，流程实例ID，执行节点的ID/名称，执行的指向箭头，办理人ID，开始时间，结束时间，删除缘由等

ACT_HI_ATTACHMENT：实例的历史附件，几乎不会使用，会加大数据库很大的一个loading

ACT_HI_COMMENT：实例的历史备注，存放历史流程的审批意见

ACT_HI_DETAIL：实例流程详细信息

ACT_HI_IDENTITYLINK: 实例节点中，如果指定了目标人，产生的历史。主要存储当前节点参与者的信息，好比参与者ID，参与的流程实例ID，任务ID，参与者扮演的角色类型{assignee（办理者）、candidate（候补者）、owner（委托的办理者）、starter（发起者） 、participant（参与者）}

ACT_HI_PROCINST：流程实例历史

ACT_HI_TASKINST：流程实例的任务历史

ACT_HI_VARINST：流程实例的变量历史



## FLW_*

FLW_CHANNEL_DEFINITION: 泳池管道定义表

FLW_EVENT_DEFINITION：事件定义

FLW_EVENT_DEPLOYMENT：事件必输

FLW_EVENT_RESOURCE：事件所需资源

FLW_EV_DATABASECHANGELOG：Liquibase执行的记录

FLW_EV_DATABASECHANGELOGLOCK：Liquibase执行锁

FLW_RU_BATCH：暂时未知

FLW_RU_BATCH_PART：暂时未知

