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

@Data
@Getter
@Setter
@TableName("pictures")
public class Pictures {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String name;

    private String description;

    // location on the system
    private String location;

    private Integer width;

    private Integer height;
}
