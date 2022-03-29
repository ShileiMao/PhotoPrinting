import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OrderStatus, Packaging, PhotoSize } from "../../config/Consts";
import { addminAddOrder } from "../../utils/apiHelper";
import ToastHelper from "../../utils/toastHelper";


export default function AdminAddOrder() {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async data => { 
    console.log(data);
    const response = await addminAddOrder(data);
    if(response.status.toLowerCase() !== 'success') {
      ToastHelper.showError(response.error);
      return;
    }
    

    navigate("/admin/orders")
  }

  const [loggedIn, setLoggedIn] = useState(false)
   
  return (
    <div className="container">
      
      <h3 className="text-info">添加订单信息</h3>
      
      <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <label className='text-info '>订单号：</label>
          <input className="form-control" {...register("pddOrderNumber", {required: true, minLength: 12})} />
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.pddOrderNumber?.type === 'required' && "请输入订单号"}
            {errors.pddOrderNumber?.type === 'minLength' && "订单号长度至少12位"}
          </p>
        </div>
        
        <div className="form-row">
          <label className='text-info'>标题：</label>
          <input className="form-control" {...register("title", {required: true})} />
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.title?.type === 'required' && "请输入标题"}
          </p>
        </div>

        <div className="from-row">
          <label className='text-info'>描述：</label>
          <input type={"text"} className="form-control" {...register("description", {required: false})} />
        </div>

        <div className="row">
          <div className="col-md-2 mb-3">
            <label className='text-info'>照片数量：</label>
            <input className="form-control" {...register("numPhotos", {required: true, defaultValue: 10, min: 10})} />
            <p className="invalid-feedback" style={{display: `block`}}>
              {errors.numPhotos?.type === 'required' && "请输入张数"}
            </p>
          </div>

          <div className="col-md-3 mb-3">
            <label className='text-info'>照片尺寸：</label>
            <select className="form-control" {...register("photoSize", {required: true})} >
              {
                PhotoSize.map(item => {
                  return (
                    <option value={item.value}>{item.text}</option>
                  )
                })
              }
            </select>
            <p className="invalid-feedback" style={{display: `block`}}>
              {errors.photoSize?.type === 'required' && "请选择尺寸"}
            </p>
          </div>

          <div className="col-md-3 mb-3">
            <label className="text-info">包装：</label>
            <select className="form-control" {...register("packaging", {required: true})} >
              {
                Packaging.map(item => {
                  return (
                    <option value={item.value}>{item.text}</option>
                  )
                })
              }
            </select>
            <p className="invalid-feedback" style={{display: `block`}}>
              {errors.packaging?.type === 'required' && "请选择包装"}
            </p>
          </div> 

          <div className="col-md-3 mb-3">
            <label className='text-info'>状态：</label>
            <select className="form-control" {...register("status", {required: true}) } >
              {
                OrderStatus.map(item => {
                  return (
                    <option value={item.value}>{item.text}</option>
                  )
                })
              }
            </select>

            <p className="invalid-feedback" style={{display: `block`}}>
              {errors.status?.type === 'required' && "请选择状态"}
            </p>
          </div>
        </div>

        <div className="form-row">
          <label className='text-info'>地址：</label>
          <input className="form-control" {...register("address",{required: true})} />
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.address?.type === 'required' && "请输入邮寄地址"}
          </p>
        </div>

        <div className="form-row">
          <label className="text-info">详细地址：</label>
          <input className="form-control" {...register("addressDetails", {required: true})} />
          <p className="invalid-feedback" style={{display: `block`}}>
            {errors.addressDetails?.type === 'required' && "请输入邮寄地址"}
          </p>
        </div>
       
        
        <div className="form-row">
          <input type="submit" className="btn btn-primary" />
        </div>
        
      </form>

    </div>
  );
}
