package com.pdd.photoprint.photo.VO;

import com.baomidou.mybatisplus.annotation.TableField;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.Packaging;
import com.pdd.photoprint.photo.Configs.PhotoSize;
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

    private String strOrderStatus;

    private String strPackaging;

    private String strPhotoSize;


    public void dbToRedableStatus() {
        this.strOrderStatus = OrderStatus.toOrderStatus(this.getStatus()).getDescription();
        this.strPackaging = Packaging.toReadablePackaging(this.getPackaging()).getDescription();
        this.strPhotoSize = PhotoSize.toRedableSize(this.getPhotoSize()).getDescription();
    }
}
