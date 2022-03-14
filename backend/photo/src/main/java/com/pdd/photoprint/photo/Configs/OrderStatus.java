package com.pdd.photoprint.photo.Configs;

public enum OrderStatus {
    NEW(0, "待处理"),
    PRINTED(1, "已打印"),
    POSTED(2, "已邮递"),
    COLLECTED(3,"已收货"),
    CONFIRMED(4, "已确认"),
    FINISH(5, "结束"),
    INVALID(6, "失效"),
    REPORT_WAITING(7, "投诉待处理"),
    REPORT_PROCESSING(8, "投诉处理中"),
    REPORT_PROCESED(9, "投诉已处理"),
    REPORT_REJECTED(10, "投诉已驳回")
    ;

    private final Integer value;
    private final String description;

    OrderStatus(Integer value, String description) {
        this.value = value;
        this.description = description;
    }

    public Integer getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }
}
