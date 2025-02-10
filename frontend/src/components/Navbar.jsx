import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegHeart, FaCartShopping } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { IoHomeOutline } from "react-icons/io5";
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo.png'
import useLogout from '../hooks/useLogout';
import Cart from './Cart'

const Navbar = () => {
  const { auth } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logout = useLogout();

  const logOut = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block sticky top-0 left-0 bg-white shadow-md z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/" className="text-xl font-bold">
                <img src={logo} alt="" className='h-16 w-16' />
              </NavLink>
              <div className="ml-6 flex space-x-4">
                <NavLink to="/" className="p-2 hover:text-blue-600">
                  Home
                </NavLink>
                <NavLink to="/shop" className="p-2 hover:text-blue-600">
                  Shop
                </NavLink>
                {/* <NavLink to="/posts" className="p-2 hover:text-blue-600">
                  Posts
                </NavLink> */}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* <NavLink to="/cart" className="p-2 flex flex-col items-center text-sm">
                <FaCartShopping size="20" />
                <span>Cart</span>
              </NavLink> */}
              <Cart/>
              <NavLink to="/wishlist" className="p-2 mt-2 flex flex-col items-center text-sm">
                <FaRegHeart size="18" />
                <span>Wishlist</span>
              </NavLink>

              {auth?.loggedIn ? (
                <div className="relative group">
                  <NavLink to="/profile" className="p-2 mt-1 flex flex-col items-center text-sm">
                    {auth?.profilePic?.url ? (
                      <img
                        src={auth.profilePic.url}
                        alt={auth.profilePic.alt}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <CgProfile className="w-6 h-6" />
                    )}
                    <span>{auth.name || "Profile"}</span>
                  </NavLink>

                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <NavLink to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        My Profile
                      </NavLink>
                      <NavLink to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Orders
                      </NavLink>
                      <NavLink to="/help" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Help
                      </NavLink>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={logOut}
                      >
                        <FiLogOut className="w-5 h-5 mr-2" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink to="/login" className="std-btn">
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 md:mt-16 bg-white shadow-lg z-10">
        {/* Mobile Bottom Nav Bar */}
        <div className="flex justify-around items-center h-16">
          <NavLink 
            to="/" 
            className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <IoHomeOutline size="24" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>

          <NavLink 
            to="/shop" 
            className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <IoHomeOutline size="24" />
            <span className="text-xs mt-1">Design</span>
          </NavLink>

          {/* <NavLink 
            to="/" 
            className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <FaCartShopping size="24" />
            <span className="text-xs mt-1">Cart</span>
            </NavLink> */}
            <div
            className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <Cart/>
            </div>

          <NavLink 
            to="/wishlist" 
            className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
          >
            <FaRegHeart size="24" />
            <span className="text-xs mt-1">Wishlist</span>
          </NavLink>

          {auth?.loggedIn ? (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center p-2 text-gray-600"
            >
              {auth?.profilePic?.url ? (
                <img
                  src={auth.profilePic.url}
                  alt={auth.profilePic.alt}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <CgProfile size="24" />
              )}
              <span className="text-xs mt-1">Profile</span>
            </button>
          ) : (
            <NavLink 
              to="/login" 
              className={({isActive}) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <CgProfile size="24" />
              <span className="text-xs mt-1">Login</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Profile Menu */}
        {isMenuOpen && auth?.loggedIn && (
          <div className="absolute bottom-full w-full bg-white shadow-lg rounded-t-lg overflow-hidden">
            <div className="py-2">
              <NavLink
                to="/profile"
                className="block px-4 py-3 hover:bg-gray-100"
                onClick={closeMenu}
              >
                My Profile
              </NavLink>
              <NavLink
                to="/orders"
                className="block px-4 py-3 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Orders
              </NavLink>
              <NavLink
                to="/help"
                className="block px-4 py-3 hover:bg-gray-100"
                onClick={closeMenu}
              >
                Help
              </NavLink>
              <button
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
                onClick={logOut}
              >
                <FiLogOut className="w-5 h-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;