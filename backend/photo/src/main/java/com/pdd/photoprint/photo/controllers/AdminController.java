package com.pdd.photoprint.photo.controllers;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import com.pdd.photoprint.photo.DTO.AddOrderDTO;
import com.pdd.photoprint.photo.DTO.LoginDetails;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.ResponseUserDetails;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.PostAddrMapper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.mapper.UserMapper;
import com.pdd.photoprint.photo.model.Orders;
import com.pdd.photoprint.photo.model.PostAddr;
import com.pdd.photoprint.photo.model.Users;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private UserMapper userMapper;

    private UserAccessTokenMapper userAccessTokenMapper;

    private OrderMapper orderMapper;

    private PostAddrMapper postAddrMapper;

    Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Autowired
    public void setUserAccessTokenMapper(UserAccessTokenMapper userAccessTokenMapper) {
        this.userAccessTokenMapper = userAccessTokenMapper;
    }

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Autowired
    public void setPostAddrMapper(PostAddrMapper postAddrMapper) {
        this.postAddrMapper = postAddrMapper;
    }

    @PostMapping("/login")
    public RestResponse login(@RequestBody LoginDetails loginDetails, HttpSession session) throws NoSuchAlgorithmException {

        logger.info("user login");
        RestResponse response = checkLoginDetails(loginDetails);
        if(!response.checkResponse()) {
            return response;
        }

        QueryWrapper<Users> wrapper = new QueryWrapper<>();
        wrapper.lambda().eq(Users::getLoginName, loginDetails.getUserName());
        wrapper.lambda().eq(Users::getAllowLogin, 1);
        wrapper.lambda().eq(Users::getLoginType, UserLoginType.USER_NAME_PWD.getType());
        wrapper.lambda().eq(Users::getPwd, loginDetails.getPwd());

        Users user = userMapper.selectOne(wrapper);
        if(user == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("登陆失败，请检查用户名/密码");
            return response;
        }

        String accessToken = AccessTokenGenerator.refreshUserAccessToken(user, loginDetails.getUserName(), userAccessTokenMapper);

        session.setAttribute("user_login", loginDetails.getUserName());
        session.setAttribute("access_token", accessToken);
        session.setAttribute("user_type", user.getUserType());

        ResponseUserDetails  userDetails = new ResponseUserDetails();
        userDetails.setLoginName(user.getLoginName());
        userDetails.setUserType(user.getUserType());
        userDetails.setLoginType(user.getLoginType());

        response.setMessage("成功!");
        response.setData(userDetails);
        response.setAccessToken(accessToken);
        return response;
    }

    private RestResponse checkLoginDetails(LoginDetails loginDetails) {
        RestResponse response = new RestResponse();
        if(StringUtils.isEmpty(loginDetails.getUserName()) || StringUtils.isEmpty(loginDetails.getPwd())) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("用户名或密码为空!");
            return response;
        }
        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }

    @GetMapping("/orders/all")
    public RestResponse queryAllOrders(@RequestParam(value = "pddOrderNumber", required = false) String pddOrderNumber,
                                       @RequestParam(value = "orderStatus", required = false) Integer orderStatus,
                                       @RequestParam(value = "startDate", required = false) Date startDate,
                                       @RequestParam(value = "endDate", required = false) Date endDate) {

        List<PddOrderSummary> orderSummaryList = orderMapper.queryOrder(pddOrderNumber, orderStatus);

        for (PddOrderSummary order: orderSummaryList) {
            order.dbToRedableStatus();
        }

        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        response.setData(orderSummaryList);
        return response;
    }

    @PostMapping("/order/add")
    public RestResponse addOrder(@RequestBody AddOrderDTO addOrderDTO) {
        RestResponse response = validateAddOrderFields(addOrderDTO);
        if(!response.checkResponse()) {
            return response;
        }

        QueryWrapper<Orders> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Orders::getPddOrderNumber, addOrderDTO.getPddOrderNumber());

        response = new RestResponse();
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
        newOrder.setPddOrderNumber(addOrderDTO.getPddOrderNumber());
        newOrder.setStatus(addOrderDTO.getStatus().getValue());
        newOrder.setTitle(addOrderDTO.getTitle());
        newOrder.setDescription(addOrderDTO.getDescription());
        newOrder.setNumPhotos(addOrderDTO.getNumPhotos());
        newOrder.setPhotoSize(addOrderDTO.getPhotoSize().getValue());
        newOrder.setPackaging(addOrderDTO.getPackaging().getValue());
        newOrder.setPostAddr(postAddr.getId());

        this.orderMapper.insert(newOrder);

        response.setMessage("成功！");
        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }

    private RestResponse validateAddOrderFields(AddOrderDTO addOrderDTO) {
        RestResponse response = new RestResponse();
        if(StringUtils.isEmpty(addOrderDTO.getPddOrderNumber())) {
            response.setError("请输入订单号");
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

        response.setStatus(RestRepStatus.SUCCESS.name());
        return response;
    }
}
