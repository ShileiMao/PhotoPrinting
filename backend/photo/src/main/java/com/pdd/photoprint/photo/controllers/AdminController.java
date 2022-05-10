package com.pdd.photoprint.photo.controllers;

import ch.qos.logback.classic.net.SyslogAppender;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.github.pagehelper.PageInfo;
import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.Configs.UserLoginType;
import com.pdd.photoprint.photo.Configs.UserType;
import com.pdd.photoprint.photo.DTO.AddOrderDTO;
import com.pdd.photoprint.photo.DTO.ChangePwdDTO;
import com.pdd.photoprint.photo.DTO.LoginDetails;
import com.pdd.photoprint.photo.Utils.AccessTokenGenerator;
import com.pdd.photoprint.photo.Utils.DateHelper;
import com.pdd.photoprint.photo.Utils.OrderHelper;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.ResponseUserDetails;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.PostAddrMapper;
import com.pdd.photoprint.photo.mapper.UserAccessTokenMapper;
import com.pdd.photoprint.photo.mapper.UserMapper;
import com.pdd.photoprint.photo.model.Orders;
import com.pdd.photoprint.photo.model.UserDO;
import com.pdd.photoprint.photo.model.Users;
import com.pdd.photoprint.photo.services.OrderService;
import com.pdd.photoprint.photo.services.PictureService;
import org.apache.catalina.User;
import org.apache.catalina.valves.JDBCAccessLogValve;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private HttpSession httpSession;

    private UserMapper userMapper;

    private UserAccessTokenMapper userAccessTokenMapper;

