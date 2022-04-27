package com.pdd.photoprint.photo.Utils;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.DTO.AddOrderDTO;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.PostAddrMapper;
import com.pdd.photoprint.photo.model.Orders;
import com.pdd.photoprint.photo.model.PostAddr;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Component
public class OrderHelper {
    private OrderMapper orderMapper;

    private PostAddrMapper postAddrMapper;

    public OrderHelper(OrderMapper orderMapper, PostAddrMapper postAddrMapper) {
        this.orderMapper = orderMapper;
        this.postAddrMapper = postAddrMapper;
    }

    public RestResponse basicOrderInfoVerify(String orderNumber) {
        RestResponse response = new RestResponse();

        PddOrderSummary orderSummary = orderMapper.queryOrderByNumber(orderNumber);
        if(orderSummary == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("订单不存在，请重试!");
            return response;
        }

        if(orderSummary.getStatus() >= OrderStatus.COLLECTED.getValue()) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("订单状态失效");
            return response;
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        return response;
    }

    public RestResponse addOrder(AddOrderDTO addOrderDTO) {

        QueryWrapper<Orders> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Orders::getPddOrderNumber, addOrderDTO.getPddOrderNumber());

        RestResponse response = new RestResponse();
        Orders order = orderMapper.selectOne(queryWrapper);
        if(order != null) {
            response.setError("订单已存在，不可重复添加！");
            return response;
        }

        PostAddr postAddr = new PostAddr();
        postAddr.setAddress(addOrderDTO.getAddress());
        postAddr.setAddrDetails(addOrderDTO.getAddressDetails());

        this.postAddrMapper.insert(postAddr);


        Orders newOrder = new Orders();
        copyOrderProperties(addOrderDTO, newOrder);
        newOrder.setPostAddr(postAddr.getId());
        newOrder.setPhoneNumber(addOrderDTO.getPhoneNumber());

        this.orderMapper.insert(newOrder);

        response.setMessage("成功！");
        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }


    public RestResponse editOrder(AddOrderDTO addOrderDTO) {
        RestResponse response = new RestResponse();
        Orders order = orderMapper.selectById(addOrderDTO.getId());
        if(order == null) {
            response.setError("订单不存在，请重试");
            return response;
        }

        boolean createAddress = true;
        Integer postAddressId = -1;
        if(addOrderDTO.getPostAddr() > 0) {
            PostAddr postAddr = this.postAddrMapper.selectById(addOrderDTO.getPostAddr());
            if (postAddr != null) {
                postAddr.setAddress(addOrderDTO.getAddress());
                postAddr.setAddrDetails(addOrderDTO.getAddressDetails());

                this.postAddrMapper.updateById(postAddr);
                postAddressId = postAddr.getId();
                createAddress = false;
            }
        }

        if(createAddress) {
            PostAddr postAddr = new PostAddr();
            postAddr.setAddress(addOrderDTO.getAddress());
            postAddr.setAddrDetails(addOrderDTO.getAddressDetails());
            this.postAddrMapper.insert(postAddr);

            postAddressId = postAddr.getId();
        }

        copyOrderProperties(addOrderDTO, order);
        order.setPhoneNumber(addOrderDTO.getPhoneNumber());
        order.setPostAddr(postAddressId);

        this.orderMapper.updateById(order);

        response.setMessage("成功！");
        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }

    public RestResponse validateAddOrderFields(AddOrderDTO addOrderDTO) {
        RestResponse response = new RestResponse();
        if(StringUtils.isEmpty(addOrderDTO.getPddOrderNumber())) {
            response.setError("请输入订单号");
            return response;
        }

        if(StringUtils.isEmpty(addOrderDTO.getUserName())) {
            response.setError("请输入用户名");
            return response;
        }

        if(addOrderDTO.getNumPhotos() <= 0) {
            response.setError("请输入照片数量");
            return response;
        }

        if(addOrderDTO.getStatus() == null) {
            response.setError("请选择订单状态");
            return response;
        }

        if(StringUtils.isEmpty(addOrderDTO.getAddress())) {
            response.setError("请输入邮寄地址");
            return response;
        }

        if(StringUtils.isEmpty(addOrderDTO.getAddressDetails())) {
            response.setError("请输入邮寄地址");
            return response;
        }

        if(StringUtils.isEmpty(addOrderDTO.getTitle())) {
            response.setError("请输入标题");
            return response;
        }

        if(addOrderDTO.getPhotoSize() == null) {
            response.setError("请选择照片尺寸");
            return response;
        }

        if(StringUtils.isEmpty(addOrderDTO.getPhoneNumber())) {
            response.setError("请输入电话号码");
            return response;
        }
        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }

    public void copyOrderProperties(AddOrderDTO addOrderDTO, Orders newOrder) {
        newOrder.setPddOrderNumber(addOrderDTO.getPddOrderNumber());
        newOrder.setTitle(addOrderDTO.getTitle());
        newOrder.setUserName(addOrderDTO.getUserName());
        newOrder.setDescription(addOrderDTO.getDescription());
        newOrder.setNumPhotos(addOrderDTO.getNumPhotos());
        newOrder.setPhotoSize(addOrderDTO.getPhotoSize().getValue());
        newOrder.setPackaging(addOrderDTO.getPackaging().getValue());
        newOrder.setStatus(addOrderDTO.getStatus().getValue());
        newOrder.setPhoneNumber(addOrderDTO.getPhoneNumber());
    }
}
