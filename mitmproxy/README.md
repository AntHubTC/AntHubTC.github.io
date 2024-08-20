# 首页



官网： https://www.mitmproxy.org/

官网文档：https://docs.mitmproxy.org/stable/



## mitmproxy介绍

mitmproxy 是一组工具，为 HTTP/1、HTTP/2 和 WebSocket 提供交互式、支持 SSL/TLS 的拦截代理。
 **特点**
 1、拦截 HTTP 和 HTTPS 请求和响应并即时修改它们
 2、保存完整的 HTTP 对话以供以后重播和分析
 3、重放 HTTP 会话的客户端
 4、重播先前记录的服务器的 HTTP 响应
 5、反向代理模式将流量转发到指定服务器
 6、macOS 和 Linux 上的透明代理模式
 7、使用 Python 对 HTTP 流量进行脚本化更改
 8、用于拦截的 SSL/TLS 证书是动态生成的
 mitmproxy 项目的工具是一组公开常见底层功能的前端。当我们谈论“mitmproxy”时，我们通常指的是这三个工具中的任何一个 - 它们只是同一核心代理的不同前端。

**mitmproxy**：一个交互式、支持 SSL/TLS 的拦截代理，具有 HTTP/1、HTTP/2 和 WebSocket 的控制台界面。
**mitmweb**：mitmproxy 的基于 Web 的界面。
**mitmdump**： mitmproxy 的命令行版本。想想 HTTP 的 tcpdump。



## mitmproxy安装

```bash
pip install mitmproxy
mitmdump --version
```

## 安装证书



## mitmproxy插件开发-事件挂钩和常用API

