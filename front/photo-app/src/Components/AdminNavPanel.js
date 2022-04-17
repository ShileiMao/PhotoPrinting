import React from 'react'
import { Link } from 'react-router-dom'

export const AdminNavPanel = () => {
  return (


    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">

        <li className="nav-item">
          <Link className="nav-link " to={"/admin/orders"} >
            <i className="bi bi-grid"></i>
            <span>订单</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to={"/admin/orders/add"} className="nav-link ">
            <i className="bi bi-grid"></i>
            <span>手动录入订单</span>
          </Link>
        </li>

        {/* <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-layout-text-window-reverse"></i><span>Tables</span><i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="tables-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
              <a href="tables-general.html">
                <i className="bi bi-circle"></i><span>General Tables</span>
              </a>
            </li>
            <li>
              <a href="tables-data.html">
                <i className="bi bi-circle"></i><span>Data Tables</span>
              </a>
            </li>
          </ul>
        </li> */}

      </ul>
    </aside>
    
  )
}
