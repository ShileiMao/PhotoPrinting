package com.pdd.photoprint.photo.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@TableName("users")
public class Users {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String name;

    @TableField("login_name")
    private String loginName;


    /**
     * usernamepwd
     * anonymous
     */
    @TableField("login_type")
    private String loginType;

    @TableField("allow_login")
    private Integer allowLogin;

    @TableField("pwd")
    @JsonIgnore
    private String pwd;

    /**
     * user
     * anonymous
     */
    @TableField("user_type")
    private String userType;

    public Users(String name, String loginName, UserLoginType loginType, UserType userType, boolean allowLogin) {
        this.name = name;
        this.loginName = loginName;
        this.loginType = loginType.getType();
        this.userType = userType.getType();
        this.allowLogin = allowLogin ? 1 : 0;
    }
}
