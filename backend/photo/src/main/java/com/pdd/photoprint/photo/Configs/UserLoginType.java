package com.pdd.photoprint.photo.Configs;

public enum UserLoginType {
    USER_NAME_PWD("usernamepwd", "用户名密码"),
    ANONYMOUS("anonymous", "匿名用户");

    private String type;
    private String desc;

    UserLoginType(String type, String desc) {
        this.type = type;
        this.desc = desc;
    }

    public String getType() {
        return type;
    }

    public String getDesc() {
        return desc;
    }
}
