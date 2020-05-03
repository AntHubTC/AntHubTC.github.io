package com.tc.security.springmvc.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
  *   author: tangcheng_cd
  *   create by: 2020/5/3
  *   descr: 
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    public static final String SESSION_USER_KEY = "_user";

    private String id;
    private String username;
    private String password;
    private String fullname;
    private String mobile;

    // 用户权限
    private Set<String> authorities;
}
