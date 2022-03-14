package com.pdd.photoprint.photo.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Repository;

@Data
@Getter
@Setter
@TableName("order_picture")
@AllArgsConstructor
public class OrderPicture {
    @TableField("picture_id")
    private Integer pictureId;

    @TableField("order_id")
    private Integer orderId;

    private String size;

    private Integer copies;

    private Integer status;
}
