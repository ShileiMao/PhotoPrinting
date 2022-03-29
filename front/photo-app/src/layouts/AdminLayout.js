import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AdminNavigator } from '../routes/admin/AdminNavigator'

export const AdminLayout = ({navigation}) => {
  const [showNavBar, setShowNavBar] = useState(false)
  const [currentUri, setCurrentUri] = useState('')

  console.log("location: " + JSON.stringify(navigation))
  return (
    <div className='container'>
        {showNavBar &&
            <AdminNavigator currentPage={currentUri} />
        }
      <div id="page-wrapper">
        <div id="page-inner">
          <Outlet context={[currentUri, setCurrentUri]}/>
        </div>
      </div>

      <div className="footer footer mt-auto py-3 position-relative">
          <div className='row justify-content-md-center'>
            <Link className="col-md-auto badge badge-pill badge-info nav-link" to={"/queryOrder"}>查询订单</Link>
            <Link className="col-md-auto badge badge-pill badge-info nav-link" to={"/admin"}>管理员登陆</Link>
            <Link className='col-md-auto badge badge-pill badge-info nav-link' to={"/admin/orders/add"}>手动录入订单</Link>
          </div>
      </div>
    </div>
  )
}
