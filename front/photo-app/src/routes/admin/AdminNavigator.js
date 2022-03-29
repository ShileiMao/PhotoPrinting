import React from 'react'
import { Link } from 'react-router-dom'

export const AdminNavigator = ({currentPage}) => {
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary" role="navigation">
            <div className="container-fluid">
                <ul className="nav" id="main-menu">
                    <li>
                        <Link to={'/admin/orders'} className={ currentPage === '/admin/orders' && "active-menu"}><i class="fa fa-dashboard "></i>系统首页</Link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
  )
}
