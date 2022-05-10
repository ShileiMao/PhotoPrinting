import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminOrderFrom from "../../Components/AdminOrderFrom";
import AdminPageHeader from "../../Components/AdminPageHeader";
import { addminAddOrder, adminEditOrder, adminQueryOrder } from "../../utils/apiHelper";
import { get } from "../../utils/axios";
import myLogger from "../../utils/logger";
import { StringUtils } from "../../utils/StringUtils";
import ToastHelper from "../../utils/toastHelper";

export default function AdminAddOrder({isEditing}) {
  const navigate = useNavigate();
  const orderNum = useParams().orderNum;

  const [preFillData, setPrefillData] = useState(null);

  const [orderNotExists, setOrderNotExists] = useState(false);

  useEffect(() => {
    if(!isEditing) {
      return;
    }
    
    const queryOrderReq = async () => {
      let response = await adminQueryOrder(orderNum)
      
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

  const [loggedIn, setLoggedIn] = useState(false)
   
  const routes = [
    {
      path: "/admin",
      title: "首页"
    },
    {
      path: "/admin/orders",
      title: "订单"
    },

    isEditing ? {
      path: "/admin/orders/edit/" + orderNum,
      title: "修改订单"
    } :
    {
      path: "/admin/orders/add",
      title: "手动录入订单"
    }];

  return (
    <div className="container">
      
      <AdminPageHeader title={isEditing ? "修改订单信息" : "添加订单信息"} subRoutes={routes} />

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
              <AdminOrderFrom preFillData={preFillData} isEditing={isEditing} isCustomer={false} addOrderApi={addminAddOrder} editOrderApi={adminEditOrder} />
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}
