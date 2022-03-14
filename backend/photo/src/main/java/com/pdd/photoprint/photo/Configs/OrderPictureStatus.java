package com.pdd.photoprint.photo.Configs;

public enum OrderPictureStatus {

    NEW(0, "新创建"),
    PRINTED(1, "已打印"),
    PRINT_FAIL(3, "打印失败");

    private final Integer value;

    private final String description;

    OrderPictureStatus(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    public Integer getValue() {
        return value;
    }

}
