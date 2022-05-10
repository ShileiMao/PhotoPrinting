package com.pdd.photoprint.photo.Configs;

import org.springframework.core.annotation.Order;

public enum OrderStatus {
    UNPROVED(-1, "未审核"),
    NEW(0, "待处理"),
    PRINTED(1, "已打印"),
    POSTED(2, "已邮递"),
    COLLECTED(3,"已收货"),
    CONFIRMED(4, "已确认"),
    FINISH(5, "结束"),
    INVALID(6, "失效"),
    REPORT_WAITING(7, "投诉待处理"),
    REPORT_PROCESSING(8, "投诉处理中"),
    REPORT_PROCESSED(9, "投诉已处理"),
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

    public static OrderStatus toOrderStatus(int status) {
        switch (status) {
            case 0:
                return OrderStatus.NEW;

            case 1:
                return OrderStatus.PRINTED;

            case 2:
                return OrderStatus.POSTED;

            case 3:
                return OrderStatus.COLLECTED;

            case 4:
                return OrderStatus.CONFIRMED;

            case 5:
                return OrderStatus.FINISH;

            case 6:
                return OrderStatus.INVALID;

            case 7:
                return OrderStatus.REPORT_WAITING;

            case 8:
                return OrderStatus.REPORT_PROCESSING;

            case 9:
                return OrderStatus.REPORT_PROCESSED;

            case 10:
                return OrderStatus.REPORT_REJECTED;

            default:
                return OrderStatus.NEW;
        }
    }
}
