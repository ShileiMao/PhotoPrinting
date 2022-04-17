import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { AdminNavPanel } from '../Components/AdminNavPanel';
import ic_logo from '../imgs/logo.png';
import ic_profile from '../imgs/profile-img.jpg';

export const AdminLayout = ({navigation, user}) => {
  const [currentUri, setCurrentUri] = useState('');
  const location = useLocation();

  return (
    <>
    <header id="header" className="header fixed-top d-flex align-items-center header-scrolled">

      <div className="d-flex align-items-center justify-content-between">
        <Link to={"/admin"} className="logo d-flex align-items-center">
          <img src={ic_logo} alt="" />
          <span className="d-none d-lg-block">管理后台</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn"></i>
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

            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <img src={ic_profile} alt="Profile" className="rounded-circle" />
              <span className="d-none d-md-block dropdown-toggle ps-2">{user.name}</span>
            </a>
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

    <AdminNavPanel />
    <main id='main' className='main'>
      <Outlet context={[currentUri, setCurrentUri]}/>
    </main>
    <footer id='footer' className="text-center">
     
      <div className="copyright">
        © 版权所有 <strong><span>叙青春</span></strong>
      </div>
    </footer>
    </>
  )
}
