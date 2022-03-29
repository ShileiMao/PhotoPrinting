package com.pdd.photoprint.photo.controllers;

import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.Utils.DateHelper;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.mapper.UserMapper;
import com.pdd.photoprint.photo.model.UserAccessToken;
import com.pdd.photoprint.photo.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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


    @GetMapping("/queryOrder")
    PddOrderSummary queryOrder(@RequestParam("order_number") String orderNumber, HttpSession session) throws NoSuchAlgorithmException {

        PddOrderSummary summary = orderMapper.queryOrderByNumber(orderNumber);
        if(summary != null) {
            Users user = guaranteeUser(orderNumber);
            String accessToken = AccessTokenGenerator.refreshUserAccessToken(user, orderNumber, userAccessTokenMapper);

            summary.dbToRedableStatus();
            System.out.println("access token: " + accessToken);

            session.setAttribute("user_login", orderNumber);
            session.setAttribute("access_token", accessToken);
            session.setAttribute("user_type", UserType.ANONYMOUS.getType());

            summary.setUserType(UserType.ANONYMOUS.getType());
            summary.setAccessToken(accessToken);
            return summary;
        }
        // TODO: query from pdd
        return null;
    }

    private Users guaranteeUser(String orderNumber) {
        Users user = userMapper.queryAnonymousUserByLoginName(orderNumber);
        if(user == null) {
            user = new Users("匿名用户", orderNumber, UserLoginType.ANONYMOUS, UserType.ANONYMOUS, false);
            userMapper.insert(user);
        }

        return user;
    }
}
