
## WebSocket DEMO案例

### 需求

通过websocket实现一个简易的聊天室功能；

登录界面：

![1571370715797](.\img\1571370715797.png)

聊天室界面：

![1571370671310](.\img\1571370671310.png)

![1571370690831](.\img\1571370690831.png)

### 实现流程

![1571296932906](.\img\1571296932906.png)

### 消息格式

客户端--->服务端：

```json
{
    "fromName": "Deng",
    "toName": "HEIMA",
    "content": "约会呀"
}
```

服务端--->客户端：

1. 如果type为user，则说明返回的是用户列表

   ```json
   {
       "data": "HEIMA,Deng,ITCAST",
       "toName": "",
       "fromName": "",
       "type": "user"
   }
   ```

2. 如果type为message，则说明返回的消息是消息内容

   ```json
   {
       "data": "你好",
       "toName": "HEIMA",
       "fromName": "Deng",
       "type": "message"
   }
   ```

### 功能实现

创建web项目，导入项目依赖。其中tomcat-websocket.jar和websocket-api.jar是tomcat/lib目录下可以找到。

![1571298092840](.\img\1571298092840.png)

#### web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">

    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>

    <!-- 使用xml配置
    <filter>
        <filter-name>loginFilter</filter-name>
        <filter-class>com.tc.filter.LoginFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>loginFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <servlet>
        <servlet-name>login</servlet-name>
        <servlet-class>com.tc.servlet.LoginServlet</servlet-class>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>login</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>
-->

    <welcome-file-list>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```

#### login.jsp

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>login page</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #cdffba;
        }
        .login-panel {
            width: 400px;
            margin: 100px auto;
        }
        .login-panel > form > div {
            height: 30px;
        }
    </style>
</head>
<body>
    <div class="login-panel">
        <h2>登录</h2>
        <form action="/login" method="post">
            <div><input name="username" type="text" placeholder="用户名"></div>
            <div><input name="password" type="password" placeholder="密码"></div>
            <div style="color: red">
                ${requestScope.error}
            </div>
            <div>
                <input type="submit" value="登录"/>
            </div>
        </form>
    </div>
</body>
</html>
```

#### LoginServlet.java

```java
package com.tc.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "loginServlet", urlPatterns = "/login")
public class LoginServlet extends HttpServlet{

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //1. 接收页面传递的参数， 用户名/密码
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        //2. 判定用户名密码是否正确
        if ((!"".equals(username.trim())) && "123456".equals(password)) {
            HttpSession session = req.getSession();
            session.setAttribute("tokenId", String.valueOf(System.currentTimeMillis()));
            session.setAttribute("userName", username);

            //3. 如果正确，响应登录成功信息
            resp.sendRedirect("/chat.jsp");
        } else {
            //4. 如果失败，响应失败的信息
            req.setAttribute("error", "用户名或密码错误！");

            req.getRequestDispatcher("/login.jsp").forward(req, resp);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
}
```

#### LoginFilter.java

```java
package com.tc.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName = "loginFilter", urlPatterns = "/*")
public class LoginFilter implements Filter{
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String requestURI = request.getRequestURI();
        if ("/".equals(requestURI) || "/login".equals(requestURI) || "/login.jsp".equals(requestURI)) {
            filterChain.doFilter(req, resp);
            return;
        }
        HttpSession session = request.getSession();
        String sessionId = (String) session.getAttribute("tokenId");
        if (sessionId == null || "".equals(sessionId)) {
            // 跳转到登录页面
            req.getRequestDispatcher("/login.jsp").forward(req, resp);
            return;
        }

        filterChain.doFilter(req, resp);
    }

    @Override
    public void destroy() {
    }
}
```

#### CharacterFilter.java

```java
package com.tc.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(filterName = "characterFilter", urlPatterns = "/*")
public class CharacterFilter implements Filter{
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain filterChain) throws IOException, ServletException {
        req.setCharacterEncoding("UTF-8");

        filterChain.doFilter(req, resp);
    }

    @Override
    public void destroy() {

    }
}

```



#### ChatSocket.java

