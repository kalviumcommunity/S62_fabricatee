import React from 'react'
import logo from '../assets/logo.png'
import {NavLink} from 'react-router-dom'
import { FaRegHeart } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import wardrobe from '../assets/wardrobe.svg'

function Navbar() {
  return (
    <nav className='flex px-9 justify-between items-center h-[20%] shadow-md w-full'>
        <div className='left flex flex-row py-4 justify-center items-center'>
            {/* <img src={logo} alt="" className='w-[50px] h-[50px] mx-4 my-1'/> */}
            <NavLink to='/' className='p-4'>Home</NavLink>
            <NavLink to='/shop' className='p-4'>Shop</NavLink>
            <NavLink to='/about' className='p-4'>About</NavLink>
            <NavLink to='/help' className='p-4'>Help</NavLink>
        </div>
        <div className='right flex flex-row justify-center items-center'>
            <NavLink to='/waldrobe' className='p-4 h-full flex justify-stretch items-center flex-col text-sm'>
                <img src={wardrobe} className='w-[1.25rem] mb-1'/>
                My Waldrobe
            </NavLink>
            <NavLink to='/wishlist' className='p-4 h-full flex justify-stretch items-center flex-col text-sm'>
                <FaRegHeart size="18" className='mb-1'/>
                Wishlist
            </NavLink>
            <NavLink to='/profile' className='p-4 h-full flex justify-stretch items-center flex-col text-sm'>
                <CgProfile size="18" className='mb-1'/>
                Profile
            </NavLink>
            
        </div>
    </nav>
  )
}

export default Navbar
