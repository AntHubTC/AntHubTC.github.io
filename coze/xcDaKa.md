# 读书打卡



## 插件开发

![image-20250429105456750](img/xcDaKa/image-20250429105456750.png)

![image-20250429105550344](img/xcDaKa/image-20250429105550344.png)

插件开发界面：

![image-20250429105725307](img/xcDaKa/image-20250429105725307.png)





### 登录插件

创建xcLogin工具

![image-20250429105813849](img/xcDaKa/image-20250429105813849.png)

配置工具输入和输出

![image-20250429105858554](img/xcDaKa/image-20250429105858554.png)

代码编写：

```python
import json
import requests

from runtime import Args
from typings.xcLogin.xcLogin import Input, Output

browserHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "origin": "https://ims.xinchao.com",
    "referer": "https://ims.xinchao.com"
}

def handler(args: Args[Input])->Output:
    url = "https://ser-cloud.xinchao.com/portal/pl/pack/login/usernameLogin"
    body = {
        "username": args.input.account,
        "password": args.input.password  # 用以前的cookie存放密码
    }

    postRes = requests.post(url=url, data=json.dumps(body), headers=browserHeaders)
    if postRes.status_code != 200:
        isLogin = False;
    else:
        isLogin = True;
        # 获取用户accessToken
        res_json = postRes.json()
        access_token = res_json['data']['accessToken']

    return {
        "isLogin": isLogin,
        "accessToken": access_token
    }
```

插件运行测试：

![image-20250429110102603](img/xcDaKa/image-20250429110102603.png)

### 获取待读书的书籍信息

![image-20250429111444511](img/xcDaKa/image-20250429111444511.png)

配置工具输入和输出

![image-20250429112239918](img/xcDaKa/image-20250429112239918.png)

代码编写：

```python
from typing import Dict
from runtime import Args
from typings.getNeedClockList.getNeedClockList import Input, Output

import requests

browserHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "origin": "https://ims.xinchao.com",
    "referer": "https://ims.xinchao.com"
}


def checkServerRes(res):
    if res['code'] == '000':
        return True
    if res['code'] == 109:
        raise Exception("用户登录失效！")
    return False

def getClockList(args: Args[Input]):
    browserHeadersCopy = browserHeaders.copy()
    browserHeadersCopy['Authorization'] = args.input.accessToken

    url = "https://imsapi.xinchao.com/hraccount/api/clockIn/getBookList"
    postRes = requests.get(url=url, headers=browserHeadersCopy)
    if postRes.status_code != 200:
        raise BaseException("服务端my_join_activity接口异常!")
    if postRes.status_code == 200 and postRes.text.startswith("<!DOCTYPE"):
        raise BaseException("你的登录token失效了!")
    res = postRes.json()
    if checkServerRes(res):
        return res['data']
    return []

# 获取需要打卡的课程
def getNeedClockList(clock_list=None):
    if clock_list is None:
        clock_list = []
    return [clock for clock in clock_list if clock['status'] == 1]

def handler(args: Args[Input])->Output:
    # 获取参与的打卡的信息
    clock_list = getClockList(args)
    # 获取需要打卡的书籍任务
    clock_need_list = getNeedClockList(clock_list)

    return {"clock_need_list": clock_need_list}
```

插件运行测试：

![image-20250429111706461](img/xcDaKa/image-20250429111706461.png)

### 获取需要打卡的日期列表

![image-20250429112809384](img/xcDaKa/image-20250429112809384.png)

配置工具输入和输出

![image-20250429113959553](img/xcDaKa/image-20250429113959553.png)

代码编写：

```python
from runtime import Args
from typings.getNeedDakaClockDateList.getNeedDakaClockDateList import Input, Output

import requests

browserHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "origin": "https://ims.xinchao.com",
    "referer": "https://ims.xinchao.com"
}

def checkServerRes(res):
    if res['code'] == '000':
        return True
    if res['code'] == 109:
        raise Exception("用户登录失效！")
    return False

# 获取课程每日的打卡情况
# https://appdpeopqzr1047.h5.xiaoeknow.com/punch_card/get_clock_date_state
def get_clock_date_state(access_token:str, task_id=None):
    browserHeadersCopy = browserHeaders.copy()
    browserHeadersCopy['Authorization'] = access_token
    
    # url = "https://imsapi.xinchao.com/hraccount/api/clockIn/getCalendar?task_id=10&date=2024-05-24"
    url = "https://imsapi.xinchao.com/hraccount/api/clockIn/getCalendar?task_id=" + str(task_id)
    res = requests.get(url=url, headers=browserHeadersCopy).json()
    if checkServerRes(res):
        return res['data']
    raise Exception("获取课程每日的打卡情况失败！")

# 获取需要打卡的日期
def get_need_daka_clock_date_state(access_token:str, task_id=None):
    clock_date_state = get_clock_date_state(access_token, task_id)
    clock_date_state = clock_date_state["dateList"]
    # calendar_state 枚举状态 0无任务 1已打卡 3未打卡 4未开始
    return [clock_calendar['date'] for clock_calendar in clock_date_state if clock_calendar['status'] == 3]

def handler(args: Args[Input])->Output:
    access_token = args.input.accessToken
    task_id = args.input.taskId
    daka_clock_date_state_list = get_need_daka_clock_date_state(access_token, task_id)
    return {"needDakaDateList": daka_clock_date_state_list}
```

