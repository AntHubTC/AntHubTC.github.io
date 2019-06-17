# JPA关系映射操作



## 一对多的关联关系

​	需求：角色与用户的一对多的关联关系

​	角色： 一方

​	用户：多方

**用户POJO：**

```java
package com.tc.entity;

import javax.persistence.*;

@Entity
@Table(name = "T_USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "T_ID")
    private Long id;

    @Column(name = "T_NAME")
    private String name;

    @Column(name = "T_AGE")
    private int age;

    @Column(name = "T_ADDRESS")
    private String address;

    // 关联  多对一
    @ManyToOne(cascade = CascadeType.PERSIST) // 级联操作，保存用户的时候才能一起保存角色。
    @JoinColumn(name = "ROLE_ID")
    private Role role;

    public User() {
    }

    public User(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", address='" + address + '\'' +
                ", role=" + role +
                '}';
    }
}
```

**角色POJO:**

```java
package com.tc.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "T_ROLE")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROLE_ID")
    private Integer roleId;

    @Column(name = "ROLE_NAME")
    private String roleName;

    // 关联 多对一
    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();

    public Role() {
    }

    public Role(String roleName) {
        this.roleName = roleName;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                '}';
    }
}
```

**JPA Repository接口实现：**

```java
package com.tc.jpa;

import com.tc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.io.Serializable;

public interface UserJPA extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>, Serializable {
}
```

**测试关联**

```java
package com.tc.jpa.test;

import com.tc.App;
import com.tc.entity.Role;
import com.tc.entity.User;
import com.tc.jpa.UserJPA;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {App.class})
public class OneToManyTest {
    @Autowired
    private UserJPA userJpa;

    @Test
    public void test() {
        // ======1========保存===================
        // 新建用户
        User user = new User("李花花", 18, "南京市xxx");
        // 新建角色
        Role role = new Role("花瓶");
        // 关联 (双向)
        user.setRole(role);
        role.getUsers().add(user);
        // 保存
        userJpa.save(user);

        // ======2========查询===================
        List<User> all = userJpa.findAll();
        for (User u : all) {
            System.out.println(u);
        }
    }
}
```



## 多对多关系

​	需求：角色与菜单多对多关联关系

​	角色：多方

​	菜单：多方

**角色类：**

```java
package com.tc.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "T_ROLE")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROLE_ID")
    private Integer roleId;

    @Column(name = "ROLE_NAME")
    private String roleName;

    // 关联 多对一
    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();

    /*
     * @JoinTable: 映射中间表
     *          name 中间表名
     *          joinColumns 当前表中的主键所关联的中间表中的外键。
     */
    @ManyToMany(
            cascade = CascadeType.PERSIST,
//            默认延迟加载，改为立即加载。
            fetch = FetchType.EAGER // 立即加载
    )
    @JoinTable(
            name="T_ROLE_MENU",
            joinColumns = @JoinColumn(name = "ROLE_ID"),
            inverseJoinColumns = @JoinColumn(name = "MENU_ID")
    )
    private Set<Menu> menus = new HashSet<>();

    public Role() {
    }

    public Role(String roleName) {
        this.roleName = roleName;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Set<Menu> getMenus() {
        return menus;
    }

    public void setMenus(Set<Menu> menus) {
        this.menus = menus;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", users=" + users +
                ", menus=" + menus +
                '}';
    }
}

```

**菜单类**

```java
package com.tc.entity;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "T_MENU")
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MENU_ID")
    private Integer menuId;

    @Column(name = "MENU_NAME")
    private String menuName;

    @Column(name = "MENU_URL")
    private String menuUrl;

    @Column(name = "P_ID")
    private Integer pId;

    @ManyToMany(mappedBy = "menus")
    private Set<Role> roles = new HashSet<>();

    public Menu() {
    }

    public Menu(String menuName, String menuUrl, Integer pId) {
        this.menuName = menuName;
        this.menuUrl = menuUrl;
        this.pId = pId;
    }

    public Integer getMenuId() {
        return menuId;
    }

    public void setMenuId(Integer menuId) {
        this.menuId = menuId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getMenuUrl() {
        return menuUrl;
    }

    public void setMenuUrl(String menuUrl) {
        this.menuUrl = menuUrl;
    }

    public Integer getpId() {
        return pId;
    }

    public void setpId(Integer pId) {
        this.pId = pId;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "Menu{" +
                "menuId=" + menuId +
                ", menuName='" + menuName + '\'' +
                ", menuUrl='" + menuUrl + '\'' +
                ", pId=" + pId +
                ", roles=" + roles +
                '}';
    }
}

```

**角色Repository接口类：**

```java
package com.tc.jpa;

import com.tc.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer>{
}
```

**测试类：**

```java
package com.tc.jpa.test;

import com.tc.App;
import com.tc.entity.Menu;
import com.tc.entity.Role;
import com.tc.entity.User;
import com.tc.jpa.RoleRepository;
import com.tc.jpa.UserJPA;
import org.assertj.core.util.Lists;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = {App.class})
public class ManyToManyTest {
    @Autowired
    private RoleRepository roleRepository;

    @Test
    public void test() {
        // ======1========保存===================
        // 创建角色对象
        Role role1 = new Role("花瓶");
        Role role2 = new Role("支部书记");
        Role role3 = new Role("村长");
        Role role4 = new Role("村民");

        // 创建菜单对象
        Menu menuRoot = new Menu("Root", "javascript:void(0)", null);
        Menu menu1 = new Menu("干活管理", "javascript:void(0)", 1);
        Menu menu2 = new Menu("挑粪管理", "javascript:void(0)", 1);
        Menu menu3 = new Menu("补贴发放管理", "javascript:void(0)", 1);
        Menu menu4 = new Menu("补贴领取管理", "javascript:void(0)", 1);

        // 关联
        role1.getMenus().add(menuRoot);
        role2.getMenus().add(menuRoot);
        role3.getMenus().add(menuRoot);
        role4.getMenus().add(menuRoot);
        menuRoot.getRoles().add(role1);
        menuRoot.getRoles().add(role2);
        menuRoot.getRoles().add(role3);
        menuRoot.getRoles().add(role4);

        role1.getMenus().add(menu2);
        menu2.getRoles().add(role1);

        role2.getMenus().add(menu3);
        menu3.getRoles().add(role2);

        role3.getMenus().add(menu1);
        menu1.getRoles().add(role3);

        role4.getMenus().add(menu4);
        menu4.getRoles().add(role4);

        roleRepository.saveAll(Lists.list(role1, role2, role3, role4));

        // ======2========查询===================
        List<Role> roles = roleRepository.findAll();
        System.out.println("====================");
        for (Role role : roles) {
            System.out.println("角色名：" + role.getRoleName());
            System.out.println("拥有的菜单:");
            for (Menu menu : role.getMenus()) {
                System.out.println("\t\t" + menu.getMenuName());
            }
            System.out.println("====================");
        }
    }
}
```

输出：

```
====================
角色名：花瓶
拥有的菜单:
		Root
		挑粪管理
====================
角色名：支部书记
拥有的菜单:
		Root
		补贴发放管理
====================
角色名：村长
拥有的菜单:
		干活管理
		Root
====================
角色名：村民
拥有的菜单:
		补贴领取管理
		Root
====================
```

