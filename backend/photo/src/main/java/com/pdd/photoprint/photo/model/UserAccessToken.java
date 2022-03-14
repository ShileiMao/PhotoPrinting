package com.pdd.photoprint.photo.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@Data
@TableName("user_access_token")
public class UserAccessToken {

    @TableId(value = "user_id")
    private Integer userId;

    @TableField("access_token")
    private String accessToken;

    private Date expires;

    public UserAccessToken() {

    }
}
