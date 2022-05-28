import React from 'react'
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { changePwd, logout } from '../../utils/apiHelper';
import TOKEN_KEYS from '../../utils/consts';
import { StringUtils } from '../../utils/StringUtils';
import ToastHelper from '../../utils/toastHelper';
import { getToken } from '../../utils/token';

export default function AccountSettings() {
  const { register, handleSubmit, formState: { errors } } = useForm({
  });

  const navigate = useNavigate();

  const onSubmit = async data => { 
    let oldPwd = data.currPwd;
    let newPwd = data.newPwd;
    let confirmPwd = data.confirmPwd;

    console.log("chagne pwd")
    if(StringUtils.isEmpty(oldPwd)) {
        ToastHelper.showError("请输入密码");
        return;
    }

    if(StringUtils.isEmpty(newPwd) || StringUtils.isEmpty(confirmPwd)) {
      ToastHelper.showError("请输入新密码");
      return;
    }

    if(newPwd !== confirmPwd) {
      ToastHelper.showError("两次密码不一致");
      return;
    }

    const userLogin = getToken(TOKEN_KEYS.USER_LOGIN);
    const response = await changePwd(userLogin, oldPwd, newPwd);
    if(response.status.toLowerCase() !== "success") {
      ToastHelper.showError(response.error);
      return;
    }

    ToastHelper.showDefault("成功！");

    await logout(userLogin, newPwd);
    
    navigate("/admin", {replace: true});
  }


  return (

    <div className='row card'>
      <div className="section card-body">
        <div className="pt-4 pb-2">
          <h5 className="card-title text-center pb-0 fs-4">修改密码</h5>
        </div>
        <form className="needs-validation row g-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <label className='form-label'>当前密码：</label>
              <input className="form-control" type="password" {...register("currPwd", {required: true, minLength: 8})} />
              <p className="invalid-feedback" style={{display: `block`}}>
                {errors.currPwd?.type === 'required' && "请输入当前密码"}
                {errors.currPwd?.type === 'minLength' && "密码长度至少8位"}
              </p>
            </div>
          
          
            <div className="form-row">
              <label className='form-label'>新密码：</label>
              <input className="form-control" type="password" {...register("newPwd", {required: true, minLength: 8})} />
              <p className="invalid-feedback" style={{display: `block`}}>
              {errors.newPwd?.type === 'required' && "请输入新密码"}
                {errors.newPwd?.type === 'minLength' && "密码长度至少8位"}
              </p>
            </div>

            <div className="form-row">
              <label className='form-label'>确认新密码：</label>
              <input className="form-control" type="password" {...register("confirmPwd", {required: true, minLength: 8})} />
              <p className="invalid-feedback" style={{display: `block`}}>
              {errors.confirmPwd?.type === 'required' && "请输入确认密码"}
                {errors.confirmPwd?.type === 'minLength' && "密码长度至少8位"}
              </p>
            </div>

            
            <div className="form-row">
              <input type="submit" className="btn btn-primary" value={"提交"}/>
            </div>
            
          </form>
      </div>
    </div>
  )
}