```java
package com.tc.websocket;


import com.alibaba.fastjson.JSON;
import com.tc.util.GetHttpSessionConfigurator;
import com.tc.vo.UserMessage;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@ServerEndpoint(value = "/websocket", configurator = GetHttpSessionConfigurator.class)
public class ChatSocket {

    // 当前websocket会话的对象
    private Session session;
    // 指的Servlet中的Session
    private HttpSession httpSession;
    // 保存当前系统中登录的用户的HttpSession信息，及对应的Endpoint实例信息。
    private static Map<HttpSession, ChatSocket> onlineUsers = new HashMap<HttpSession, ChatSocket>();
    // 当前登录的用户数
    private static int onlineCount = 0;

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        // 记录websocket的会话信息对象Session
        this.session = session;

        // 获取当前登录用户HttpSession信息
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession;

        // 判断当前系统是否已经有这个会话了
        boolean existsSession = onlineUsers.keySet().contains(httpSession);

        // 记录当前登录用户信息，及对应的EndPoint实例
        String loginUser = (String) httpSession.getAttribute("userName");
        if (loginUser != null && !existsSession) {
            System.out.println("登录用户：" + loginUser + ", Endpoint:" + hashCode());

            this.onlineUsers.put(httpSession, this);

            // 记录当前用户登录数
            incrCount();
            System.out.println("在线人数：" + onlineCount);

            UserMessage sysMessage = new UserMessage(loginUser, "", UserMessage.UserMessageType.TYPE_SYS, "上线通知：你的好友" + loginUser + "上线了！");
            broadcastAllUsers(sysMessage.toJSON(), false);
        }

        // 获取当前所有登录用户
        String userNames = getUserNames();
        // 组装消息
        UserMessage userMessage = new UserMessage(loginUser, "", UserMessage.UserMessageType.TYPE_USER, userNames);
        // 通过广播的形式发送消息
        broadcastAllUsers(userMessage.toJSON(), true);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        String loginUser = (String) httpSession.getAttribute("userName");
        System.out.println("onMessage: name = " + loginUser + ",message = " + message);
        // 获取客户端的信息内容进行解析
        // {
        //    "data": "你好",
        //    "toName": "HEIMA",
        //    "fromName": "Deng",
        //    "type": "message"
        //}
        UserMessage userMessage = JSON.parseObject(message, UserMessage.class);
        userMessage.setType(UserMessage.UserMessageType.TYPE_MESSAGE); // 强制为普通消息，客户端不同更改

        // 判定是否有接收人
        String toName = userMessage.getToName();
        if (null == toName || toName.isEmpty()) {
            return;
        }

        // 如果接收人是广播(all)，则广播消息。
        if ("all".equals(userMessage.getToName())) {
            broadcastAllUsers(userMessage.toJSON(), false);
        } else {
            // 不是all，则给指定的用户推送消息。
            sendToUser(userMessage);
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        String loginUser = (String) httpSession.getAttribute("userName");

        // 用户数减1
        decrCount();

        // 移除endpoint
        HttpSession httpSession = (HttpSession) session.getUserProperties().get(HttpSession.class.getName());
        onlineUsers.remove(httpSession);

        System.out.println("下线用户：" + loginUser + ", Endpoint:" + hashCode());
        System.out.println("在线人数：" + onlineCount);

        // 通知其它用户该用户下线了
        UserMessage sysMessage = new UserMessage(loginUser, "", UserMessage.UserMessageType.TYPE_SYS, "下线通知：你的好友" + loginUser + "下线了！");
        broadcastAllUsers(sysMessage.toJSON(), false);

    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
        System.err.println("服务器异常！");
    }


    // 将消息发送给指定人
    private void sendToUser(UserMessage userMessage) {
        ChatSocket chatSocket = getUserEndPoint(userMessage.getToName());
        if (null != chatSocket) {
            Session session = chatSocket.getSession();
            if (session.isOpen()) {
                sendMessage(session, userMessage.toJSON());
            }
        }
    }

    // 获取指定用户的EndPoint
    private ChatSocket getUserEndPoint(String userName) {
        for (HttpSession hs : onlineUsers.keySet()) {
            String loginUser = (String) hs.getAttribute("userName");
            if (loginUser.equals(userName)) {
                return onlineUsers.get(hs);
            }
        }
        return null;
    }

    /**
     * 广播消息给所有的人
     *
     * @param message  消息
     * @param containSelf 是否包含自己
     */
    private void broadcastAllUsers(String message, boolean containSelf) {
        if (onlineUsers.size() > 0) {
            for (Map.Entry<HttpSession, ChatSocket> entry : onlineUsers.entrySet()) {
                HttpSession hs = entry.getKey();
                ChatSocket chatSocket = entry.getValue();
                Session session = chatSocket.getSession();
                if (session.isOpen()) {
                    if (!containSelf) { // 不包含自己
                        if (hs == this.httpSession) { // 如果包含自己跳过
                            continue;
                        }
                    }
                    sendMessage(session, message);
                }
            }
        }
    }

    // 单个session发送消息
    private static void sendMessage(Session session, String message) {
        RemoteEndpoint.Basic basicRemote = session.getBasicRemote();
        try {
            basicRemote.sendText(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 获取所有的在线用户
    private String getUserNames() {
        StringBuilder userNameBuilder = new StringBuilder();
        if (onlineUsers.size() > 0) {
            for (HttpSession hs : onlineUsers.keySet()) {
                Object userName = hs.getAttribute("userName");
                userNameBuilder.append(userName).append(",");
            }
        }
        return userNameBuilder.substring(0, userNameBuilder.length() - 1);
    }

    public synchronized void incrCount() {
        onlineCount ++;
    }

    public synchronized void decrCount() {
        onlineCount --;
    }

    public int getOnlineCount() {
        return onlineCount;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public HttpSession getHttpSession() {
        return httpSession;
    }

    public void setHttpSession(HttpSession httpSession) {
        this.httpSession = httpSession;
    }
}
```

