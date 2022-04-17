import React, { useEffect, useState } from 'react'
import myLogger from '../../utils/logger'
import OrderItemOverview from './OrderItemOverview'
import { customerQueryOrder } from '../../utils/apiHelper'
import { get } from '../../utils/axios'
import { useParams } from 'react-router-dom'
import TOKEN_KEYS from '../../utils/consts'
import { storeToken } from '../../utils/token'
import { StringUtils } from '../../utils/StringUtils'

export const Orderlist = () => {
  const orderNumber = useParams().orderNum

  const [orderArr, setOrderArr] = useState([]);

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
      }
    };
    
    fetchOder()
      .catch(console.error);
  }, []) //第二个参数送入空白，防止useeffect死循环


  return (
    <div>
      {orderArr.map((element,index) => {
        console.log("key ----- " + element.pddOrderNumber);
        return <OrderItemOverview order={element} key={element.pddOrderNumber}/>
      })}    
    </div>
  )
}
