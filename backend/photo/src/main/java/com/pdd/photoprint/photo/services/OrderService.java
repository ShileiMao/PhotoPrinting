package com.pdd.photoprint.photo.services;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import com.pdd.photoprint.photo.model.Orders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class OrderService extends ServiceImpl<OrderMapper, Orders> {
    private OrderMapper orderMapper;

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    public OrderMapper getOrderMapper() {
        return orderMapper;
    }

    public PageInfo<PddOrderSummary> queryOrderPage(Integer page,
                                                    Integer pageSize,
                                                    Integer orderStatus,
                                                    String orderBy,
                                                    boolean desc,
                                                    String searchText,
                                                    String startDate,
                                                    String endDate) {

        PageHelper.startPage(page, pageSize);
        List<PddOrderSummary> orderSummaryList = orderMapper.queryOrderPage(orderStatus, orderBy, desc, searchText, startDate, endDate);
        return PageInfo.of(orderSummaryList);
    }


}
