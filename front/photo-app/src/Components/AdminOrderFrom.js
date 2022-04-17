import React from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OrderStatus, Packaging, parsePackagingDbValue, parsePhotoSizeDbValue, parsOrderStatusDbValue, PhotoSize } from "../config/Consts";
import ToastHelper from "../utils/toastHelper";

export default function AdminOrderFrom({isEditing, preFillData, editOrderApi, addOrderApi, isCustomer}) {
  const navigate = useNavigate();

  const formatedData = {...preFillData};
  if(isEditing && preFillData != null && preFillData != undefined) {
    formatedData.addressDetails = formatedData.postAddrDetailStr;
    formatedData.address = formatedData.postAddressStr;
    formatedData.photoSize = parsePhotoSizeDbValue(preFillData.photoSize);
    formatedData.packaging = parsePackagingDbValue(preFillData.packaging);
    formatedData.status = parsOrderStatusDbValue(preFillData.status);
  }
  

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: formatedData
  });

  const onSubmit = async data => { 
    console.log(data);

    if(isCustomer) {
      data.status = OrderStatus[0].value;
    }

    if(isEditing) {
      let postData = {...data, id: preFillData.id, postAddr: preFillData.postAddr}
      
      console.log("update post data: " + JSON.stringify(postData));

      const response = await editOrderApi(postData);

      if(response.status.toLowerCase() !== 'success') {
        ToastHelper.showError(response.error);
        return;
      }

      if(!isCustomer) {
        navigate("/admin/orders")
      } else {
        navigate("/order/" + data.pddOrderNumber)
      }
      
      return;
    }

    const response = await addOrderApi(data);
    if(response.status.toLowerCase() !== 'success') {
      ToastHelper.showError(response.error);
      return;
    }
  
    if(!isCustomer) {
      navigate("/admin/orders")
    } else {
      navigate("/order/" + data.pddOrderNumber)
    }
  }

  return (
    <form className="needs-validation row g-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <label className='form-label'>订单号：</label>
        <input className="form-control" {...register("pddOrderNumber", {required: true, minLength: 12})} />
        <p className="invalid-feedback" style={{display: `block`}}>
          {errors.pddOrderNumber?.type === 'required' && "请输入订单号"}
          {errors.pddOrderNumber?.type === 'minLength' && "订单号长度至少12位"}
        </p>
      </div>
      
      <div className="form-row">
        <label className='form-label'>标题：</label>
        <input className="form-control" {...register("title", {required: true})} />
        <p className="invalid-feedback" style={{display: `block`}}>
          {errors.title?.type === 'required' && "请输入标题"}
        </p>
      </div>

      <div className="from-row">
        <label className='form-label'>描述：</label>
        <input type={"text"} className="form-control" {...register("description", {required: false})} />
      </div>

      

        <div className="col-3 mb-3">
          <label className='form-label'>照片数量：</label>
          <input className="form-control" {...register("numPhotos", {required: true, defaultValue: 10, min: 10})} />
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.numPhotos?.type === 'required' && "请输入张数"}
          </p>
        </div>

        <div className="col-3 mb-3">
          <label className='form-label'>照片尺寸：</label>
          <select className="form-control" {...register("photoSize", {required: true})} >
            {
              PhotoSize.map(item => {
                return (
                  <option key={item.value} value={item.value}>{item.text}</option>
                )
              })
            }
          </select>
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.photoSize?.type === 'required' && "请选择尺寸"}
          </p>
        </div>

        <div className="col-3 mb-3">
          <label className="form-label">包装：</label>
          <select className="form-control" {...register("packaging", {required: true})}>
            {
              Packaging.map(item => {
                return (
                  <option key={item.value} value={item.value}>{item.text}</option>
                )
              })
            }
          </select>
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.packaging?.type === 'required' && "请选择包装"}
          </p>
        </div> 
        
        {
          !isCustomer &&
          <div className="col-3 mb-3">
            <label className='form-label'>状态：</label>
            <select className="form-control" {...register("status", {required: true}) }>
              {
                OrderStatus.map(item => {
                  return (
                    <option key={item.value} value={item.value}>{item.text}</option>
                  )
                })
              }
            </select>

            <p className="invalid-feedback" style={{display: `block`}}>
              {errors.status?.type === 'required' && "请选择状态"}
            </p>
          </div>
        }


      <div className='col-md-4 mb-3'>
        <label className='form-label'>电话：</label>
        <input className="form-control" {...register("phoneNumber",{required: true, pattern: "/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/"})}/>
        <p className="invalid-feedback" style={{display: `block`}}>
          {errors.phoneNumber?.type === 'required' && "请输入电话号码"}
          {errors.phoneNumber?.type === 'pattern' && "请输入正确的电话号码"}
        </p>
      </div>

      <div className="col-md-8 mb-3">
        <label className='form-label'>地址：</label>
        <input className="form-control" {...register("address",{required: true})}/>
        <p className="invalid-feedback" style={{display: `block`}}>
          {errors.address?.type === 'required' && "请输入邮寄地址"}
        </p>
      </div>

      <div className="form-row">
        <label className="form-label">详细地址：</label>
        <input className="form-control" {...register("addressDetails", {required: true})}/>
        <p className="invalid-feedback" style={{display: `block`}}>
          {errors.addressDetails?.type === 'required' && "请输入邮寄地址"}
        </p>
      </div>
    
      
      <div className="form-row">
        <input type="submit" className="btn btn-primary" value={"提交"}/>
      </div>
      
    </form>
  )
}