插件运行测试：

![image-20250429113910187](img/xcDaKa/image-20250429113910187.png)

### 打卡请求

![image-20250429114311070](img/xcDaKa/image-20250429114311070.png)

配置工具输入和输出

![image-20250429153250745](img/xcDaKa/image-20250429153250745.png)

代码编写：

```python
from runtime import Args
from typings.daka.daka import Input, Output
import requests
import json

browserHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "origin": "https://ims.xinchao.com",
    "referer": "https://ims.xinchao.com"
}

def checkServerRes(res):
    if res['code'] == '000':
        return True
    if res['code'] == 109:
        raise Exception("用户登录失效！")
    return False

def daka_request(access_token:str, task_id, data_date, text_content)->Output:
    browserHeadersCopy = browserHeaders.copy()
    browserHeadersCopy['Authorization'] = access_token

    url = "https://imsapi.xinchao.com/hraccount/api/clockIn/sumbitClockIn"
    body = {
        "task_id": task_id,
        "date": data_date,
        "content": text_content
    }
    resJson = requests.post(url=url, data=json.dumps(body), headers=browserHeadersCopy).json()

    mail_title = "%s日打卡" % data_date
    mail_content = "打卡内容：<b>%s</b>" % text_content
    if checkServerRes(resJson):
        # 打卡成功后给用户发送邮件
        mail_title = "%s日打卡成功" % data_date
        mail_content = "打卡内容：<b>%s</b>" % text_content
    

    #sendEmail(userInfo.receiveMail, mail_title, mail_content)
    return {
        'isOk': True,
        'message': resJson['msg'],
        'title': mail_title,
        'content': mail_content
    }

def handler(args: Args[Input])->Output:
    print("读书打卡 tool")

    access_token:str = args.input.accessToken
    task_id:str = args.input.taskId
    data_date:str = args.input.dakaDate
    text_content:str = args.input.comment

    daka_res = daka_request(access_token, task_id, data_date, text_content)

    return daka_res
```

插件运行测试：

![image-20250429153233416](img/xcDaKa/image-20250429153233416.png)

### 获取要读书的文章内容

![image-20250429153915224](img/xcDaKa/image-20250429153915224.png)

配置工具输入和输出

![image-20250429154441736](img/xcDaKa/image-20250429154441736.png)

代码编写：

```python
from runtime import Args
from typings.getArticleDetail.getArticleDetail import Input, Output

import requests

browserHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
    "Content-Type": "application/json;charset=UTF-8",
    "origin": "https://ims.xinchao.com",
    "referer": "https://ims.xinchao.com"
}

def checkServerRes(res):
    if res['code'] == '000':
        return True
    if res['code'] == 109:
        raise Exception("用户登录失效！")
    return False

# 获取课程对应日期的打卡内容
# https://imsapi.xinchao.com/hraccount/api/clockIn/getDetail?task_id=10&date=2024-05-27&type=0
def getPublishDiaryDetail(access_token:str, task_id=None, clock_date="2022-11-10"):
    browserHeadersCopy = browserHeaders.copy()
    browserHeadersCopy['Authorization'] = access_token

    url = f"https://imsapi.xinchao.com/hraccount/api/clockIn/getDetail?task_id={task_id}&date={clock_date}&type=0"
    res = requests.get(url=url, headers=browserHeadersCopy).json()
    if checkServerRes(res):
        return res['data']
    raise Exception("获取文章id失败！")


def handler(args: Args[Input])->Output:
    access_token:str = args.input.accessToken
    task_id:str = args.input.taskId
    daka_date:str = args.input.dakaDate

    # 获取课程对应日期的打卡文章信息
    diary_detail = getPublishDiaryDetail(access_token, task_id=task_id, clock_date=daka_date)
    article_content = diary_detail["task"]["task_content_string"]
    
    return {
        "articleContent": article_content
    }
```

插件运行测试：

![image-20250429154426271](img/xcDaKa/image-20250429154426271.png)

## 工作流设计

### 创建工作流

![image-20250429153207168](img/xcDaKa/image-20250429153207168.png)

![image-20250429153415789](img/xcDaKa/image-20250429153415789.png)

### 添加自定义的插件

![image-20250429161542686](img/xcDaKa/image-20250429161542686.png)

### 完成后的流程布局：

![image-20250429161312794](img/xcDaKa/image-20250429161312794.png)

> 其中选取任务id和选取打卡日期，只是在出现多个任务，多个日期的时候，只选取出一个任务/日期出来使用。

### 测试运行：

![image-20250429161222554](img/xcDaKa/image-20250429161222554.png)

在postman中允许：

![image-20250429162744356](img/xcDaKa/image-20250429162744356.png)

当然也可以获取到bash的请求脚本，添加到服务器定时执行：

```bash
curl --location 'https://api.coze.cn/v1/workflow/run' \
--header 'Authorization: Bearer pat_Y8JcB96LMxxxxxxxxxxxxxxxxxxk8krE2MSSH' \
--header 'Content-Type: application/json' \
--data '{
    "workflow_id": "7498634616628445241",
    "parameters": {
        "account":"XCxxxxxx",
        "passwored":"xxxx"
    }
}'
```

