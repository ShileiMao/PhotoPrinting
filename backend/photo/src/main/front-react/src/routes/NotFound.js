import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <main>
      <div class="container">

        <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h2>您访问问的资源不存在</h2>
          <Link to={""} className="btn">
            返回首页
          </Link>
          {/* <img src="assets/img/not-found.svg" class="img-fluid py-5" alt="Page Not Found" /> */}
          <div class="credits">
          </div>
        </section>
      </div>
    </main>
  )
}
