package com.pdd.photoprint.photo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pdd.photoprint.photo.VO.PrintPhotoSummary;
import com.pdd.photoprint.photo.model.OrderPicture;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface OrderPictureMapper extends BaseMapper<OrderPicture> {
    List<PrintPhotoSummary>queryPicturesOfOrder(String orderNumber, String baseUrl);
    List<PrintPhotoSummary>queryPicturesOfOrder1();
    void updateNumCopies(Integer orderId, Integer pictureId, Integer numCopies);

    void updateStatus(Integer orderId, Integer pictureId, Integer status);

    Integer queryTotalPictures(String orderNumber);
    Integer queryTotalPicturesExcept(String orderNumber, Integer pictureId);
}
