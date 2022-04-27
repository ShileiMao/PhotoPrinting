import React, { useEffect, useState } from 'react'
import myLogger from '../../utils/logger'
import OrderItemOverview from './OrderItemOverview'
import { customerQueryOrder } from '../../utils/apiHelper'
import { get } from '../../utils/axios'
import { Link, useParams } from 'react-router-dom'
import TOKEN_KEYS from '../../utils/consts'
import { storeToken } from '../../utils/token'
import { StringUtils } from '../../utils/StringUtils'
import { ToastHeader } from 'react-bootstrap'
import ToastHelper from '../../utils/toastHelper'

export const Orderlist = () => {
  const orderNumber = useParams().orderNum

  const [orderArr, setOrderArr] = useState([]);

  const [queryOrderFaied, setQueryOrderFailed] = useState(false);

  useEffect(() => {
    const fetchOder = async () => {
      let response = await customerQueryOrder(orderNumber);
       
      if(response != null && response.status.toLowerCase() === 'success') {
        let array = new Array();
        array.push(response.data);
        setOrderArr(array);

        myLogger.debug("orderSummary: " + JSON.stringify(response.data));

        storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken);
        storeToken(TOKEN_KEYS.USER_TYPE, response.data.userType);
        storeToken(TOKEN_KEYS.USER_LOGIN, response.data.pddOrderNumber);
        setQueryOrderFailed(false);
        return;
      }


      ToastHelper.showError("查询订单信息失败，请检查订单号。")
      setQueryOrderFailed(true);

    };
    
    fetchOder()
      .catch(console.error);
  }, []) //第二个参数送入空白，防止useeffect死循环


  return (
    <div>
      {
        !queryOrderFaied &&
        orderArr.map((element,index) => {
          console.log("key ----- " + element.pddOrderNumber);
          return <OrderItemOverview order={element} key={element.pddOrderNumber}/>
        })
        ||
        queryOrderFaied &&
        <p>订单不存在，请检查订单号，或者<li className="nav-item nav-link"><Link to={"/order/add"} >录入订单</Link></li></p>
      }
        
    </div>
  )
}
