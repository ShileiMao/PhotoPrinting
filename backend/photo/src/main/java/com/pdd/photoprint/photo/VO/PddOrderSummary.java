package com.pdd.photoprint.photo.VO;

import com.baomidou.mybatisplus.annotation.TableField;
import com.pdd.photoprint.photo.model.Orders;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PddOrderSummary extends Orders {

    @TableField("address")
    private String postAddressStr;


    @TableField("addr_details")
    private String postAddrDetailStr;

    private String userType;

    private String accessToken;
}