[官方手册](https://links.jianshu.com/go?to=https%3A%2F%2Fdocs.mitmproxy.org%2Fstable%2Fapi%2Fevents.html)
这里只介绍mitmproxy.flow部分
1、前置处理
（加载启动，类似测试框架中的setup，通常用来初始化数据/开启代理等）

```python
  def load(self, loader: mitmproxy.addonmanager.Loader):
```

2、请求

```python
  def request(self, flow: http.HTTPFlow):
```

3、响应

```python
  def response(self, flow: http.HTTPFlow):
        cookies = flow.request.cookies  # cookies
        headers = flow.request.headers  # headers
        method = flow.request.method  # 请求方法
        scheme = flow.request.scheme  # 请求协议
        query = flow.request.query  # get-query请求体
        text = flow.request.text  # post-json请求体-字符串类型
        form = flow.request.urlencoded_form  # post-form请求体
```

4、后置处理
（加载启动，类似测试框架中的teardown，通常用来清理数据/关闭代理等）

```python
  def done(self):
```



## 其他问题解决

### （1）如何通过代码设置mac/window的代理

先通过 platform.system()获取系统类型
然后window可以运用注册表操纵库winreg，mac可以运用os内置库

```python
import os
import platform

# 获取系统 Windows-win Darwin-mac
sys_type = platform.system()
if sys_type == "Windows":
  # winreg只支持windows
  import winreg


class SetProxy:
  """
  代理设置取消程序
  支持windows和mas,默认windows
  """

  def __init__(self, ops_type):
      """初始化类变量 操作类型：开启/关闭 本地端口：默认8080"""
      self.ops_type = ops_type
      self.proxy_port = os.environ.get('PROXY_PORT')
      self.proxy_address = '127.0.0.1'
      self.ignore_hosts = ['xxx', 'xxx']  # 白名单

  def open_proxy_for_windows(self):
      """设置代理-windows"""
      # 打开注册表
      reg_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                               r'Software\Microsoft\Windows\CurrentVersion\Internet Settings', 0, winreg.KEY_WRITE)
      # 设置代理服务器地址和端口号
      winreg.SetValueEx(reg_key, 'ProxyServer', 0, winreg.REG_SZ, self.proxy_address + ':' + self.proxy_port)
      # 启用代理
      winreg.SetValueEx(reg_key, 'ProxyEnable', 0, winreg.REG_DWORD, 1)
      # 设置要忽略的域名或主机
      ignore_hosts = ';'.join(self.ignore_hosts)  # 处理['a','b'] = a;b
      winreg.SetValueEx(reg_key, 'ProxyOverride', 0, winreg.REG_SZ, ignore_hosts)
      # 关闭注册表
      winreg.CloseKey(reg_key)

  def close_proxy_for_windows(self):
      """取消代理-windows"""
      # 打开注册表
      reg_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                               r'Software\Microsoft\Windows\CurrentVersion\Internet Settings', 0, winreg.KEY_WRITE)
      # 禁用代理
      winreg.SetValueEx(reg_key, 'ProxyEnable', 0, winreg.REG_DWORD, 0)
      # 清空代理服务器的配置
      winreg.SetValueEx(reg_key, 'ProxyServer', 0, winreg.REG_SZ, '')
      # 清空忽略域名或主机设置
      winreg.SetValueEx(reg_key, 'ProxyOverride', 0, winreg.REG_SZ, '')
      # winreg.SetValueEx(reg_key, 'ProxyOverride', 0, winreg.REG_SZ, '<local>')

      # 关闭注册表
      winreg.CloseKey(reg_key)

  def open_proxy_for_mac(self):
      """设置代理-mas"""
      # 使用 networksetup 命令设置代理
      os.system(f"networksetup -setwebproxy Wi-Fi {self.proxy_address} {self.proxy_port}")
      os.system(f"networksetup -setsecurewebproxy Wi-Fi {self.proxy_address} {self.proxy_port}")
      ignore_hosts = ' '.join(self.ignore_hosts)  # 处理['a','b'] = a b
      os.system(f"networksetup -setproxybypassdomains Wi-Fi {ignore_hosts}")

  def close_proxy_for_mac(self):
      """取消代理-mac"""
      # 使用 networksetup 命令取消代理
      os.system("networksetup -setwebproxystate Wi-Fi off")
      os.system("networksetup -setsecurewebproxystate Wi-Fi off")
      os.system("networksetup -setproxybypassdomains Wi-Fi ''")

  def main(self):
      """主程序 根据系统类型/操作类型执行开启或者关闭代理操作"""
      if sys_type == 'Windows':
          if self.ops_type == 'open':
              self.open_proxy_for_windows()
          elif self.ops_type == 'close':
              self.close_proxy_for_windows()
      elif sys_type == 'Darwin':
          if self.ops_type == 'open':
              self.open_proxy_for_mac()
          elif self.ops_type == 'close':
              self.close_proxy_for_mac()
```

### （2）mitmproxy中flow返回的headers对象为复合字典如何转化为普通字典

```python
def mult_dict_to_dict(old_dict):
    """
    复合字典视图转化为字典
        >>> [['xx', 'c9e26547791d034307c7fc3c38636279'], ['channel', 'admin']]
        {"xxx": "c9e26547791d034307c7fc3c38636279","channel":"admin"}
    """
    # 处理headers为字典
    new_dict = {}
    for key, value in old_dict.items():
        new_dict[key] = value
    return new_dict
```

### （3）如何处理不同请求方法下的不同请求参数？

先根据flow.request.method（请求方法）判断，然后根据flow.request.headers['content-type']（请求内容格式）判断。
 最终都统一处理为json。

**query** 对应requests.get(params=xx)
 **json**   对应requests.post(json=xx)
 **form**  对应requests.post(data=xx)

#### 通常POST有3种

1）无参数
 2）有参数
 json 形如 `{}`
 form 形如 `python username=张三&password=123456`

#### 通常GET有2种

1）无参数
 2）有参数
 query 形如 `https://xxx.com/xxx?username=张三&password=123456`

```python
            def response(self, flow: http.HTTPFlow):
                # 提取流量相关信息
                cookies = flow.request.cookies  # cookies
                headers = flow.request.headers  # headers
                method = flow.request.method  # 请求方法
                scheme = flow.request.scheme  # 请求协议
                query = flow.request.query  # get-query请求体
                text = flow.request.text  # post-json请求体-字符串类型
                form = flow.request.urlencoded_form  # post-form请求体
                # 提取参数
                if method == 'POST':
                    if content_type == 'application/x-www-form-urlencoded':
                        req_body = {}
                        # 同时存在query
                        if len(query) != 0:
                            try:
                                req_form = mult_dict_to_dict(form)
                            except Exception as e:
                                req_form = form
                                logger.exception(e)

                            try:
                                req_query = mult_dict_to_dict(query)
                            except Exception as e:
                                req_query = query
                                logger.exception(e)
                        # 不存在query
                        else:
                            try:
                                req_form = mult_dict_to_dict(form)
                            except Exception as e:
                                req_form = form
                                logger.exception(e)
                            finally:
                                req_query = {}
                    elif content_type in('application/json','application/json;charset=UTF-8' ,'application/json; charset=utf-8'):
                        req_form = {}
                        # 同时存在query
                        if len(query) != 0:
                            try:
                                req_body = json.loads(text)
                            except Exception as e:
                                req_body = text
                                logger.exception(e)

                            try:
                                req_query = mult_dict_to_dict(query)
                            except Exception as e:
                                req_query = query
                                logger.exception(e)
                        # 不存在query
                        else:
                            # 处理特殊情况，参数为''
                            if text == '':
                                text = {}
                            try:
                                req_body = json.loads(text)
                            except Exception as e:
                                req_body = text
                                logger.exception(e)
                            finally:
                                req_query = {}
                    else:
                        req_query = {}
                        req_body = {}
                        req_form = {}
                elif method == 'GET':
                    if len(query) != 0:
                        # 处理为字典
                        req_query = mult_dict_to_dict(query)
                    else:
                        req_query = {}
                    req_body = {}
                    req_form = {}
                # 其他请求方法
                else:
                    req_query = {}
                    req_body = {}
                    req_form = {}
```

