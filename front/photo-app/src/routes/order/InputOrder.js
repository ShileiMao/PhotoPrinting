import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AdminOrderFrom from '../../Components/AdminOrderFrom';
import { customerAddOrder, customerEditOrder, customerQueryOrder } from '../../utils/apiHelper'
import ToastHelper from '../../utils/toastHelper';
import AdminAddOrder from '../admin/AdminAddOrder'

export default function InputOrder({isEditing}) {

  const orderNum = useParams().orderNum;
  const [preFillData, setPrefillData] = useState(null);
  const [orderNotExists, setOrderNotExists] = useState(false);

  useEffect(() => {
    if(!isEditing) {
      return;
    }
    
    const queryOrderReq = async () => {
      let response = await customerQueryOrder(orderNum)

      if(response === null || response.status.toLowerCase() === 'error') {
        ToastHelper.showError(response.error || "加载订单信息失败，请重试");
        setOrderNotExists(true);
        return;
      }

      if(response != null && response.data) {
        setPrefillData(response.data);
      }
    };

    queryOrderReq()
      .catch(console.error);
  }, []);

  return (
    <div className='row'>
    
      <div className="row">
        <div className="card">
          <div className="card-body ">
            {
              orderNotExists && 
              <h5 className="card-title">订单信息不存在</h5>  
            }
            {
              !orderNotExists &&
              <h5 className="card-title">请输入信息</h5>
            }
            
            {
              !orderNotExists && isEditing && !preFillData &&
              <div className="text-center p-3">
                <span className="spinner-border spinner-border-sm align-center"></span>
                <span className="sr-only">加载中...</span>
              </div>
            }

            { !orderNotExists && (!isEditing || preFillData) &&
              <AdminOrderFrom preFillData={preFillData} isEditing={isEditing} isCustomer={true} addOrderApi={customerAddOrder} editOrderApi={customerEditOrder} />
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}
