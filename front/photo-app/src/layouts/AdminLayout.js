import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminNavigator } from '../routes/admin/AdminNavigator'

export const AdminLayout = ({navigation}) => {
  const [showNavBar, setShowNavBar] = useState(false)
  const [currentUri, setCurrentUri] = useState('')

  console.log("location: " + JSON.stringify(navigation))
  return (
    <div>
        {showNavBar &&
            <AdminNavigator currentPage={currentUri} />
        }
    <div id="page-wrapper">
      <div id="page-inner">
        <Outlet context={[currentUri, setCurrentUri]}/>
      </div>
    </div>
    </div>
  )
}
