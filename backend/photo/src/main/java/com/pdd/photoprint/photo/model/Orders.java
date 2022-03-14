package com.pdd.photoprint.photo.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Getter
@Setter
@Data
@TableName("orders")
public class Orders {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("pdd_order_number")
    private String pddOrderNumber;

    @TableField("date_create")
    private Date dateCreate;

    @TableField("date_complete")
    private Date dateComplete;

    @TableField("date_delete")
    private Date dateDelete;

    private Integer status;

    @TableField("post_addr")
    private Integer postAddr;

    @TableField("title")
    private String title;

    @TableField("description")
    private String description;


    @TableField("num_photos")
    private Integer numPhotos;
}
