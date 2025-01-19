import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function Layout({nav=true}) {
  return (
    <>
        {nav&&<Navbar/>}
        <div className="pb-16 md:p-0">
          <Outlet/>
        </div>
    </>
  )
}

export default Layout
