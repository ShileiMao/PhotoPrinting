import React, { useState } from 'react'
import { get } from '../../utils/axios';
import myLogger from '../../utils/logger'
import { Link, useNavigate } from 'react-router-dom';
import { storeToken } from '../../utils/token';
import TOKEN_KEYS from '../../utils/consts';
import '../../style/QueryOrder.css'
import { customerQueryOrder } from '../../utils/apiHelper'
import ToastHelper from '../../utils/toastHelper';

export const QueryOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSummary, setOrderSummary] = useState({});

  let navigate = useNavigate();

  const updateOrder = (e) => {
      console.log("value changed: " + e.target.value);
      setOrderNumber(e.target.value)
  }
  
  const handleSubmit = async (e) => {

    let response = await customerQueryOrder(orderNumber)

    if(response.status.toLowerCase() === 'success') {
      setOrderSummary(response.data);
      // storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken);
      // storeToken(TOKEN_KEYS.USER_TYPE, response.data.userType);
      // storeToken(TOKEN_KEYS.USER_LOGIN, response.data.pddOrderNumber);
      navigate("/order/" + orderNumber); 

      return;
    }

    if(response.status.toLowerCase() === 'error') {
      ToastHelper.showWarning(response.error);
    }
  }

  return (
    <div className='main'>
      <div className='container-fluid h-100 center-page'>
        <div className="card border-secondary mb-3">
          <div className="card-header">订单查询</div>
          <div className="card-body">
            <h4 className="card-title">输入订单号</h4>
            <div className='input-group mb-3'>
              <input className='form-control' placeholder='输入订单号' type="text" value={orderNumber} onChange={updateOrder}></input>
              <button className='btn btn-primary' onClick={handleSubmit}>提交</button>
            </div>
            <div className='justify-content-md-center'>
              <ul className='nav nav-pills card-header-pills text-center'>

                <li className="nav-item nav-link"><Link to={"/order/add"} >录入订单</Link></li>

              </ul>
            </div> 
          </div>
        </div>

      </div>
      
    </div>
  )
}
