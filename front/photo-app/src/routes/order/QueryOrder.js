import React, { useState } from 'react'
import { apiPost, apiGet } from '../../utils/apiHelper';
import { get } from '../../utils/axios';
import myLogger from '../../utils/logger'
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { storeToken } from '../../utils/token';
import TOKEN_KEYS from '../../utils/consts';
import '../../style/QueryOrder.css'

export const QueryOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSummary, setOrderSummary] = useState({});

  let navigate = useNavigate();

  const updateOrder = (e) => {
      console.log("value changed: " + e.target.value);
      setOrderNumber(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    let response = await get("/pdd/queryOrder", {order_number: orderNumber})
    myLogger.debug("query Order: %s", JSON.stringify(response));

    setOrderSummary(response);

    if(response != null) {
      storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
      storeToken(TOKEN_KEYS.USER_TYPE, response.userType);
      storeToken(TOKEN_KEYS.USER_LOGIN, response.pddOrderNumber);
      navigate("/queryOrder/" + orderNumber); 
    }
  }

  return (
    <div className='center-page'>
      <div class="card border-secondary mb-3">
        <div class="card-header">订单查询</div>
        <div class="card-body">
          <h4 class="card-title">输入订单号</h4>
          <div className='input-group mb-3'>
            <input className='form-control' placeholder='输入订单号' type="text" value={orderNumber} onChange={updateOrder}></input>
            <button className='btn btn-primary' onClick={handleSubmit}>提交</button>
          </div>
        </div>
      </div>
    </div>
  )
}
