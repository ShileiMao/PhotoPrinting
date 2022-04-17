import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminPageHeader({title, subRoutes}) {
  return (
    <div className="pagetitle">
      <h1>{title}</h1>
      <nav>
        <ol className="breadcrumb">
          {
            subRoutes.map( item => {
              return (
                <li key={item.path} className='breadcrumb-item'><Link to={item.path}>{item.title}</Link></li>
              )
            })
          }
        </ol>
      </nav>
    </div>
  )
}