#### GetHttpSessionConfigurator.java

```java
package com.tc.util;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator{

    @Override
    public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        String sessionName = HttpSession.class.getName();

        // 将httpsession的内容放到userProperties中
        sec.getUserProperties().put(sessionName, httpSession);
    }
}
```

#### JSONSerializable.java

```java
package com.tc.util;

import com.alibaba.fastjson.JSON;

import java.io.Serializable;

public interface JSONSerializable extends Serializable {
    default String toJSON(){
        return JSON.toJSONString(this);
    }
}
```

#### UserMessage.java

```java
package com.tc.vo;

import com.tc.util.JSONSerializable;

public class UserMessage implements JSONSerializable {
    // 发送人
    private String fromName;
    // 接收人
    private String toName;
    // 数据类型
    private String type;
    // 数据内容
    private String data;

    public static class UserMessageType{
        // 发送的用户列表消息
        public static final String TYPE_USER = "user";
        // 系统类消息
        public static final String TYPE_SYS = "system";
        // 普通聊天消息
        public static final String TYPE_MESSAGE = "message";
    }

    public UserMessage() {
    }

    public UserMessage(String fromName, String toName, String type, String data) {
        this.fromName = fromName;
        this.toName = toName;
        this.type = type;
        this.data = data;
    }

    public String getFromName() {
        return fromName;
    }

    public void setFromName(String fromName) {
        this.fromName = fromName;
    }

    public String getToName() {
        return toName;
    }

    public void setToName(String toName) {
        this.toName = toName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "UserMessage{" +
                "fromName='" + fromName + '\'' +
                ", toName='" + toName + '\'' +
                ", type='" + type + '\'' +
                ", data='" + data + '\'' +
                '}';
    }
}
```

