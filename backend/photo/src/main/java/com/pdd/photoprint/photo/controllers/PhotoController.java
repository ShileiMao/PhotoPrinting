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
import com.pdd.photoprint.photo.model.OrderPicture;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class PhotoController {
    @Autowired
    private OrderPictureMapper orderPictureMapper;

    @Autowired
    private PictureMapper pictureMapper;

    @Autowired
    private OrderMapper orderMapper;

//    private OrderHelper orderHelper;

    @Value("${serverDomain}")
    private String serverBaseUrl;

    @GetMapping("/{orderNumber}/photos")
    public RestResponse getOrderPhotos(@PathVariable String orderNumber) {
        RestResponse response = new RestResponse();


        OrderHelper orderHelper =  new OrderHelper(orderMapper);
        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(response.getStatus().equals(RestRepStatus.ERROR.name())) {
            return response;
        }

        List<PrintPhotoSummary> printPhotoSummary = orderPictureMapper.queryPicturesOfOrder(orderNumber, serverBaseUrl + "/files/download");
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        response.setData(printPhotoSummary);

        return response;
    }

    @PutMapping("/{orderNumber}/photos/{photoId}/editCopies/{numCopies}")
    public RestResponse editCopieNumber(@PathVariable String orderNumber, @PathVariable Integer photoId, @PathVariable Integer numCopies) {
        RestResponse response = new RestResponse();

        OrderHelper orderHelper = new OrderHelper(orderMapper);
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

        OrderHelper orderHelper =  new OrderHelper(orderMapper);

        response = orderHelper.basicOrderInfoVerify(orderNumber);
        if(response.getStatus().equals(RestRepStatus.ERROR.name())) {
            return response;
        }

        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);

        QueryWrapper<OrderPicture> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(OrderPicture::getPictureId, photoId);
        queryWrapper.lambda().eq(OrderPicture::getOrderId, orderSummary.getId());

        OrderPicture orderPicture = orderPictureMapper.selectOne(queryWrapper);
        if(orderPicture == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("照片不存在");
            return response;
        }

        orderPictureMapper.delete(queryWrapper);

        OrderPicture orderPicture1 = orderPictureMapper.selectOne(queryWrapper);
        if(orderPicture1 == null) {
            System.out.println("照片已不再使用，删除: " + photoId);
            pictureMapper.deleteById(photoId);
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功!");
        return response;
    }
}
