package com.pdd.photoprint.photo.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.model.Orders;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Repository
public interface OrderMapper extends BaseMapper<Orders> {
    PddOrderSummary queryOrderByNumber(String pddOrderNumber);

    List<PddOrderSummary> queryOrder(String pddOrderNumber, Integer orderStatus);
}
