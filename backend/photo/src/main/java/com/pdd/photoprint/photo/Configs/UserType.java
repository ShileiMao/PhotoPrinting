package com.pdd.photoprint.photo.Configs;

public enum UserType {
    USER("user", "普通用户"),
    ANONYMOUS("anonymous", "匿名用户"),
    ADMIN("admin", "管理员");

    private String type;
    private String desc;

    UserType(String type, String desc) {
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
