package com.pdd.photoprint.photo.controllers;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import com.pdd.photoprint.photo.DTO.LoginDetails;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.ResponseUserDetails;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.mapper.UserMapper;
import com.pdd.photoprint.photo.model.Users;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        response.setData(orderSummaryList);
        return response;
    }
}
