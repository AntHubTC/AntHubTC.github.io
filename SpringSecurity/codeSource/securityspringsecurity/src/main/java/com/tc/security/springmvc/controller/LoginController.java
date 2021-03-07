package com.tc.security.springmvc.controller;

import com.tc.security.springmvc.model.UserDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
public class LoginController {

    @RequestMapping(value = "/login-success",produces = {"text/plain;charset=UTF-8"})
    public String loginSuccess(){
        return " 登录成功";
    }

    // ===========  添加测试资源
    @GetMapping(value = "/r/r1",produces = {"text/plain;charset=UTF-8"})
    public String r1(HttpSession session){
        String fullname = null;
        Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
        if(userObj != null){
            fullname = ((UserDto)userObj).getFullname();
        }else{
            fullname = "匿名";
        }
        return fullname + " 访问资源1";
    }


    /**
     * 测试资源2
     * @param session
     * @return
     */
    @GetMapping(value = "/r/r2",produces = {"text/plain;charset=UTF-8"})
    public String r2(HttpSession session){
        String fullname = null;
        Object userObj = session.getAttribute(UserDto.SESSION_USER_KEY);
        if(userObj != null){
            fullname = ((UserDto)userObj).getFullname();
        }else{
            fullname = "匿名";
        }
        return fullname + " 访问资源2";
    }
}