#### chat.jsp

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>chat room</title>
    <link type="text/css" rel="stylesheet" href="./css/chat.css">
    <script type="text/javascript" src="./js/jquery-3.4.1.js"></script>
    <script type="text/javascript">
        // TODO:: 改成测试的实际地址
        var serverUrl = "ws://localhost:8082/websocket";
        var ws = null;

        function startWebSocket(openOpenHandler, onMessageHandler, onCloseHandler, onErrorHandler) {
            // 构建WebSocket对象
            var WebSocket = window.WebSocket || window.MozWebSocket;
            if (!WebSocket) {
                alert("不支持WebSocket");
                return;
            }
            ws = new WebSocket(serverUrl);

            //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
            ws.onopen = openOpenHandler;
            ws.onmessage = onMessageHandler;
            ws.onclose = onCloseHandler;
            ws.onerror = onErrorHandler;
        }

        $(function () {
            var currentUserName = '${sessionScope.userName}';

            // 在网页上输出消息
            function printMessage(user, message) {
                var message = '<div class="message-item">' +
                    '            <div class="message-title">' +
                    '                ' + user +':' +
                    '            </div>' +
                    '            <div class="message-content">' +
                    '                ' + message +
                    '            </div>' +
                    '        </div>';
                $('#mesageBox').append(message);
            }

            var socketHandler = {
                openOpenHandler: function () {
                    // 当WebSocket创建成功时，触发onopen事件
                    console.log("open");
                },
                onMessageHandler: function (e) {
                    // 当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
                    var resData = JSON.parse(e.data || '{}');
                    if (resData.type === 'user') { // 用户列表消息
                        var userArr = resData.data.split(',');
                        var $userNameList = $("#userNameList");
                        $userNameList.empty();
                        $userNameList.append('<input type="radio" name="toUser" value="all"/>')
                        $userNameList.append('&nbsp;广播&nbsp;&nbsp;&nbsp;')

                        $.each(userArr, function (index, value) {
                            $userNameList.append('<input type="radio" name="toUser" value="' + value + '"/>')
                            $userNameList.append('&nbsp;' + value + '&nbsp;&nbsp;&nbsp;')
                        })
                    } else if (resData.type === 'system') { // 系统消息
                        if (resData.fromName !== currentUserName) {
                            printMessage('系统消息', resData.data);
                        }
                    } else if (resData.type === 'message') {
                        if (resData.fromName !== currentUserName) {
                            printMessage(resData.fromName, resData.data);
                        }
                    }
                },
                onCloseHandler: function () {
                    // 当客户端收到服务端发送的关闭连接请求时，触发onclose事件
                    console.log("close");
                },
                onErrorHandler: function () {
                    // 如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
                    console.error(e);
                }
            }

            // 开始WebSocket连接
            startWebSocket(
                socketHandler.openOpenHandler,
                socketHandler.onMessageHandler,
                socketHandler.onCloseHandler,
                socketHandler.onErrorHandler
            );

            $("#sendBtn").click(function () {
                var $messageIpt = $("#messageInpt");
                var message = $messageIpt.val();
                var sendMessage = JSON.stringify({
                    'data': message,
                    'toName': $('input[name=toUser]:checked').val(),
                    'fromName': currentUserName,
                    'type': 'message'
                });
                ws.send(sendMessage);
                $messageIpt.val('');
                printMessage('我', message);
            });
        })
    </script>
</head>
<body>
    <div>
        <span>当前用户：</span>
        <span>${sessionScope.userName}</span>
    </div>
    <div>
        <span>用户列表：</span>
        <span id="userNameList"></span>
    </div>
    <div id="mesageBox" class="message-box">
    </div>
    <div class="input-message-box">
        <input id="sendBtn" type="button" value="发送" class="send-button">
        <textarea id="messageInpt" class="send-message" cols="100" rows="10"></textarea>
    </div>
</body>
</html>
```

#### chat.css

```css
body {
    overflow: hidden;
}
.input-message-box {
    position: absolute;
    bottom: 5px;
    border: 1px solid black;
    width: 100%;
}
.send-message {
    height: 100px;
    width: 80%;
    overflow: hidden;
    clear: both;
}
.send-button {
    float: right;
    width: 100px;
    height: 100px;
    padding: 0;
    margin: 0;
}
.message-box {
    border: 1px solid black;
    height: 400px;
    padding: 10px;
    overflow-y: auto;
}
.message-box .message-item {
    margin-top: 4px;
    padding: 6px;
    background-color: aliceblue;
}
.message-box .message-title {
    font-weight: bold;
}
.message-box .message-content {
    text-indent: 2em;
}
```

### 工程源码文件

​		下载地址[websocketChatRoom.rar](./websocketChatRoom.rar)