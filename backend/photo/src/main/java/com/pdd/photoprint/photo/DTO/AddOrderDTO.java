package com.pdd.photoprint.photo.DTO;

import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.Packaging;
import com.pdd.photoprint.photo.Configs.PhotoSize;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddOrderDTO {
    private String pddOrderNumber;

    private Integer numPhotos;

    private OrderStatus status;

    private String address;

    private String addressDetails;

    private String title;

    private String description;

    private PhotoSize photoSize;

    private Packaging packaging;

}
