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

//   const [currentUri, setCurrentUri] = useOutletContext()
 
  const performLogin = async () => {
    const response = await userLogin(userName, password);
    if(response.status.toLowerCase() === 'error') {
        console.log("failed login")
        return;
    }

    storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
    storeToken(TOKEN_KEYS.ACCESS_TOKEN, response.accessToken);
    storeToken(TOKEN_KEYS.USER_TYPE, response.data.userType);
    storeToken(TOKEN_KEYS.USER_LOGIN, response.data.loginName);

    const user = {
        name: userName,
        token: response.accessToken
    }
    props.setUser(user);
    navigate("/admin/orders")
  }

  console.log("showing login  page ....");

  return (
    <div className="container">
        <div className="row g-3 needs-validation">
            <h3 className='text-info'>管理员登陆</h3>
            <div className="form-group">
                <label className='text-info'>用户名</label>
                <input type="text" className="form-control" placeholder="输入用户名" value={userName} onChange={handleUserNameEnter} />
            </div>
            <div className="form-group">
                <label className='text-info'>密码</label>
                <input type="password" className="form-control" placeholder="输入密码" value={password} onChange={handlePwdEnter}/>
            </div>
            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label text-info" htmlFor="customCheck1">记住我</label>
                </div>
            </div>
            <div className='row justify-content-md-center'>
                <button className="btn btn-primary" onClick={performLogin}>登 陆</button>
            </div>
            
            {/* <p className="forgot-password text-right">
                Forgot <a href="/">password?</a>
            </p> */}
        </div>
    </div >
  )
}
