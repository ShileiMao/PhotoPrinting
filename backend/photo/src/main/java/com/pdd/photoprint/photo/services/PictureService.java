package com.pdd.photoprint.photo.services;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Storage.StorageService;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.OrderPictureMapper;
import com.pdd.photoprint.photo.mapper.PictureMapper;
import com.pdd.photoprint.photo.model.OrderPicture;
import com.pdd.photoprint.photo.model.Pictures;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PictureService {
    private PictureMapper pictureMapper;

    private OrderPictureMapper orderPictureMapper;

    private OrderMapper orderMapper;


    private StorageService storageService;

    @Autowired
    public void setPictureMapper(PictureMapper pictureMapper) {
        this.pictureMapper = pictureMapper;
    }

    @Autowired
    public void setOrderPictureMapper(OrderPictureMapper orderPictureMapper) {
        this.orderPictureMapper = orderPictureMapper;
    }

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Autowired
    public void setStorageService(StorageService storageService) {
        this.storageService = storageService;
    }

    public RestResponse deleteOrderPictures(String orderNumber, boolean force) {
        RestResponse response = new RestResponse();
        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        QueryWrapper<OrderPicture> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(OrderPicture::getOrderId, orderSummary.getId());
        List<OrderPicture> orderPictures = orderPictureMapper.selectList(queryWrapper);

        if((orderPictures == null || orderPictures.isEmpty()) && !force) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片不存在");
            return response;
        }
        orderPictureMapper.delete(queryWrapper);

        for(OrderPicture orderPicture : orderPictures) {
            response = deletePicture(orderPicture.getPictureId());
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }

    public RestResponse deletOrderPicture(Integer id, String orderNumber) {
        RestResponse response = new RestResponse();

        // get order summary
        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        // query order picture record
        QueryWrapper<OrderPicture> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(OrderPicture::getPictureId, id);
        queryWrapper.lambda().eq(OrderPicture::getOrderId, orderSummary.getId());

        OrderPicture orderPicture = orderPictureMapper.selectOne(queryWrapper);

        // check if this picture still in use
        if(orderPicture == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片不存在");
            return response;
        }

        orderPictureMapper.delete(queryWrapper);

        return deletePicture(id);
    }

    public RestResponse deletePicture(Integer id) {
        RestResponse response = new RestResponse();

        Pictures picture = pictureMapper.selectById(id);
        if(picture == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片不存在");
            return response;
        }

        pictureMapper.deleteById(id);

        String location = picture.getLocation();
        if(this.storageService.fileExists("", location) && !this.storageService.delete("", location)) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("删除失败！");
            return response;
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setError("成功");
        return response;
    }
}
