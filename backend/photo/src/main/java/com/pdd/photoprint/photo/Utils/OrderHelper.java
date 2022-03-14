package com.pdd.photoprint.photo.Utils;

import com.pdd.photoprint.photo.Configs.OrderStatus;
import com.pdd.photoprint.photo.Configs.RestRepStatus;
import com.pdd.photoprint.photo.VO.PddOrderSummary;
import com.pdd.photoprint.photo.VO.RestResponse;
import com.pdd.photoprint.photo.mapper.OrderMapper;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class OrderHelper {
    private OrderMapper orderMapper;

    public OrderHelper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
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
}
