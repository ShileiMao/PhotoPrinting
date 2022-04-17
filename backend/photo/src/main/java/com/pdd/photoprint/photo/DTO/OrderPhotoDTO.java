package com.pdd.photoprint.photo.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPhotoDTO {
    Integer pictureId;
    Integer orderId;
    Integer copies;
    String size;
    Integer status;
}
