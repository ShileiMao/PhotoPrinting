package com.pdd.photoprint.photo.VO;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;


@Getter
@Setter
public class PrintPhotoSummary {
    @TableField("pdd_order_number")
    String pddOrderNumber;

    @TableField("picture_id")
    Integer pictureId;

    String picName;

    @TableField("src")
    String src;

    @TableField("copies")
    Integer copies;

    String size;

    Integer status;

    Integer width;

    Integer height;
}
