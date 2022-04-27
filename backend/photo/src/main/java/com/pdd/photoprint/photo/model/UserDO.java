package com.pdd.photoprint.photo.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@TableName("users")
public class UserDO {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("name")
    private String name;

    @TableField("login_name")
    private String loginName;

    @TableField("login_type")
    private String loginType = "usernamepwd";

    @TableField("allow_login")
    private Integer allowLogin = 1;

    @TableField("pwd")
    private String pwd;

    @TableField("user_type")
    private String userType = "admin";
}
