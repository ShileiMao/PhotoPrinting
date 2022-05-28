import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createUser, logout } from '../../utils/apiHelper';
import TOKEN_KEYS from '../../utils/consts';
import { StringUtils } from '../../utils/StringUtils';
import ToastHelper from '../../utils/toastHelper';
import { getToken } from '../../utils/token';

export const CreateAccount = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
  });

  const navigate = useNavigate();

  const onSubmit = async data => { 
    let pwd = data.pwd;
    let confirmPwd = data.confirmPwd;

    
    console.log("create user")

    let submitData = {...data};


    if(StringUtils.isEmpty(pwd)) {
        ToastHelper.showError("请输入密码");
        return;
    }

    if(StringUtils.isEmpty(pwd) || StringUtils.isEmpty(confirmPwd)) {
      ToastHelper.showError("请输入新密码");
      return;
    }

    if(pwd !== confirmPwd) {
      ToastHelper.showError("两次密码不一致");
      return;
    }

    delete submitData.confirmPwd;
    
    const response = await createUser(submitData);
    if(response.status.toLowerCase() !== "success") {
      ToastHelper.showError(response.error);
      return;
    }

    console.log("----add user success")
    ToastHelper.showDefault("成功！");

    const userLogin = getToken(TOKEN_KEYS.USER_LOGIN);
    
    await logout(userLogin, null);
    
    navigate("/admin", {replace: true});
  }

  return (
    <div className='row card'>
      <div className="section card-body">
        <div className="pt-4 pb-2">
          <h5 className="card-title text-center pb-0 fs-4">创建新账户</h5>
        </div>
        <form className="needs-validation row g-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <label className='form-label'>用户名</label>
              <input className="form-control" type="text" {...register("name", {required: true})} />
              <p className="invalid-feedback" style={{display: `block`}}>
                {errors.name?.type === 'required' && "请输入用户名"}
              </p>
            </div>
          
            <div className="form-row">
              <label className='form-label'>登录名</label>
              <input className="form-control" type="text" {...register("loginName", {required: true})} />
              <p className="invalid-feedback" style={{display: `block`}}>
                {errors.loginName?.type === 'required' && "请输入登录名"}
              </p>
            </div>
          
            <div className="form-row">
              <label className='form-label'>密码：</label>
              <input className="form-control" type="password" {...register("pwd", {required: true, minLength: 8})} />
              <p className="invalid-feedback" style={{display: `block`}}>
              {errors.pwd?.type === 'required' && "请输入密码"}
                {errors.pwd?.type === 'minLength' && "密码长度至少8位"}
              </p>
            </div>

            <div className="form-row">
              <label className='form-label'>确认密码：</label>
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
