import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { userLogin } from '../../utils/apiHelper'
import TOKEN_KEYS from '../../utils/consts'
import { storeToken } from '../../utils/token'

export const Login = (props) => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const handleUserNameEnter = (e) => setUserName(e.target.value);
  const handlePwdEnter = (e) => setPassword(e.target.value);
  
  const navigate = useNavigate();

  const [currentUri, setCurrentUri] = useOutletContext()
 
  const performLogin = async () => {
    const response = await userLogin(userName, password);
    if(response.status.toLowerCase() === 'error') {
        console.log("failed login")
        return;
    }

    console.log("success: " + JSON.stringify(response));
    storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
    storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
    storeToken(TOKEN_KEYS.USER_TYPE, response.data.userType);
    storeToken(TOKEN_KEYS.USER_LOGIN, response.data.loginName);
    navigate("/admin/orders")
  }

  return (
    <div className="auth-wrapper">
        <div className="auth-inner">
            <h3>管理员登陆</h3>
            <div className="form-group">
                <label>用户名</label>
                <input type="text" className="form-control" placeholder="输入用户名" value={userName} onChange={handleUserNameEnter} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="输入密码" value={password} onChange={handlePwdEnter}/>
            </div>
            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
            </div>
            <button className="btn btn-primary btn-block" onClick={performLogin}>登 陆</button>
            {/* <p className="forgot-password text-right">
                Forgot <a href="/">password?</a>
            </p> */}
        </div>
    </div >
  )
}
