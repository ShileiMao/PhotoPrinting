import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import ic_logo from '../imgs/logo.png';

export const MainLayout = () => {
  return (
    <div className='toggle-sidebar'>
      <header id="header" className="header fixed-top d-flex align-items-center header-scrolled">

        <div className="d-flex align-items-center justify-content-between">
          <Link to={""} className="logo d-flex align-items-center">
            <img src={ic_logo} alt="" />
            <span className="d-none d-lg-block">叙青春数码冲印</span>
          </Link>
          
        </div>
        {/* <!-- End Logo --> */}

        <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">

          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle " href="#">
              <i className="bi bi-search"></i>
            </a>
          </li>
          {/* <!-- End Search Icon--> */}

          <li className="nav-item dropdown pe-3">


            {/* <!-- End Profile Iamge Icon --> */}

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>Kevin Anderson</h6>
                <span>Web Designer</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </a>
              </li>

            </ul>
            {/* <!-- End Profile Dropdown Items --> */}
          </li>
          {/* <!-- End Profile Nav --> */}

        </ul>
        </nav>
        {/* <!-- End Icons Navigation --> */}
      </header>
      <div id='main' className='main container-fluid'>
        
        <Outlet />
      </div>
    </div>
  )
}
