package com.pdd.photoprint.photo.controllers;

import com.pdd.photoprint.photo.Configs.*;
import com.pdd.photoprint.photo.DTO.AddOrderDTO;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.Utils.DateHelper;
import com.pdd.photoprint.photo.Utils.OrderHelper;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.PostAddrMapper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.mapper.UserMapper;
import com.pdd.photoprint.photo.model.UserAccessToken;
import com.pdd.photoprint.photo.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.util.DateUtils;

import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;

@RestController
@RequestMapping("/pdd")
public class PddQueryController {
    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserAccessTokenMapper userAccessTokenMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PostAddrMapper postAddrMapper;

    @GetMapping("/queryOrder")
    RestResponse queryOrder(@RequestParam("order_number") String orderNumber, HttpSession session) throws NoSuchAlgorithmException {

        RestResponse response = new RestResponse();

        PddOrderSummary summary = orderMapper.queryOrderByNumber(orderNumber);
        if(summary != null && summary.getStatus() < OrderStatus.FINISH.getValue()) {
            response.setStatus(RestRepStatus.SUCCESS.name());
            response.setMessage("成功!");
            response.setData(summary);

//            String accessToken = AccessTokenGenerator.generateAccessToken("anonymous_user", userAccessTokenMapper);
//            summary.setAccessToken(accessToken);
            return response;
        }

        AddOrderDTO addOrderDTO = new AddOrderDTO();

        int defaultCopies = 100;
        addOrderDTO.setPddOrderNumber(orderNumber);
        addOrderDTO.setNumPhotos(defaultCopies);
        addOrderDTO.setStatus(OrderStatus.UNPROVED);
        addOrderDTO.setAddress("待补充");
        addOrderDTO.setAddressDetails("待补充");
        addOrderDTO.setTitle("打印照片" + defaultCopies + "张");
        addOrderDTO.setUserName(orderNumber);
        addOrderDTO.setDescription("待填入");
        addOrderDTO.setPhotoSize(PhotoSize.DEFAULT);
        addOrderDTO.setPackaging(Packaging.DEFAULT);
        addOrderDTO.setPhoneNumber("");

        response = addOrder(addOrderDTO, true);

        // 如果订单不存在，则添加默认订单
        if(response.checkResponse()) {
            summary = orderMapper.queryOrderByNumber(orderNumber);
            if(summary != null && summary.getStatus() < OrderStatus.FINISH.getValue()) {
                response.setStatus(RestRepStatus.SUCCESS.name());
                response.setMessage("成功!");
                response.setData(summary);

                return response;
            }
        }


        // TODO: query from pdd
        response.setError("订单信息不存在，请检查订单号，或尝试录入新订单？");
        return response;
    }


    @PostMapping("/order/add")
    public RestResponse addOrder(@RequestBody AddOrderDTO addOrderDTO, boolean ignorePhoneNumber) {
        OrderHelper orderHelper = new OrderHelper(this.orderMapper, this.postAddrMapper);
        RestResponse response = orderHelper.validateAddOrderFields(addOrderDTO, ignorePhoneNumber);
        if(!response.checkResponse()) {
            return response;
        }
        response = orderHelper.addOrder(addOrderDTO);
        return response;
    }

    @PostMapping("/order/edit")
    public RestResponse editOrder(@RequestBody AddOrderDTO addOrderDTO) {
        OrderHelper orderHelper = new OrderHelper(this.orderMapper, this.postAddrMapper);
        RestResponse response = orderHelper.validateAddOrderFields(addOrderDTO, false);
        if(!response.checkResponse()) {
            return response;
        }

        response = orderHelper.editOrder(addOrderDTO);

        return response;
    }

//    private Users guaranteeUser(String orderNumber) {
//        Users user = userMapper.queryAnonymousUserByLoginName(orderNumber);
//        if(user == null) {
//            user = new Users("匿名用户", orderNumber, UserLoginType.ANONYMOUS, UserType.ANONYMOUS, false);
//            userMapper.insert(user);
//        }
//
//        return user;
//    }
}
