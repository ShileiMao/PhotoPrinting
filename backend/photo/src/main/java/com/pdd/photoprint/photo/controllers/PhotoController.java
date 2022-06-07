package com.pdd.photoprint.photo.controllers;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Utils.OrderHelper;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.PrintPhotoSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.OrderPictureMapper;
import com.pdd.photoprint.photo.mapper.PictureMapper;
import com.pdd.photoprint.photo.mapper.PostAddrMapper;
import com.pdd.photoprint.photo.model.OrderPicture;
import com.pdd.photoprint.photo.services.PictureService;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletRequest;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/orders")
public class PhotoController {
    @Autowired
    private OrderPictureMapper orderPictureMapper;

    @Autowired
    private PictureMapper pictureMapper;

    @Autowired
    private OrderMapper orderMapper;

    private PictureService pictureService;

    @Autowired
    PostAddrMapper postAddrMapper;

    @Autowired
    public void setPictureService(PictureService pictureService) {
        this.pictureService = pictureService;
    }
//    private OrderHelper orderHelper;

    @GetMapping("/{orderNumber}/photos")
    public RestResponse getOrderPhotos(@PathVariable String orderNumber) {
        RestResponse response = new RestResponse();

        OrderHelper orderHelper =  new OrderHelper(orderMapper, postAddrMapper);
        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(response.getStatus().equals(RestRepStatus.ERROR.name())) {
            return response;
        }

        List<PrintPhotoSummary> printPhotoSummary = orderPictureMapper.queryPicturesOfOrder(orderNumber,"/files/download");
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        response.setData(printPhotoSummary);

        return response;
    }

    @PutMapping("/{orderNumber}/photos/{photoId}/editStatus/{status}")
    public RestResponse editOrderPhotoStatus(@PathVariable String orderNumber, @PathVariable Integer photoId, @PathVariable Integer status) {
        RestResponse response = new RestResponse();

        OrderHelper orderHelper = new OrderHelper(orderMapper, postAddrMapper);
        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(!response.checkResponse()) {
            return response;
        }

        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        orderPictureMapper.updateStatus(orderSummary.getId(), photoId, status);

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        return response;
    }

    @PutMapping("/{orderNumber}/photos/{photoId}/editCopies/{numCopies}")
    public RestResponse editCopieNumber(@PathVariable String orderNumber, @PathVariable Integer photoId, @PathVariable Integer numCopies) {
        RestResponse response = new RestResponse();

        OrderHelper orderHelper = new OrderHelper(orderMapper, postAddrMapper);
        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(!response.checkResponse()) {
            return response;
        }

        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        Integer totalCopies = orderPictureMapper.queryTotalPicturesExcept(orderNumber, photoId);
        if(totalCopies + numCopies > orderSummary.getNumPhotos()) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片数量超出最大值");
            return response;
        }

        orderPictureMapper.updateNumCopies(orderSummary.getId(), photoId, numCopies);

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        return response;
    }

    @DeleteMapping("/{orderNumber}/photos/{photoId}/delete")
    public RestResponse deletePhoto(@PathVariable String orderNumber, @PathVariable Integer photoId) {
        RestResponse response = new RestResponse();

        OrderHelper orderHelper =  new OrderHelper(orderMapper, postAddrMapper);

        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(response.getStatus().equals(RestRepStatus.ERROR.name())) {
            return response;
        }

        return pictureService.deletOrderPicture(photoId, orderNumber);
    }

    @DeleteMapping("/{orderNumber}/photos/deleteMultiple")
    public RestResponse deleteMultiplePhoto(@PathVariable("orderNumber") String orderNumber, @RequestBody String [] photoIds, ServletRequest request) {

        OrderHelper orderHelper;
        orderHelper = new OrderHelper(orderMapper, postAddrMapper);
        RestResponse response = orderHelper.basicOrderInfoVerify(orderNumber);

        if(Objects.equals(response.getStatus(), RestRepStatus.ERROR.name())) {
            return response;
        }
        if(photoIds.length == 0) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片id为空");
            return response;
        }

        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        QueryWrapper<OrderPicture> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().in(OrderPicture::getPictureId, photoIds);
        queryWrapper.lambda().eq(OrderPicture::getOrderId, orderSummary.getId());

        List<OrderPicture> orderPictures = orderPictureMapper.selectList(queryWrapper);
        if(orderPictures == null || orderPictures.isEmpty()) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片不存在");
            return response;
        }

        // 删除所有订单的照片
        orderPictureMapper.delete(queryWrapper);

        // 删除所有照片
        for(OrderPicture orderPicture : orderPictures) {
            response = pictureService.deletePicture(orderPicture.getPictureId());
            if(!response.checkResponse()) {
                return response;
            }
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功!");
        return response;
    }
}
