import React, { useEffect, useState } from 'react'
import myLogger from '../../utils/logger'
import OrderItemOverview from './OrderItemOverview'
import { apiGet } from '../../utils/apiHelper'
import { get } from '../../utils/axios'
import { useParams } from 'react-router-dom'
import TOKEN_KEYS from '../../utils/consts'
import { storeToken } from '../../utils/token'

export const Orderlist = () => {
  const orderNumber = useParams().orderNum

  const [orderArr, setOrderArr] = useState([]);

  useEffect(() => {
    const fetchOder = async () => {
      let response = await get("/pdd/queryOrder", {order_number: orderNumber})
      if(response != null) {
        let array = new Array();
        array.push(response);
        setOrderArr(array);

        myLogger.debug("orderSummary: " + JSON.stringify(response));

        storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
        storeToken(TOKEN_KEYS.USER_TYPE, response.userType);
        storeToken(TOKEN_KEYS.USER_LOGIN, response.pddOrderNumber);
      }
    };
    
    fetchOder()
      .catch(console.error);
  }, []) //第二个参数送入空白，防止useeffect死循环


  return (
    <div>
      {orderArr.map((element,index) => {
        return <OrderItemOverview order={element} key={element.pddOrderNumber}/>
      })}    
    </div>
  )
}
