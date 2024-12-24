import React from 'react'
import logo from '../assets/logo.png'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className='w-full flex justify-center flex-col align-middle'>
      <img src={logo} alt="logo" className="h-2/6 w-2/6 self-center"/>
    </div>
  )
}

export default Home
