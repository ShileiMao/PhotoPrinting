import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export const MainLayout = () => {
  return (

    <div>
      {/* <div className='bs-component'>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid navbar-collapse collapse">
            <ul className='navbar-nav me-auto'>
              <li className='nav-item'><Link className="nav-link" to={"/queryOrder"}>查询订单</Link></li>
              <li className='nav-item'><Link className="nav-link" to={"/admin"}>管理员登陆</Link></li>
            </ul>
          </div>
        </nav>
      </div> */}
      <Outlet />
    </div>
  )
}
