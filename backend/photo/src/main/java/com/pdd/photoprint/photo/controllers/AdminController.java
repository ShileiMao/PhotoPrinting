package com.pdd.photoprint.photo.controllers;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.github.pagehelper.PageInfo;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import com.pdd.photoprint.photo.DTO.AddOrderDTO;
import com.pdd.photoprint.photo.DTO.LoginDetails;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.Utils.OrderHelper;
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
import com.pdd.photoprint.photo.services.OrderService;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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

//    private OrderMapper orderMapper;

    private PostAddrMapper postAddrMapper;

    Logger logger = LoggerFactory.getLogger(AdminController.class);

    private OrderService orderService;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Autowired
    public void setUserAccessTokenMapper(UserAccessTokenMapper userAccessTokenMapper) {
        this.userAccessTokenMapper = userAccessTokenMapper;
    }

//    @Autowired
//    public void setOrderMapper(OrderMapper orderMapper) {
//        this.orderMapper = orderMapper;
//    }

    @Autowired
    public void setPostAddrMapper(PostAddrMapper postAddrMapper) {
        this.postAddrMapper = postAddrMapper;
    }

    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
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

        List<PddOrderSummary> orderSummaryList = orderService.getOrderMapper().queryOrder(pddOrderNumber, orderStatus);

//        for (PddOrderSummary order: orderSummaryList) {
//            order.dbToRedableStatus();
//        }

        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        response.setData(orderSummaryList);
        return response;
    }

    @GetMapping("/orders/pageAll")
    public RestResponse queryAllOrders(@RequestParam(value = "pageIndex", required = false, defaultValue = "0") Integer page,
                                       @RequestParam(value = "pageSize", required = false, defaultValue = "10") Integer pageSize,
                                       @RequestParam(value = "orderStatus", required = false) Integer orderStatus,
                                       @RequestParam(value = "orderBy", required = false) String orderBy,
                                       @RequestParam(value = "desc", required = false) boolean desc,
                                       @RequestParam(value = "searchText", required = false) String searchText,
                                       @RequestParam(value = "startDate", required = false) Date startDate,
                                       @RequestParam(value = "endDate", required = false) Date endDate) {

        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");

        PageInfo<PddOrderSummary> orderSummaryList = orderService.queryOrderPage(page, pageSize, orderStatus, orderBy, desc, searchText, startDate, endDate);
        response.setData(orderSummaryList);

        return response;
    }

    @PostMapping("/order/add")
    public RestResponse addOrder(@RequestBody AddOrderDTO addOrderDTO) {
        OrderHelper orderHelper = new OrderHelper(this.orderService.getOrderMapper(), this.postAddrMapper);
        RestResponse response = orderHelper.validateAddOrderFields(addOrderDTO);
        if(!response.checkResponse()) {
            return response;
        }
        response = orderHelper.addOrder(addOrderDTO);
        return response;
    }

    @PostMapping("/order/edit")
    public RestResponse editOrder(@RequestBody AddOrderDTO addOrderDTO) {
        OrderHelper orderHelper = new OrderHelper(this.orderService.getOrderMapper(), this.postAddrMapper);
        RestResponse response = orderHelper.validateAddOrderFields(addOrderDTO);
        if(!response.checkResponse()) {
            return response;
        }

        response = orderHelper.editOrder(addOrderDTO);

        return response;
    }




    @GetMapping("/queryOrder")
    RestResponse queryOrder(@RequestParam("order_number") String orderNumber, HttpSession session) throws NoSuchAlgorithmException {
        RestResponse response = new RestResponse();
        PddOrderSummary summary = this.orderService.getOrderMapper().queryOrderByNumber(orderNumber);
        if(summary != null) {
//            summary.dbToRedableStatus();
            summary.setUserType(UserType.ANONYMOUS.getType());

            response.setStatus(RestRepStatus.SUCCESS.name());
            response.setData(summary);
            return response;
        }

        response.setError("订单信息不存在!");
        return response;
    }
}