//    private OrderMapper orderMapper;

    private PostAddrMapper postAddrMapper;

    Logger logger = LoggerFactory.getLogger(AdminController.class);

    private OrderService orderService;

    private PictureService pictureService;

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

    @Autowired
    public void setPictureService(PictureService pictureService) {
        this.pictureService = pictureService;
    }

    @PostMapping("/login")
    public RestResponse login(@RequestBody LoginDetails loginDetails) throws NoSuchAlgorithmException {

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

        return refreshUserToken(this.httpSession, response, user, loginDetails.getUserName());
    }

    @PostMapping("/logout")
    public RestResponse logout(@RequestBody LoginDetails loginDetails) throws NoSuchAlgorithmException {

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
            response.setError("退出失败，请检查用户名/密码");
            return response;
        }

        httpSession.removeAttribute("user_login");
        httpSession.removeAttribute("access_token");
        httpSession.removeAttribute("user_type");
        httpSession.invalidate();

        response.setMessage("成功!");
        return response;
    }

    @PostMapping("/changePwd")
    public RestResponse changePwd(@RequestBody ChangePwdDTO changePwdDTO, HttpServletRequest request) throws NoSuchAlgorithmException {

        RestResponse response = checkChangePwdDetails(changePwdDTO);
        if(!response.checkResponse()) {
            return response;
        }

        QueryWrapper<Users> wrapper = new QueryWrapper<>();
        wrapper.lambda().eq(Users::getLoginName, changePwdDTO.getUserName());
        wrapper.lambda().eq(Users::getAllowLogin, 1);
        wrapper.lambda().eq(Users::getLoginType, UserLoginType.USER_NAME_PWD.getType());
        wrapper.lambda().eq(Users::getPwd, changePwdDTO.getCurrPwd());

        Users user = userMapper.selectOne(wrapper);
        if(user == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("操作失败，请检查密码");
            return response;
        }

        user.setPwd(changePwdDTO.getNewPwd());
        userMapper.updateById(user);

        return refreshUserToken(request.getSession(), response, user, changePwdDTO.getUserName());
    }

    @PostMapping("/createUser")
    public RestResponse createUser(@RequestBody UserDO userDO) {
        RestResponse response = new RestResponse();

        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Users::getLoginName, userDO.getLoginName());

        Users existingUser = userMapper.selectOne(queryWrapper);
        if(existingUser != null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("用户已存在");
            return response;
        }

        if(StringUtils.isEmpty(userDO.getPwd())) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("请输入密码");
            return response;
        }

        Users user = new Users();
        BeanUtils.copyProperties(userDO, user);
        userMapper.insert(user);

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setData(user);
        return response;
    }

    @GetMapping("/getUsers")
    public RestResponse getUsers(@RequestParam(required = false) Integer userId, @RequestParam(required = false) String loginName) {
        RestResponse response = new RestResponse();
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();

        if(userId != null && loginName != null) {

            queryWrapper.lambda().eq(Users::getLoginName, loginName);
            queryWrapper.lambda().eq(Users::getId, userId);

            Users user = userMapper.selectOne(queryWrapper);

            if(user == null) {
                response.setStatus(RestRepStatus.ERROR.name());
                response.setError("用户不存在");
                return response;
            }

            response.setStatus(RestRepStatus.SUCCESS.name());
            response.setData(user);
            return response;
        }

        List<Users> users = userMapper.selectList(queryWrapper);
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setData(users);
        return response;
    }

    @DeleteMapping("/deleteUser")
    public RestResponse deleteUsers(@RequestParam Integer userId, @RequestParam String loginName) {
        RestResponse response = new RestResponse();

        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Users::getLoginName, loginName);
        queryWrapper.lambda().eq(Users::getId, userId);

        Users user = userMapper.selectOne(queryWrapper);

        if(user == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("用户不存在");
            return response;
        }

        userMapper.deleteById(user.getId());
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setData("操作成功");
        return response;
    }

    private RestResponse refreshUserToken(HttpSession session, RestResponse response, Users user, String userName) throws NoSuchAlgorithmException {
        String accessToken = AccessTokenGenerator.refreshUserAccessToken(user, userName, userAccessTokenMapper);

        if(this.httpSession == session) {
            System.out.print("same session");
        }
        session.setAttribute("user_login", userName);
        session.setAttribute("access_token", accessToken);
        session.setAttribute("user_type", user.getUserType());

        ResponseUserDetails userDetails = new ResponseUserDetails();
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

    private RestResponse checkChangePwdDetails(ChangePwdDTO changePwdDTO) {
        RestResponse response = new RestResponse();
        if(StringUtils.isEmpty(changePwdDTO.getUserName()) || StringUtils.isEmpty(changePwdDTO.getCurrPwd()) || StringUtils.isEmpty(changePwdDTO.getCurrPwd())) {
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
                                       @RequestParam(value = "startDate", required = false) String startDate,
                                       @RequestParam(value = "endDate", required = false) String endDate) {
        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        System.out.println("order status: " + orderStatus);
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

    @DeleteMapping("/order/delete")
    public RestResponse deleteOrders(@RequestBody List<PddOrderSummary> orderList) {
        List<Integer> orderIds = new ArrayList<>();
        for(PddOrderSummary orderSummary : orderList) {
            orderIds.add(orderSummary.getId());
            RestResponse response = pictureService.deleteOrderPictures(orderSummary.getPddOrderNumber(), true);
            if(!response.checkResponse()) {
                return response;
            }
        }

        orderService.getOrderMapper().deleteOrders(orderIds);

        RestResponse response = new RestResponse();
        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
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

    @PutMapping("/order/{orderNumber}/status/{status}")
    public RestResponse editOrderStatus(@PathVariable(name = "orderNumber") String orderNumber, @PathVariable(name = "status") OrderStatus status) {
        RestResponse response = new RestResponse();
        QueryWrapper<Orders> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Orders::getPddOrderNumber, orderNumber);

        Orders order = this.orderService.getOrderMapper().selectOne(queryWrapper);
        if(order == null) {
            response.setStatus(RestRepStatus.ERROR.name());
            response.setError("订单不存在");
            return response;
        }

        order.setStatus(status.getValue());
        this.orderService.getOrderMapper().updateById(order);

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        return response;
    }

    @PutMapping("/order/status/multiple")
    public RestResponse editOrderStatusMultiple(@RequestBody List<Orders> orders) {
        RestResponse response = new RestResponse();
        List<Integer> orderIds = orders.stream().map(item -> item.getId()).collect(Collectors.toList());
        List<Orders> dbOrders = this.orderService.getOrderMapper().queryOrdersInList(orderIds);
        dbOrders.forEach(item -> {
            Orders order = orders.stream().filter(tempOrder -> Objects.equals(tempOrder.getId(), item.getId())).findFirst().get();
            if(order != null && order.getStatus() == OrderStatus.FINISH.getValue()) {
                item.setDateComplete(new Date()); // 填写结束时间
            }
            item.setStatus(order.getStatus());
        });

        boolean success = this.orderService.updateBatchById(dbOrders);
        if(success) {
            response.setStatus(RestRepStatus.SUCCESS.name());
            response.setMessage("成功");
            return response;
        }

        response.setStatus(RestRepStatus.ERROR.name());
        response.setError("修改状态失败");
        return response;
    }


    @GetMapping("/queryOrder")
    RestResponse queryOrder(@RequestParam("order_number") String orderNumber) throws NoSuchAlgorithmException {
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


    @PostMapping("/checkFinishedOrders")
    RestResponse invalidateFinishedOrders() {
        RestResponse response = new RestResponse();

        QueryWrapper<Orders> queryWrapper = new QueryWrapper<>();
        queryWrapper.lambda().eq(Orders::getStatus, OrderStatus.FINISH.getValue());

        List<Orders> orders = orderService.getOrderMapper().selectList(queryWrapper);
        for(Orders order : orders) {

            if(order.getDateComplete() != null) {
                long diff = new Date().getTime() - order.getDateComplete().getTime();
                long days = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
                if(days > 7) {
                    order.setStatus(OrderStatus.INVALID.getValue());
                    order.setDateDelete(new Date());

                    orderService.getOrderMapper().updateById(order);
                }
            }
        }

        response.setStatus(RestRepStatus.SUCCESS.name());
        response.setMessage("成功");
        return response;
    }
}
