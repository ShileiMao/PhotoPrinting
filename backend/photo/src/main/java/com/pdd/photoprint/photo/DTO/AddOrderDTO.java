package com.pdd.photoprint.photo.DTO;

import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.Packaging;
import com.pdd.photoprint.photo.Configs.PhotoSize;
import io.swagger.models.auth.In;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddOrderDTO {
    private Integer id;

    private String pddOrderNumber;

    private Integer numPhotos;

    private OrderStatus status;

    private Integer postAddr; // address 外键
    private String address;

    private String addressDetails;

    private String title;

    private String description;

    private PhotoSize photoSize;

    private Packaging packaging;

    private String phoneNumber;
}
